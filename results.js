// ======================================
// MicroCount STEVision
// Results Page
// ======================================


// ======================================
// GET STORED SAMPLE DATA
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

const waterCondition =
    localStorage.getItem("waterCondition") ||
    "N/A";

const daysStored =
    Number(localStorage.getItem("daysStored")) || 0;

const totalMagnification =
    localStorage.getItem("totalMagnification") ||
    "N/A";

const sampleID =
    localStorage.getItem("sampleID") ||
    "N/A";

const imageCount =
    Number(localStorage.getItem("numImages")) || 0;


// ======================================
// GET ANALYSIS DATA
// ======================================

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

const schoolNameElement =
    document.getElementById("schoolName");

if (schoolNameElement) {
    schoolNameElement.textContent = schoolName;
}


const sectionElement =
    document.getElementById("section");

if (sectionElement) {
    sectionElement.textContent = section;
}


const sourceElement =
    document.getElementById("source");

if (sourceElement) {
    sourceElement.textContent = source;
}


const waterConditionElement =
    document.getElementById("waterCondition");

if (waterConditionElement) {
    waterConditionElement.textContent =
        waterCondition;
}


const daysStoredElement =
    document.getElementById("daysStored");

if (daysStoredElement) {
    daysStoredElement.textContent =
        daysStored + " day(s)";
}


const magnificationElement =
    document.getElementById("magnification");

if (magnificationElement) {
    magnificationElement.textContent =
        totalMagnification;
}


const sampleIDElement =
    document.getElementById("sampleID");

if (sampleIDElement) {
    sampleIDElement.textContent = sampleID;
}


// ======================================
// ANALYSIS SUMMARY
// ======================================

const numImagesElement =
    document.getElementById("numImages");

if (numImagesElement) {
    numImagesElement.textContent =
        imageCount;
}


const particleCountElement =
    document.getElementById("particleCount");

if (particleCountElement) {
    particleCountElement.textContent =
        particleCount;
}


const averageElement =
    document.getElementById("average");

if (averageElement) {
    averageElement.textContent =
        average + " particles/image";
}


const totalAreaElement =
    document.getElementById("totalArea");

if (totalAreaElement) {
    totalAreaElement.textContent =
        totalArea + " Fiji/ImageJ area units";
}


const averageAreaElement =
    document.getElementById("averageArea");

if (averageAreaElement) {
    averageAreaElement.textContent =
        averageArea + " Fiji/ImageJ area units";
}


// ======================================
// RISK LEVEL
// ======================================

const riskLevelElement =
    document.getElementById("riskLevel");

if (riskLevelElement) {
    riskLevelElement.textContent =
        riskLevel;
}


const riskTextElement =
    document.getElementById("riskText");

if (riskTextElement) {
    riskTextElement.textContent =
        riskText;
}


const riskBox =
    document.getElementById("riskBox");


if (riskBox) {

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

}
// ======================================
// POSSIBLE HEALTH CONSIDERATIONS
// ======================================

const healthEffects =
    document.getElementById("healthEffects");


if (healthEffects) {

    let healthHTML = `
        <h3>Possible Health Considerations</h3>

        <p>
            This section provides a general interpretation of the
            current scientific evidence on potential health effects
            of microplastic exposure. It is not a diagnosis and does
            not predict what will happen to an individual person.
        </p>
    `;


    if (riskLevel === "LEVEL 1") {

        healthHTML += `

            <p>
                <strong>Low detected particle level:</strong>
                The analysis indicates a relatively low number of
                suspected particles in the examined images.
            </p>

            <ul>
                <li>
                    Current evidence suggests that possible effects
                    can involve inflammation, oxidative stress,
                    and other biological responses, but the long-term
                    health significance in humans remains uncertain.
                </li>
                <li>
                    Continue proper water storage and reduce avoidable
                    exposure to plastic particles.
                </li>
            </ul>

        `;

    }


    else if (riskLevel === "LEVEL 2") {

        healthHTML += `

            <p>
                <strong>Moderate detected particle level:</strong>
                The analysis indicates a moderate number of suspected
                particles.
            </p>

            <ul>
                <li>
                    Experimental and human observational research has
                    reported possible associations involving inflammation,
                    oxidative stress, endocrine-related changes, and
                    gastrointestinal or reproductive biomarkers.
                </li>
                <li>
                    These findings do not establish that this sample will
                    cause a specific disease or that a particular amount
                    will produce a specific health outcome.
                </li>
            </ul>

        `;

    }


    else if (
        riskLevel === "LEVEL 3" ||
        riskLevel === "LEVEL 4"
    ) {

        healthHTML += `

            <p>
                <strong>High detected particle level:</strong>
                The analysis indicates a high number of suspected
                particles in the examined microscope images.
            </p>

            <ul>
                <li>
                    Research has reported biological responses such as
                    oxidative stress, inflammation, cellular stress,
                    and possible disruption of normal biological functions.
                </li>
                <li>
                    Human studies have also reported associations between
                    micro/nanoplastic burden and some cardiovascular,
                    gastrointestinal, respiratory, and reproductive findings,
                    although causation and the magnitude of long-term risk
                    remain uncertain.
                </li>
                <li>
                    A 2024 human observational study found that patients
                    with micro/nanoplastics detected in carotid plaque had
                    a higher risk of a combined outcome of myocardial
                    infarction, stroke, or death during approximately
                    34 months of follow-up. This does not establish a
                    20-year prediction or a specific ingestion threshold.
                </li>
            </ul>

        `;

    }


    healthHTML += `

        <p>
            <strong>Important:</strong>
            MicroCount results represent detected or suspected particles
            in microscope images. They do not by themselves measure the
            amount of microplastic actually absorbed by the body, establish
            a medical diagnosis, or determine an individual's lifetime
            disease risk.
        </p>

    `;


    healthEffects.innerHTML =
        healthHTML;

}


// ======================================
// MICROPLASTIC TYPE CLASSIFICATION
// ======================================

// These values are read from localStorage.
// Fiji/ImageJ or another analysis system
// must provide these values.

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


// ======================================
// TYPE PERCENTAGE
// ======================================

function typePercentage(count) {

    if (particleCount === 0) {
        return "0.0%";
    }

    return (
        (count / particleCount) * 100
    ).toFixed(1) + "%";
}


// ======================================
// DISPLAY MICROPLASTIC TYPES
// ======================================

function displayType(
    countID,
    percentID,
    count
) {

    const countElement =
        document.getElementById(countID);

    const percentElement =
        document.getElementById(percentID);

    if (countElement) {
        countElement.textContent =
            count;
    }

    if (percentElement) {
        percentElement.textContent =
            typePercentage(count);
    }

}


displayType(
    "fragmentCount",
    "fragmentPercent",
    fragments
);

displayType(
    "fiberCount",
    "fiberPercent",
    fibers
);

displayType(
    "filmCount",
    "filmPercent",
    films
);

displayType(
    "foamCount",
    "foamPercent",
    foams
);

displayType(
    "pelletCount",
    "pelletPercent",
    pellets
);

displayType(
    "lineCount",
    "linePercent",
    lines
);


// ======================================
// UPLOADED IMAGE
// ======================================

const imageData =
    localStorage.getItem("uploadedImage");

const uploadedImage =
    document.getElementById("uploadedImage");

const imageMessage =
    document.getElementById("imageMessage");


if (uploadedImage && imageMessage) {

    if (imageData) {

        uploadedImage.src =
            imageData;

        uploadedImage.style.display =
            "block";

        imageMessage.textContent =
            "";

    }

    else {

        uploadedImage.style.display =
            "none";

        imageMessage.textContent =
            "No microscope image was saved for this analysis.";

    }

}


// ======================================
// INTERPRETATION
// ======================================

const interpretation =
    document.getElementById("interpretation");


if (interpretation) {

    interpretation.innerHTML = `

        Fiji/ImageJ was used as the
        image-analysis and
        particle-quantification method.

        <br><br>

        <strong>${particleCount}</strong>
        detected particle measurements
        were recorded from the image-analysis
        results.

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

}


// ======================================
// SMART RECOMMENDATIONS
// ======================================

const recommendation =
    document.getElementById("recommendationText");

let recommendations = [];


// ======================================
// SAMPLE INFORMATION
// ======================================

const condition =
    waterCondition.toLowerCase();

const waterSource =
    source.toLowerCase();


// ======================================
// 1. MICROPLASTIC CONTAMINATION LEVEL
// ======================================

if (
    riskLevel === "LEVEL 4"
) {

    recommendations.push(`

        <strong>Very High Microplastic Contamination:</strong>

        The analyzed sample showed a very high
        level of detected particle contamination.

        Because the particles detected by
        Fiji/ImageJ are suspected particles,
        additional sampling and laboratory
        verification are recommended before
        making conclusions about the water
        quality.

        Review the water source, storage
        conditions, container, and handling
        practices.

    `);

}

else if (
    riskLevel === "LEVEL 3"
) {

    recommendations.push(`

        <strong>High Microplastic Contamination:</strong>

        The analyzed sample showed a high
        level of detected particle contamination.

        Review the water source, storage
        container, handling practices, and
        surrounding environment.

        Additional sampling and laboratory
        verification are recommended.

    `);

}

else if (
    riskLevel === "LEVEL 2"
) {

    recommendations.push(`

        <strong>Moderate Microplastic Contamination:</strong>

        The analyzed sample showed a moderate
        level of detected particles.

        Improve storage and handling practices
        and continue monitoring through
        additional samples.

    `);

}

else if (
    riskLevel === "LEVEL 1"
) {

    recommendations.push(`

        <strong>Low Microplastic Contamination:</strong>

        The analyzed sample showed a relatively
        low number of detected particles.

        Continue proper storage, handling,
        and regular monitoring of the water.

    `);

}


// ======================================
// 2. DIRECT SUNLIGHT
// ======================================

if (
    condition.includes("sun") ||
    condition.includes("light")
) {

    recommendations.push(`

        <strong>Direct Sunlight Exposure:</strong>

        The sample was stored in an environment
        exposed to direct sunlight.

        Move the water dispenser or storage
        container to a shaded indoor area
        away from direct sunlight.

        Avoid placing the water container near
        windows or other areas where it can be
        exposed to prolonged sunlight or heat.

    `);

}


// ======================================
// 3. STORAGE DURATION
// ======================================

if (daysStored >= 7) {

    recommendations.push(`

        <strong>Extended Storage:</strong>

        The sample was stored for ${daysStored}
        day(s).

        Avoid unnecessarily long storage periods.
        Keep the water container clean, covered,
        and properly maintained during storage.

    `);

}

else if (daysStored >= 3) {

    recommendations.push(`

        <strong>Storage Duration:</strong>

        The sample was stored for ${daysStored}
        day(s).

        Maintain a clean and covered container
        and avoid unnecessary exposure to heat,
        sunlight, dust, and surrounding materials.

    `);

}


// ======================================
// 4. WATER SOURCE
// ======================================

if (
    waterSource.includes("refilling")
) {

    recommendations.push(`

        <strong>Water Refilling Station:</strong>

        Ensure that the dispenser, storage
        container, and dispensing area are
        regularly cleaned and properly covered.

        Avoid placing the dispenser where it is
        exposed to direct sunlight, dust, or
        excessive heat.

    `);

}

else if (
    waterSource.includes("fountain")
) {

    recommendations.push(`

        <strong>Water Fountain:</strong>

        Keep the fountain outlet and surrounding
        area clean.

        Regularly inspect the fountain for
        visible dirt, damaged plastic components,
        or other possible sources of particles.

    `);

}

else if (
    waterSource.includes("tap")
) {

    recommendations.push(`

        <strong>Tap Water:</strong>

        Inspect the faucet, plumbing fixtures,
        and nearby plastic components for
        possible sources of particle contamination.

        Keep the faucet outlet clean and consider
        additional water-quality testing if high
        particle counts persist.

    `);

}

else if (
    waterSource.includes("mineral")
) {

    recommendations.push(`

        <strong>Mineral Water:</strong>

        Store the water container away from
        sunlight and excessive heat.

        Inspect the bottle or container for
        damage, excessive wear, or other
        possible sources of particle contamination.

    `);

}


// ======================================
// 5. FIBER-LIKE PARTICLES
// ======================================

if (fibers > 0) {

    recommendations.push(`

        <strong>Fiber-like Particles Detected:</strong>

        ${fibers} fiber-like particle(s) were
        detected.

        Keep the water container covered and
        minimize exposure to dust, cloth,
        clothing fibers, carpets, and other
        surrounding materials that may introduce
        fiber-like particles.

    `);

}


// ======================================
// 6. FRAGMENT-LIKE PARTICLES
// ======================================

if (fragments > 0) {

    recommendations.push(`

        <strong>Fragment-like Particles Detected:</strong>

        ${fragments} fragment-like particle(s)
        were detected.

        Inspect the water dispenser, storage
        container, plastic components, and
        surrounding materials for possible
        sources of plastic wear or breakage.

        Replace visibly damaged or deteriorated
        plastic containers when appropriate.

    `);

}


// ======================================
// 7. FILM-LIKE PARTICLES
// ======================================

if (films > 0) {

    recommendations.push(`

        <strong>Film-like Particles Detected:</strong>

        ${films} film-like particle(s) were
        detected.

        Inspect plastic bags, wrappers,
        containers, covers, and other plastic
        materials that may come into contact
        with the water.

        Keep unnecessary plastic materials
        away from the water container.

    `);

}


// ======================================
// 8. FOAM-LIKE PARTICLES
// ======================================

if (foams > 0) {

    recommendations.push(`

        <strong>Foam-like Particles Detected:</strong>

        ${foams} foam-like particle(s) were
        detected.

        Inspect nearby packaging, foam materials,
        insulation, and other lightweight plastic
        materials for possible sources of
        contamination.

        Keep these materials away from the
        water storage area.

    `);

}


// ======================================
// 9. PELLET-LIKE PARTICLES
// ======================================

if (pellets > 0) {

    recommendations.push(`

        <strong>Pellet-like Particles Detected:</strong>

        ${pellets} pellet-like particle(s) were
        detected.

        Inspect the water storage and surrounding
        area for possible plastic resin or
        plastic-material sources.

        Keep plastic debris and damaged plastic
        materials away from the water container.

    `);

}


// ======================================
// 10. GENERAL HIGH-CONTAMINATION ACTION
// ======================================

if (
    (riskLevel === "LEVEL 3" ||
     riskLevel === "LEVEL 4") &&
    (
        condition.includes("sun") ||
        condition.includes("light")
    )
) {

    recommendations.push(`

        <strong>Priority Action:</strong>

        Because the sample showed a high level
        of detected particles and was exposed
        to direct sunlight, move the water
        dispenser or storage container to a
        shaded indoor area away from direct
        sunlight and excessive heat.

        Re-sampling under improved storage
        conditions is recommended to determine
        whether the storage environment is
        associated with the observed particle
        count.

    `);

}


// ======================================
// 11. IF NO SPECIFIC RECOMMENDATIONS
// ======================================

if (recommendations.length === 0) {

    recommendations.push(`

        <strong>General Recommendation:</strong>

        Maintain clean, covered water containers
        and keep the water away from direct
        sunlight, excessive heat, dust, and
        unnecessary contact with plastic materials.

        Continue monitoring through additional
        samples.

    `);

}


// ======================================
// DISPLAY RECOMMENDATIONS
// ======================================

if (recommendation) {

    recommendation.innerHTML =
        recommendations
            .map(item => `<p>${item}</p>`)
            .join("");

}


// ======================================
// DOWNLOAD PDF REPORT
// ======================================

const downloadBtn =
    document.getElementById("downloadBtn");


if (downloadBtn) {

    downloadBtn.addEventListener("click", function () {

        try {

            downloadBtn.disabled = true;
            downloadBtn.textContent = "Creating Report...";

            const { jsPDF } = window.jspdf;

            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4"
            });

            const pageWidth =
                pdf.internal.pageSize.getWidth();

            const pageHeight =
                pdf.internal.pageSize.getHeight();

            const margin = 18;

            const contentWidth =
                pageWidth - (margin * 2);

            let y = 20;


            function checkPage(space = 10) {

                if (y + space > pageHeight - 18) {

                    pdf.addPage();

                    y = 20;

                }

            }


            function heading(text) {

                checkPage(14);

                pdf.setFont("helvetica", "bold");

                pdf.setFontSize(13);

                pdf.text(text, margin, y);

                y += 8;

            }


            function textLine(text) {

                checkPage(10);

                pdf.setFont("helvetica", "normal");

                pdf.setFontSize(10);

                const lines =
                    pdf.splitTextToSize(
                        String(text),
                        contentWidth
                    );

                pdf.text(lines, margin, y);

                y += (lines.length * 5) + 3;

            }


            function labelValue(label, value) {

                checkPage(8);

                pdf.setFont("helvetica", "bold");

                pdf.setFontSize(10);

                pdf.text(
                    label + ":",
                    margin,
                    y
                );

                const labelWidth =
                    pdf.getTextWidth(label + ": ");

                pdf.setFont("helvetica", "normal");

                pdf.text(
                    String(value),
                    margin + labelWidth,
                    y
                );

                y += 6;

            }


            function divider() {

                checkPage(5);

                pdf.line(
                    margin,
                    y,
                    pageWidth - margin,
                    y
                );

                y += 7;

            }


            // ==================================
            // HEADER
            // ==================================

            pdf.setFont("helvetica", "bold");

            pdf.setFontSize(22);

            pdf.text(
                "MicroCount STEVision",
                pageWidth / 2,
                y,
                { align: "center" }
            );

            y += 9;

            pdf.setFont("helvetica", "normal");

            pdf.setFontSize(11);

            pdf.text(
                "Microplastic Analysis Report",
                pageWidth / 2,
                y,
                { align: "center" }
            );

            y += 10;

            divider();


            // ==================================
            // SAMPLE INFORMATION
            // ==================================

            heading("Sample Information");

            labelValue("School Name", schoolName);
            labelValue("Section", section);
            labelValue("Water Source", source);
            labelValue("Water Condition", waterCondition);
            labelValue("Days Stored", daysStored + " day(s)");
            labelValue("Microscope Magnification", totalMagnification);
            labelValue("Sample ID", sampleID);

            divider();


            // ==================================
            // ANALYSIS SUMMARY
            // ==================================

            heading("Analysis Summary");

            labelValue("Number of Images", imageCount);
            labelValue("Detected Particles", particleCount);
            labelValue(
                "Average Count",
                average + " particles/image"
            );

            labelValue(
                "Total Particle Area",
                totalArea + " Fiji/ImageJ area units"
            );

            labelValue(
                "Average Particle Area",
                averageArea + " Fiji/ImageJ area units"
            );

            labelValue(
                "Detection Method",
                "Fiji/ImageJ Analyze Particles"
            );

            divider();


            // ==================================
            // RISK ASSESSMENT
            // ==================================

            heading("Risk Assessment");

            labelValue("Risk Level", riskLevel);

            textLine(
                "Assessment: " + riskText
            );

            divider();


            // ==================================
            // MICROPLASTIC TYPES
            // ==================================

            heading("Microplastic Types Identified");

            const types = [

                ["Fragments", fragments],
                ["Fibers", fibers],
                ["Films", films],
                ["Foams", foams],
                ["Pellets", pellets],
                ["Lines / Filaments", lines]

            ];


            types.forEach(function (item) {

                checkPage(8);

                const name = item[0];

                const count = item[1];

                pdf.setFont("helvetica", "normal");

                pdf.setFontSize(10);

                pdf.text(
                    name +
                    ": " +
                    count +
                    " (" +
                    typePercentage(count) +
                    ")",
                    margin,
                    y
                );

                y += 7;

            });


            divider();


            // ==================================
            // INTERPRETATION
            // ==================================

            heading("Interpretation");

            textLine(
                "Fiji/ImageJ was used as the image-analysis and particle-quantification method."
            );

            textLine(
                particleCount +
                " detected particle measurements were recorded from " +
                imageCount +
                " microscope image(s)."
            );

            textLine(
                "The calculated average was " +
                average +
                " particles/image."
            );

            textLine(
                "The calculated assessment level was " +
                riskLevel +
                " (" +
                riskText +
                ")."
            );

            divider();


            // ==================================
            // RECOMMENDATIONS
            // ==================================

            heading("Recommendations");


            const recommendationElement =
                document.getElementById(
                    "recommendationText"
                );


            if (
                recommendationElement &&
                recommendationElement.innerText.trim()
            ) {

                const recommendationLines =
                    recommendationElement.innerText
                        .trim()
                        .split("\n")
                        .filter(
                            line =>
                                line.trim() !== ""
                        );


                recommendationLines.forEach(
                    function (item) {

                        textLine(
                            "• " + item.trim()
                        );

                    }
                );

            }

            else {

                textLine(
                    "No recommendations were generated."
                );

            }


            divider();


            // ==================================
            // FOOTER
            // ==================================

            checkPage(15);

            pdf.setFontSize(8);

            pdf.setFont("helvetica", "normal");

            pdf.text(
                "MicroCount STEVision | Fiji/ImageJ-assisted analysis",
                pageWidth / 2,
                pageHeight - 10,
                { align: "center" }
            );


            // ==================================
            // DOWNLOAD
            // ==================================

            pdf.save(
                "MicroCount_STEVision_" +
                sampleID +
                "_Report.pdf"
            );

        }

        catch (error) {

            console.error(
                "PDF generation error:",
                error
            );

            alert(
                "The report could not be generated. Please try again."
            );

        }

        finally {

            downloadBtn.disabled = false;

            downloadBtn.textContent =
                "📄 Download Report";

        }

    });

}
// ======================================
// MicroCount STEVision
// Results Page - Image Display
// ======================================

const analyzedImagesContainer =
    document.getElementById("analyzedImages");


// ======================================
// GET UPLOADED IMAGES
// ======================================

// Images should have been saved during the upload process.
const storedImages =
    JSON.parse(localStorage.getItem("microscopeImages") || "[]");


// ======================================
// GET FIJI PARTICLE DATA
// ======================================

// Example expected format:
//
// [
//   {
//      image: "image1.jpg",
//      particles: [
//          { x: 120, y: 85, radius: 15 },
//          { x: 300, y: 180, radius: 12 }
//      ]
//   }
// ]

const fijiResults =
    JSON.parse(localStorage.getItem("fijiResults") || "[]");


// ======================================
// DISPLAY IMAGES
// ======================================

function displayAnalyzedImages() {

    analyzedImagesContainer.innerHTML = "";

    if (storedImages.length === 0) {
        analyzedImagesContainer.innerHTML = `
            <p>No microscope images were uploaded.</p>
        `;
        return;
    }

    storedImages.forEach((imageData, imageIndex) => {

        const card = document.createElement("div");
        card.className = "analyzed-image-card";

        const title = document.createElement("h3");
        title.textContent = `Microscope Image ${imageIndex + 1}`;

        const wrapper = document.createElement("div");
        wrapper.className = "image-canvas-wrapper";

        const img = document.createElement("img");

        img.src = imageData;

        const canvas = document.createElement("canvas");

        wrapper.appendChild(img);
        wrapper.appendChild(canvas);

        const info = document.createElement("div");
        info.className = "particle-info";

        card.appendChild(title);
        card.appendChild(wrapper);
        card.appendChild(info);

        analyzedImagesContainer.appendChild(card);

        img.onload = function () {

            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;

            const ctx = canvas.getContext("2d");

            const result = fijiResults[imageIndex];

            if (!result || !result.particles) {
                info.innerHTML = `
                    <span class="particle-count">
                        No particle coordinates available
                    </span>
                `;
                return;
            }

            const particles = result.particles;

            info.innerHTML = `
                Detected particles:
                <span class="particle-count">
                    ${particles.length}
                </span>
            `;

            drawParticleCircles(
                ctx,
                particles,
                canvas.width,
                canvas.height
            );
        };
    });
}


// ======================================
// DRAW PARTICLE CIRCLES
// ======================================

function drawParticleCircles(
    ctx,
    particles,
    imageWidth,
    imageHeight
) {

    particles.forEach((particle, index) => {

        const x = Number(particle.x);
        const y = Number(particle.y);

        // Use Fiji radius if available.
        // Otherwise use a default circle size.
        const radius =
            Number(particle.radius) || 15;

        // Circle
        ctx.beginPath();

        ctx.arc(
            x,
            y,
            radius,
            0,
            Math.PI * 2
        );

        ctx.lineWidth = 4;
        ctx.strokeStyle = "red";
        ctx.stroke();


        // Particle number
        ctx.fillStyle = "red";
        ctx.font = "bold 18px Arial";

        ctx.fillText(
            `${index + 1}`,
            x + radius + 5,
            y
        );
    });
}


// ======================================
// START
// ======================================

displayAnalyzedImages();