// ==========================================
// MicroCount STEVision
// Browser Image Analysis
// ==========================================

const progressFill =
    document.getElementById("progressFill");

const progressNumber =
    document.getElementById("progressNumber");

const analysisStatus =
    document.getElementById("analysisStatus");

const analysisTitle =
    document.getElementById("analysisTitle");


// ==========================================
// PROGRESS
// ==========================================

function setProgress(value, message) {

    value = Math.max(0, Math.min(100, value));

    progressFill.style.width = value + "%";

    progressNumber.textContent =
        Math.round(value) + "%";

    if (message) {
        analysisStatus.textContent = message;
    }
}


// ==========================================
// GET UPLOADED IMAGES
// ==========================================

const storedImages =
    localStorage.getItem("uploadedImages");


if (!storedImages) {

    analysisTitle.textContent =
        "No microscope images found.";

    analysisStatus.textContent =
        "Please return to Upload and select your microscope images.";

    setProgress(0);

    throw new Error("No uploaded images found.");

}


let images;

try {

    images = JSON.parse(storedImages);

}
catch (error) {

    analysisTitle.textContent =
        "Analysis could not be completed.";

    analysisStatus.textContent =
        "The uploaded image data could not be read.";

    throw error;

}


if (!Array.isArray(images) || images.length === 0) {

    analysisTitle.textContent =
        "No microscope images found.";

    analysisStatus.textContent =
        "Please upload microscope images first.";

    throw new Error("Image array is empty.");

}


// ==========================================
// LOAD IMAGE
// ==========================================

function loadImage(dataURL) {

    return new Promise((resolve, reject) => {

        const img = new Image();

        img.onload = () => resolve(img);

        img.onerror = () =>
            reject(new Error("Image could not be loaded."));

        img.src = dataURL;

    });

}


// ==========================================
// ANALYZE ONE IMAGE
// ==========================================

async function analyzeImage(dataURL) {

    const img =
        await loadImage(dataURL);


    // Limit image size to keep browser fast

    const maxSize = 900;

    let width = img.naturalWidth;
    let height = img.naturalHeight;


    if (width > maxSize || height > maxSize) {

        const scale =
            Math.min(
                maxSize / width,
                maxSize / height
            );

        width =
            Math.round(width * scale);

        height =
            Math.round(height * scale);

    }


    const canvas =
        document.createElement("canvas");

    canvas.width = width;
    canvas.height = height;


    const ctx =
        canvas.getContext("2d", {
            willReadFrequently: true
        });


    ctx.drawImage(
        img,
        0,
        0,
        width,
        height
    );


    const imageData =
        ctx.getImageData(
            0,
            0,
            width,
            height
        );


    const pixels =
        imageData.data;


    const gray =
        new Uint8Array(width * height);


    // ======================================
    // GRAYSCALE
    // ======================================

    for (let i = 0, p = 0; i < pixels.length; i += 4, p++) {

        gray[p] =
            Math.round(
                0.299 * pixels[i] +
                0.587 * pixels[i + 1] +
                0.114 * pixels[i + 2]
            );

    }


    // ======================================
    // OTSU THRESHOLD
    // ======================================

    const threshold =
        otsuThreshold(gray);


    // ======================================
    // BINARY IMAGE
    // ======================================

    const binary =
        new Uint8Array(width * height);


    let foregroundPixels = 0;


    for (let i = 0; i < gray.length; i++) {

        if (gray[i] < threshold) {

            binary[i] = 1;

            foregroundPixels++;

        }

    }


    // If too much of the image is detected,
    // reverse the threshold.

    if (
        foregroundPixels >
        gray.length * 0.45
    ) {

        foregroundPixels = 0;

        for (let i = 0; i < gray.length; i++) {

            if (gray[i] > threshold) {

                binary[i] = 1;

                foregroundPixels++;

            }
            else {

                binary[i] = 0;

            }

        }

    }


    // ======================================
    // CONNECTED COMPONENT ANALYSIS
    // ======================================

    const components =
        findComponents(
            binary,
            width,
            height
        );


    // Ignore extremely small objects

    const minArea =
        Math.max(
            12,
            Math.floor(
                width * height * 0.000015
            )
        );


    const particles =
        components.filter(
            c => c.area >= minArea
        );


    // ======================================
    // CLASSIFY PARTICLES
    // ======================================

    let fragments = 0;
    let fibers = 0;
    let films = 0;
    let foams = 0;
    let pellets = 0;
    let lines = 0;


    particles.forEach(particle => {

        const aspectRatio =
            particle.width /
            Math.max(1, particle.height);


        const ratio =
            Math.max(
                aspectRatio,
                1 / aspectRatio
            );


        const circularity =
            particle.circularity;


        // Very elongated particles

        if (ratio >= 6) {

            lines++;

        }

        else if (ratio >= 3) {

            fibers++;

        }

        // Large thin particles

        else if (
            particle.area >
            width * height * 0.002 &&
            ratio >= 1.8
        ) {

            films++;

        }

        // Round particles

        else if (
            circularity >= 0.65 &&
            ratio < 1.5
        ) {

            pellets++;

        }

        // Foam-like / irregular large particles

        else if (
            particle.area >
            width * height * 0.001
        ) {

            foams++;

        }

        // Remaining particles

        else {

            fragments++;

        }

    });


    return {

        particles: particles.length,

        fragments,
        fibers,
        films,
        foams,
        pellets,
        lines

    };

}


// ==========================================
// OTSU THRESHOLD FUNCTION
// ==========================================

function otsuThreshold(gray) {

    const histogram =
        new Array(256).fill(0);


    for (let i = 0; i < gray.length; i++) {

        histogram[gray[i]]++;

    }


    const total =
        gray.length;


    let sum = 0;

    for (let i = 0; i < 256; i++) {

        sum += i * histogram[i];

    }


    let sumBackground = 0;

    let weightBackground = 0;

    let maxVariance = 0;

    let threshold = 128;


    for (let i = 0; i < 256; i++) {

        weightBackground +=
            histogram[i];


        if (weightBackground === 0)
            continue;


        const weightForeground =
            total -
            weightBackground;


        if (weightForeground === 0)
            break;


        sumBackground +=
            i * histogram[i];


        const meanBackground =
            sumBackground /
            weightBackground;


        const meanForeground =
            (sum - sumBackground) /
            weightForeground;


        const variance =
            weightBackground *
            weightForeground *
            Math.pow(
                meanBackground -
                meanForeground,
                2
            );


        if (variance > maxVariance) {

            maxVariance = variance;

            threshold = i;

        }

    }


    return threshold;

}


// ==========================================
// CONNECTED COMPONENTS
// ==========================================

function findComponents(binary, width, height) {

    const visited =
        new Uint8Array(
            width * height
        );


    const components = [];


    const directions = [

        [-1, -1],
        [0, -1],
        [1, -1],

        [-1, 0],
        [1, 0],

        [-1, 1],
        [0, 1],
        [1, 1]

    ];


    for (let y = 0; y < height; y++) {

        for (let x = 0; x < width; x++) {

            const start =
                y * width + x;


            if (
                binary[start] === 0 ||
                visited[start]
            ) {

                continue;

            }


            const queue = [start];

            visited[start] = 1;


            let area = 0;

            let minX = x;
            let maxX = x;

            let minY = y;
            let maxY = y;


            let index = 0;


            while (index < queue.length) {

                const current =
                    queue[index++];


                const cy =
                    Math.floor(
                        current / width
                    );

                const cx =
                    current -
                    cy * width;


                area++;


                minX =
                    Math.min(minX, cx);

                maxX =
                    Math.max(maxX, cx);

                minY =
                    Math.min(minY, cy);

                maxY =
                    Math.max(maxY, cy);


                for (const [dx, dy] of directions) {

                    const nx =
                        cx + dx;

                    const ny =
                        cy + dy;


                    if (
                        nx < 0 ||
                        nx >= width ||
                        ny < 0 ||
                        ny >= height
                    ) {

                        continue;

                    }


                    const neighbor =
                        ny * width + nx;


                    if (
                        binary[neighbor] &&
                        !visited[neighbor]
                    ) {

                        visited[neighbor] = 1;

                        queue.push(neighbor);

                    }

                }

            }


            const particleWidth =
                maxX - minX + 1;


            const particleHeight =
                maxY - minY + 1;


            const perimeter =
                2 *
                (
                    particleWidth +
                    particleHeight
                );


            const circularity =
                perimeter > 0
                    ? Math.min(
                        1,
                        (
                            4 *
                            Math.PI *
                            area
                        ) /
                        (
                            perimeter *
                            perimeter
                        )
                    )
                    : 0;


            components.push({

                area,

                width:
                    particleWidth,

                height:
                    particleHeight,

                circularity

            });

        }

    }


    return components;

}


// ==========================================
// SAVE RESULTS
// ==========================================

function saveResults(allResults) {

    let totalParticles = 0;

    let fragments = 0;
    let fibers = 0;
    let films = 0;
    let foams = 0;
    let pellets = 0;
    let lines = 0;


    allResults.forEach(result => {

        totalParticles +=
            result.particles;

        fragments +=
            result.fragments;

        fibers +=
            result.fibers;

        films +=
            result.films;

        foams +=
            result.foams;

        pellets +=
            result.pellets;

        lines +=
            result.lines;

    });


    const imageCount =
        allResults.length;


    const average =
        imageCount > 0
            ? (
                totalParticles /
                imageCount
            ).toFixed(2)
            : "0";


    // ======================================
    // RISK LEVEL
    // ======================================

    let riskLevel;
    let riskText;


    if (totalParticles <= 10) {

        riskLevel = "LEVEL 1";

        riskText =
            "Low particle detection";

    }

    else if (totalParticles <= 30) {

        riskLevel = "LEVEL 2";

        riskText =
            "Moderate particle detection";

    }

    else if (totalParticles <= 60) {

        riskLevel = "LEVEL 3";

        riskText =
            "High particle detection";

    }

    else {

        riskLevel = "LEVEL 4";

        riskText =
            "Very high particle detection";

    }


    // ======================================
    // SAVE TO LOCAL STORAGE
    // ======================================

    localStorage.setItem(
        "particles",
        totalParticles
    );


    localStorage.setItem(
        "average",
        average
    );


    localStorage.setItem(
        "totalArea",
        "N/A"
    );


    localStorage.setItem(
        "averageArea",
        "N/A"
    );


    localStorage.setItem(
        "riskLevel",
        riskLevel
    );


    localStorage.setItem(
        "riskText",
        riskText
    );


    localStorage.setItem(
        "fragment",
        fragments
    );


    localStorage.setItem(
        "fiber",
        fibers
    );


    localStorage.setItem(
        "film",
        films
    );


    localStorage.setItem(
        "foam",
        foams
    );


    localStorage.setItem(
        "pellet",
        pellets
    );


    localStorage.setItem(
        "line",
        lines
    );


    // ======================================
    // RECOMMENDATION
    // ======================================

    const waterCondition =
        localStorage.getItem(
            "waterCondition"
        ) || "";


    const daysStored =
        Number(
            localStorage.getItem(
                "daysStored"
            )
        ) || 0;


    let recommendations = [];


    if (
        totalParticles > 30 &&
        waterCondition === "Direct Sunlight"
    ) {

        recommendations.push(
            "Store the water jug or container away from direct sunlight."
        );

    }


    if (totalParticles > 30) {

        recommendations.push(
            "Consider using a suitable filtration system and examine the water source for possible particle contamination."
        );

    }


    if (fibers > fragments) {

        recommendations.push(
            "Because elongated particles were detected frequently, review the condition of storage containers, covers, clothing, and surrounding materials that may contribute fibers."
        );

    }


    if (daysStored >= 7) {

        recommendations.push(
            "Avoid prolonged storage of drinking water and use clean, covered containers."
        );

    }


    if (recommendations.length === 0) {

        recommendations.push(
            "Continue proper water storage, keep containers clean and covered, and conduct regular monitoring."
        );

    }


    localStorage.setItem(
        "recommendations",
        JSON.stringify(
            recommendations
        )
    );


    localStorage.setItem(
        "analysisComplete",
        "true"
    );

}


// ==========================================
// MAIN ANALYSIS
// ==========================================

// ==========================================
// SAVE FINDINGS TO SUPABASE
// ==========================================

async function saveSubmissionToSupabase() {

    const submission = {
        sample_id:
            localStorage.getItem("sampleID") || "",

        school_name:
            localStorage.getItem("schoolName") || "",

        section:
            localStorage.getItem("section") || "",

        source:
            localStorage.getItem("source") || "",

        water_condition:
            localStorage.getItem("waterCondition") || "",

        days_stored:
            Number(localStorage.getItem("daysStored")) || 0,

        magnification:
            localStorage.getItem("totalMagnification") || "",

        num_images:
            Number(localStorage.getItem("numImages")) || 0,

        particles:
            Number(localStorage.getItem("particles")) || 0,

        average:
            Number(localStorage.getItem("average")) || 0,

        total_area:
            null,

        average_area:
            null,

        fragments:
            Number(localStorage.getItem("fragment")) || 0,

        fibers:
            Number(localStorage.getItem("fiber")) || 0,

        films:
            Number(localStorage.getItem("film")) || 0,

        foams:
            Number(localStorage.getItem("foam")) || 0,

        pellets:
            Number(localStorage.getItem("pellet")) || 0,

        lines:
            Number(localStorage.getItem("line")) || 0,

        risk_level:
            localStorage.getItem("riskLevel") || "",

        risk_text:
            localStorage.getItem("riskText") || "",

        recommendations:
            localStorage.getItem("recommendations") || ""
    };

    for (let attempt = 1; attempt <= 3; attempt++) {

        try {

            const { error } =
                await supabaseClient
                    .from("submissions")
                    .insert([submission]);

            if (!error) {

                console.log(
                    "Findings successfully saved to Supabase."
                );

                return true;
            }

            console.error(
                `Supabase attempt ${attempt} failed:`,
                error
            );

        } catch (error) {

            console.error(
                `Supabase attempt ${attempt} error:`,
                error
            );
        }

        await new Promise(
            resolve => setTimeout(resolve, 1000)
        );
    }

    return false;
}
async function startAnalysis() {

    try {

        setProgress(
            5,
            "Loading microscope images..."
        );


        const results = [];


        for (
            let i = 0;
            i < images.length;
            i++
        ) {

            setProgress(
                10 +
                (
                    i /
                    images.length
                ) * 80,

                `Analyzing microscope image ${i + 1} of ${images.length}...`
            );


const imageData =
    typeof images[i] === "string"
        ? images[i]
        : images[i].data;

const result =
    await analyzeImage(imageData);


            results.push(result);


            // Give the browser time to update the screen

            await new Promise(
                resolve =>
                    setTimeout(resolve, 20)
            );

        }


        setProgress(
            92,
            "Calculating particle types..."
        );


        await new Promise(
            resolve =>
                setTimeout(resolve, 100)
        );


saveResults(results);

setProgress(
    92,
    "Saving findings to researcher database..."
);

const saved =
    await saveSubmissionToSupabase();

if (!saved) {

    throw new Error(
        "The analysis was completed, but the findings could not be saved to the researcher database."
    );
}

setProgress(
    100,
    "Analysis complete!"
);


        analysisTitle.textContent =
            "Analysis Complete";


        // Go to results

        setTimeout(() => {

            window.location.href =
                "results.html";

        }, 500);

    }

    catch (error) {

        console.error(
            "MicroCount analysis error:",
            error
        );


        analysisTitle.textContent =
            "Analysis could not be completed.";


        analysisStatus.textContent =
            "Please return to Upload and try again.";


        setProgress(0);

    }

}


// START

startAnalysis();