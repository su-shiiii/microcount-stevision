// ======================================
// MicroCount STEVision
// Results Page
// ======================================


// ======================================
// GET STORED DATA
// ======================================

const schoolName =
    localStorage.getItem("schoolName") ||
    "Dasmariñas East Integrated High School";


const section =
    localStorage.getItem("section") ||
    "STE";


const source =
    localStorage.getItem("source") ||
    "Water Refilling Station";


const sampleID =
    localStorage.getItem("sampleID") ||
    "N/A";


const imageCount =
    Number(localStorage.getItem("numImages")) || 0;


const particleCount =
    Number(localStorage.getItem("particles")) || 0;


const average =
    localStorage.getItem("average") ||
    "0";


const totalArea =
    localStorage.getItem("totalArea") ||
    "0";


const averageArea =
    localStorage.getItem("averageArea") ||
    "0";


const riskLevel =
    localStorage.getItem("riskLevel") ||
    "N/A";


const riskText =
    localStorage.getItem("riskText") ||
    "N/A";


// ======================================
// SAMPLE INFORMATION
// ======================================

document.getElementById("schoolName")
    .textContent = schoolName;


document.getElementById("section")
    .textContent = section;


document.getElementById("source")
    .textContent = source;


document.getElementById("sampleID")
    .textContent = sampleID;


// ======================================
// ANALYSIS SUMMARY
// ======================================

document.getElementById("numImages")
    .textContent = imageCount;


document.getElementById("particleCount")
    .textContent = particleCount;


document.getElementById("average")
    .textContent =
        average + " particles/image";


document.getElementById("totalArea")
    .textContent =
        totalArea + " Fiji/ImageJ area units";


document.getElementById("averageArea")
    .textContent =
        averageArea + " Fiji/ImageJ area units";


// ======================================
// RISK LEVEL
// ======================================

document.getElementById("riskLevel")
    .textContent = riskLevel;


document.getElementById("riskText")
    .textContent = riskText;


const riskBox =
    document.getElementById("riskBox");


if (riskLevel === "LEVEL 1") {

    riskBox.style.background = "#4CAF50";

}

else if (riskLevel === "LEVEL 2") {

    riskBox.style.background = "#FFC107";

}

else if (riskLevel === "LEVEL 3") {

    riskBox.style.background = "#FF9800";

}

else if (riskLevel === "LEVEL 4") {

    riskBox.style.background = "#F44336";

}

// ======================================
// MICROPLASTIC TYPE CLASSIFICATION
// ======================================

// These values should come from your Fiji/ImageJ
// classification/measurement results.

const fragments =
    Number(localStorage.getItem("fragment")) || 0;

const fibers =
    Number(localStorage.getItem("fiber")) || 0;

const films =
    Number(localStorage.getItem("film")) || 0;

const foams =
    Number(localStorage.getItem("foam")) || 0;

const pellets =
    Number(localStorage.getItem("pellet")) || 0;

const lines =
    Number(localStorage.getItem("line")) || 0;


// Calculate percentages
function typePercentage(count) {

    if (particleCount === 0) {
        return "0.0%";
    }

    return ((count / particleCount) * 100).toFixed(1) + "%";
}


// Display classification results

const fragmentCount =
    document.getElementById("fragmentCount");

const fragmentPercent =
    document.getElementById("fragmentPercent");

const fiberCount =
    document.getElementById("fiberCount");

const fiberPercent =
    document.getElementById("fiberPercent");

const filmCount =
    document.getElementById("filmCount");

const filmPercent =
    document.getElementById("filmPercent");

const foamCount =
    document.getElementById("foamCount");

const foamPercent =
    document.getElementById("foamPercent");

const pelletCount =
    document.getElementById("pelletCount");

const pelletPercent =
    document.getElementById("pelletPercent");

const lineCount =
    document.getElementById("lineCount");

const linePercent =
    document.getElementById("linePercent");


if (fragmentCount)
    fragmentCount.textContent = fragments;

if (fragmentPercent)
    fragmentPercent.textContent =
        typePercentage(fragments);


if (fiberCount)
    fiberCount.textContent = fibers;

if (fiberPercent)
    fiberPercent.textContent =
        typePercentage(fibers);


if (filmCount)
    filmCount.textContent = films;

if (filmPercent)
    filmPercent.textContent =
        typePercentage(films);


if (foamCount)
    foamCount.textContent = foams;

if (foamPercent)
    foamPercent.textContent =
        typePercentage(foams);


if (pelletCount)
    pelletCount.textContent = pellets;

if (pelletPercent)
    pelletPercent.textContent =
        typePercentage(pellets);


if (lineCount)
    lineCount.textContent = lines;

if (linePercent)
    linePercent.textContent =
        typePercentage(lines);

// ======================================
// UPLOADED IMAGE
// ======================================

const imageData =
    localStorage.getItem("uploadedImage");


const uploadedImage =
    document.getElementById("uploadedImage");


const imageMessage =
    document.getElementById("imageMessage");


if (imageData) {

    uploadedImage.src = imageData;

    uploadedImage.style.display = "block";

    imageMessage.textContent = "";

}

else {

    uploadedImage.style.display = "none";

    imageMessage.textContent =
        "No microscope image was saved for this analysis.";

}


// ======================================
// INTERPRETATION
// ======================================

const interpretation =
    document.getElementById("interpretation");


interpretation.innerHTML = `

    Fiji/ImageJ was used as the image-analysis and
    particle-quantification method.

    <br><br>

    <strong>${particleCount}</strong>
    detected particle measurements were recorded
    from the Fiji/ImageJ Results table.

    <br><br>

    The analysis included
    <strong>${imageCount}</strong>
    microscope image(s).

    <br><br>

    The calculated average was
    <strong>${average} particles/image</strong>.

    <br><br>

    The calculated assessment level was
    <strong>${riskLevel}</strong>
    (${riskText}).

`;


// ======================================
// RECOMMENDATION
// ======================================

const recommendation =
    document.getElementById("recommendationText");


if (riskLevel === "LEVEL 1") {

    recommendation.innerHTML = `

        The analyzed sample showed a relatively low
        particle count based on the current assessment.
        Continue proper water storage and handling,
        and maintain regular monitoring.

    `;

}

else if (riskLevel === "LEVEL 2") {

    recommendation.innerHTML = `

        The analyzed sample showed a moderate particle
        count. Consider reviewing the water source,
        storage containers, and handling practices.

    `;

}

else if (riskLevel === "LEVEL 3") {

    recommendation.innerHTML = `

        The analyzed sample showed a high particle count.
        Further examination of the water source and
        additional samples is recommended.

    `;

}

else if (riskLevel === "LEVEL 4") {

    recommendation.innerHTML = `

        The analyzed sample showed a very high particle
        count. Further laboratory verification and
        additional sampling should be considered before
        drawing conclusions about the water source.

    `;

}

else {

    recommendation.textContent =
        "Complete a Fiji/ImageJ analysis to generate recommendations.";

}


// ======================================
// NEW ANALYSIS
// ======================================

document.getElementById("newAnalysisBtn")
    .addEventListener("click", function () {

        localStorage.removeItem("particles");
        localStorage.removeItem("average");
        localStorage.removeItem("totalArea");
        localStorage.removeItem("averageArea");
        localStorage.removeItem("riskLevel");
        localStorage.removeItem("riskText");
        localStorage.removeItem("fijiCSV");
        localStorage.removeItem("uploadedImage");
        localStorage.removeItem("numImages");

        window.location.href = "sample.html";

    });


// ======================================
// DOWNLOAD REPORT
// ======================================

document.getElementById("downloadBtn")
    .addEventListener("click", function () {

        const report = `

MicroCount STEVision
Fiji/ImageJ Microplastic Analysis Report

School Name:
${schoolName}

Section:
${section}

Water Source:
${source}

Sample ID:
${sampleID}

Number of Images:
${imageCount}

Detected Particles:
${particleCount}

Average Particles/Image:
${average}

Total Particle Area:
${totalArea}

Average Particle Area:
${averageArea}

Risk Level:
${riskLevel}

Risk Assessment:
${riskText}

Detection Method:
Fiji/ImageJ Analyze Particles

        `;


        const blob =
            new Blob(
                [report],
                { type: "text/plain" }
            );


        const url =
            URL.createObjectURL(blob);


        const link =
            document.createElement("a");


        link.href = url;

        link.download =
            "MicroCount_STEVision_Report.txt";


        link.click();


        URL.revokeObjectURL(url);

    });