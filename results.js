// =====================================================
// MicroCount STEVision
// RESULTS.JS
// =====================================================


// =====================================================
// HELPER: SAFE NUMBER
// =====================================================

function getNumber(key, fallback = 0) {

    const value = Number(
        localStorage.getItem(key)
    );

    return Number.isFinite(value)
        ? value
        : fallback;
}


// =====================================================
// HELPER: SET TEXT
// =====================================================

function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {

        element.textContent = value;

    }

}


// =====================================================
// SAMPLE INFORMATION
// =====================================================

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
    getNumber("daysStored");

const totalMagnification =
    localStorage.getItem("totalMagnification") ||
    "N/A";

const sampleID =
    localStorage.getItem("sampleID") ||
    "N/A";


// =====================================================
// NUMBER OF IMAGES
// =====================================================

let imageCount =
    getNumber("numImages");


// =====================================================
// LOAD PER-IMAGE RESULTS
// =====================================================

let perImageResults = [];

try {

    perImageResults =
        JSON.parse(
            localStorage.getItem(
                "perImageResults"
            ) || "[]"
        );

}
catch (error) {

    console.error(
        "Could not read perImageResults:",
        error
    );

    perImageResults = [];

}


// =====================================================
// IF NUMIMAGES IS EMPTY, USE PER-IMAGE DATA
// =====================================================

if (
    imageCount === 0 &&
    Array.isArray(perImageResults)
) {

    imageCount =
        perImageResults.length;

}


// =====================================================
// GET TOTAL PARTICLE COUNT
// =====================================================

let particleCount =
    getNumber("particles");


// =====================================================
// IF TOTAL PARTICLES IS MISSING,
// CALCULATE IT FROM PER-IMAGE RESULTS
// =====================================================

if (
    particleCount === 0 &&
    Array.isArray(perImageResults) &&
    perImageResults.length > 0
) {

    particleCount = 0;


    perImageResults.forEach(
        function(result) {

            const fragments =
                Number(result.fragments) || 0;

            const fibers =
                Number(result.fibers) || 0;

            const films =
                Number(result.films) || 0;

            const foams =
                Number(result.foams) || 0;

            const pellets =
                Number(result.pellets) || 0;

            const lines =
                Number(result.lines) || 0;


            let particles =
                Number(result.particles);


            if (
                !Number.isFinite(particles)
            ) {

                particles =
                    fragments +
                    fibers +
                    films +
                    foams +
                    pellets +
                    lines;

            }


            particleCount +=
                particles;

        }
    );

}


// =====================================================
// GET AVERAGE
// IMPORTANT:
// RISK WILL USE THIS VALUE
// =====================================================

let average =
    Number(
        localStorage.getItem("average")
    );


// =====================================================
// IF AVERAGE IS MISSING,
// CALCULATE IT FROM TOTAL / NUMBER OF IMAGES
// =====================================================

if (
    !Number.isFinite(average)
) {

    if (imageCount > 0) {

        average =
            particleCount /
            imageCount;

    }

    else {

        average = 0;

    }

}


// =====================================================
// AREA RESULTS
// =====================================================

const totalArea =
    getNumber("totalArea");

const averageArea =
    getNumber("averageArea");


// =====================================================
// =====================================================
// MICROPLASTIC TYPE TOTALS
// =====================================================
// First try the direct localStorage values.
// If they are missing/zero, calculate them from
// perImageResults.
// =====================================================

let fragments =
    getNumber("fragments");

let fibers =
    getNumber("fibers");

let films =
    getNumber("films");

let foams =
    getNumber("foams");

let pellets =
    getNumber("pellets");

let lines =
    getNumber("lines");


// =====================================================
// CHECK WHETHER DIRECT TYPE DATA EXISTS
// =====================================================

const directTypeDataExists =

    localStorage.getItem("fragments") !== null ||
    localStorage.getItem("fibers") !== null ||
    localStorage.getItem("films") !== null ||
    localStorage.getItem("foams") !== null ||
    localStorage.getItem("pellets") !== null ||
    localStorage.getItem("lines") !== null;


// =====================================================
// CALCULATE TYPE TOTALS FROM PER-IMAGE RESULTS
// =====================================================

if (
    !directTypeDataExists &&
    Array.isArray(perImageResults) &&
    perImageResults.length > 0
) {

    fragments = 0;
    fibers = 0;
    films = 0;
    foams = 0;
    pellets = 0;
    lines = 0;


    perImageResults.forEach(
        function(result) {

            fragments +=
                Number(result.fragments) || 0;

            fibers +=
                Number(result.fibers) || 0;

            films +=
                Number(result.films) || 0;

            foams +=
                Number(result.foams) || 0;

            pellets +=
                Number(result.pellets) || 0;

            lines +=
                Number(result.lines) || 0;

        }
    );

}


// =====================================================
// FALLBACK:
// IF DIRECT TYPE VALUES EXIST BUT ARE ALL ZERO,
// TRY PER-IMAGE DATA
// =====================================================

if (
    fragments === 0 &&
    fibers === 0 &&
    films === 0 &&
    foams === 0 &&
    pellets === 0 &&
    lines === 0 &&
    Array.isArray(perImageResults) &&
    perImageResults.length > 0
) {

    perImageResults.forEach(
        function(result) {

            fragments +=
                Number(result.fragments) || 0;

            fibers +=
                Number(result.fibers) || 0;

            films +=
                Number(result.films) || 0;

            foams +=
                Number(result.foams) || 0;

            pellets +=
                Number(result.pellets) || 0;

            lines +=
                Number(result.lines) || 0;

        }
    );

}


// =====================================================
// SAVE CORRECT TYPE TOTALS
// =====================================================

localStorage.setItem(
    "fragments",
    fragments
);

localStorage.setItem(
    "fibers",
    fibers
);

localStorage.setItem(
    "films",
    films
);

localStorage.setItem(
    "foams",
    foams
);

localStorage.setItem(
    "pellets",
    pellets
);

localStorage.setItem(
    "lines",
    lines
);


// =====================================================
// RISK CALCULATION
// =====================================================
// IMPORTANT:
// RISK IS BASED ONLY ON AVERAGE PARTICLES/IMAGE.
// NOT TOTAL PARTICLES.
// =====================================================

function calculateRisk(averageValue) {

    const value =
        Number(averageValue) || 0;


    if (value === 0) {

        return {

            level: "LEVEL 1",

            text:
                "No suspected particles detected on average."

        };

    }


    if (value <= 10) {

        return {

            level: "LEVEL 1",

            text:
                "Low average detected particle level."

        };

    }


    if (value <= 30) {

        return {

            level: "LEVEL 2",

            text:
                "Moderate average detected particle level."

        };

    }


    if (value <= 60) {

        return {

            level: "LEVEL 3",

            text:
                "High average detected particle level."

        };

    }


    return {

        level: "LEVEL 4",

        text:
            "Very high average detected particle level."

    };

}


// =====================================================
// CALCULATE RISK USING AVERAGE
// =====================================================

const risk =
    calculateRisk(average);


// =====================================================
// SAVE RISK
// =====================================================

localStorage.setItem(
    "riskLevel",
    risk.level
);

localStorage.setItem(
    "riskText",
    risk.text
);


// =====================================================
// DISPLAY SAMPLE INFORMATION
// =====================================================

setText(
    "schoolName",
    schoolName
);

setText(
    "section",
    section
);

setText(
    "source",
    source
);

setText(
    "waterCondition",
    waterCondition
);

setText(
    "daysStored",
    daysStored + " day(s)"
);

setText(
    "magnification",
    totalMagnification
);

setText(
    "sampleID",
    sampleID
);


// =====================================================
// DISPLAY ANALYSIS SUMMARY
// =====================================================

setText(
    "numImages",
    imageCount
);

setText(
    "particleCount",
    particleCount
);

setText(
    "average",
    average.toFixed(2) +
    " particles/image"
);

setText(
    "totalArea",
    totalArea +
    " Fiji/ImageJ area units"
);

setText(
    "averageArea",
    averageArea +
    " Fiji/ImageJ area units"
);


// =====================================================
// DISPLAY RISK
// =====================================================

setText(
    "riskLevel",
    risk.level
);

setText(
    "riskText",
    risk.text
);


const riskBox =
    document.getElementById(
        "riskBox"
    );


if (riskBox) {

    riskBox.classList.remove(
        "risk-level-1",
        "risk-level-2",
        "risk-level-3",
        "risk-level-4"
    );


    riskBox.classList.add(
        "risk-" +
        risk.level
            .toLowerCase()
            .replace(" ", "-")
    );

}


// =====================================================
// TYPE PERCENTAGES
// =====================================================

function typePercentage(count) {

    if (particleCount <= 0) {

        return "0.0%";

    }


    return (

        (
            Number(count) /
            particleCount
        ) *
        100

    ).toFixed(1) + "%";

}


// =====================================================
// DISPLAY TYPE
// =====================================================

function displayType(
    countID,
    percentID,
    count
) {

    setText(
        countID,
        count
    );

    setText(
        percentID,
        typePercentage(count)
    );

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


// =====================================================
// INTERPRETATION
// =====================================================

const interpretation =
    document.getElementById(
        "interpretation"
    );


if (interpretation) {

    interpretation.innerHTML = `

        Fiji/ImageJ was used as the
        image-analysis and particle-quantification
        method.

        <br><br>

        <strong>
            ${particleCount}
        </strong>
        suspected particle measurements were
        recorded from

        <strong>
            ${imageCount}
        </strong>
        microscope image(s).

        <br><br>

        The calculated average was

        <strong>
            ${average.toFixed(2)}
            particles/image
        </strong>.

        <br><br>

        The risk assessment is based on the
        <strong>
            average number of suspected particles
            detected per image
        </strong>,
        rather than the total number of particles.

        <br><br>

        The calculated assessment was

        <strong>
            ${risk.level}
        </strong>:

        ${risk.text}

    `;

}
// =====================================================
// RECOMMENDATIONS
// BASED ON AVERAGE PARTICLES PER IMAGE
// =====================================================

const recommendationElement =
    document.getElementById("recommendationText");


if (recommendationElement) {

    let recommendationHTML = "";


    // =================================================
    // LEVEL 1
    // =================================================

    if (risk.level === "LEVEL 1") {

        recommendationHTML = `

            <p>
                <strong>Risk assessment:</strong>
                The average detected particle level is low.
            </p>

            <ul>

                <li>
                    Continue using clean and properly covered
                    water containers.
                </li>

                <li>
                    Keep drinking-water containers away from
                    dust, plastic debris, and other possible
                    sources of contamination.
                </li>

                <li>
                    Continue monitoring the water sample
                    periodically if possible.
                </li>

                <li>
                    If future samples show increasing particle
                    counts, further investigation is recommended.
                </li>

            </ul>

        `;

    }


    // =================================================
    // LEVEL 2
    // =================================================

    else if (risk.level === "LEVEL 2") {

        recommendationHTML = `

            <p>
                <strong>Risk assessment:</strong>
                The average detected particle level is moderate.
            </p>

            <ul>

                <li>
                    Review how the water is stored, transported,
                    and handled to reduce possible contamination.
                </li>

                <li>
                    Use clean, covered, food-grade containers
                    whenever possible.
                </li>

                <li>
                    Avoid prolonged storage of drinking water
                    in plastic containers when suitable
                    alternatives are available.
                </li>

                <li>
                    Consider repeating the microscope analysis
                    using additional samples to determine whether
                    the detected level is consistent.
                </li>

                <li>
                    If elevated results continue, consider
                    additional laboratory testing for confirmation.
                </li>

            </ul>

        `;

    }


    // =================================================
    // LEVEL 3
    // =================================================

    else if (risk.level === "LEVEL 3") {

        recommendationHTML = `

            <p>
                <strong>Risk assessment:</strong>
                The average detected particle level is high.
            </p>

            <ul>

                <li>
                    Investigate possible sources of particle
                    contamination in the water source, containers,
                    storage conditions, and handling process.
                </li>

                <li>
                    Review and improve water storage and handling
                    practices.
                </li>

                <li>
                    Use clean, covered containers intended for
                    drinking-water storage.
                </li>

                <li>
                    Consider repeating the analysis with additional
                    microscope images and water samples.
                </li>

                <li>
                    Consider confirmatory laboratory testing to
                    determine whether the suspected particles are
                    actually microplastics.
                </li>

            </ul>

            <p>
                The MicroCount result should not by itself be
                interpreted as proof that the water will cause
                illness.
            </p>

        `;

    }


    // =================================================
    // LEVEL 4
    // =================================================

    else {

        recommendationHTML = `

            <p>
                <strong>Risk assessment:</strong>
                The average detected particle level is very high.
            </p>

            <ul>

                <li>
                    Investigate the possible sources of particle
                    contamination as soon as practical.
                </li>

                <li>
                    Review the water source, storage containers,
                    transportation, and handling procedures.
                </li>

                <li>
                    Check whether the detected particles could have
                    originated from sampling equipment, containers,
                    clothing fibers, laboratory materials, or other
                    environmental sources.
                </li>

                <li>
                    Repeat the analysis using additional samples
                    and microscope images to determine whether the
                    result is reproducible.
                </li>

                <li>
                    Confirm suspected particles using an appropriate
                    laboratory identification method before making
                    conclusions about microplastic contamination.
                </li>

                <li>
                    Consider additional water-quality testing if
                    elevated results continue.
                </li>

            </ul>

            <p>
                A high MicroCount result indicates a high number of
                <strong>suspected particles detected in the images</strong>.
                It does not by itself establish a human health risk
                or prove that the particles are microplastics.
            </p>

        `;

    }


    // =================================================
    // COMMON RECOMMENDATION
    // =================================================

    recommendationHTML += `

        <div class="recommendation-note">

            <p>
                <strong>Important:</strong>
                Recommendations are based on the detected average
                particles per microscope image. MicroCount is an
                image-analysis screening method and does not measure
                the amount of microplastic absorbed by the human body.
            </p>

        </div>

    `;


    recommendationElement.innerHTML =
        recommendationHTML;

}


// =====================================================
// LONG-TERM HEALTH CONSIDERATIONS
// =====================================================

const healthEffects =
    document.getElementById(
        "healthEffects"
    );


if (healthEffects) {

    let healthHTML = `

        <div class="health-intro">

            <h3>
                Long-Term Health Considerations
            </h3>

            <p>

                The current MicroCount result shows an
                average of

                <strong>
                    ${average.toFixed(2)}
                    suspected particles/image
                </strong>.

            </p>

            <div class="health-evidence-box">

                <h4>
                    Important Scientific Limitation
                </h4>

                <p>

                    MicroCount detects suspected particles
                    visible in microscope images. The result
                    is <strong>not a measurement of the amount
                    of microplastic absorbed by the human
                    body</strong> and cannot diagnose disease.

                </p>

                <p>

                    The current scientific evidence does not
                    allow a specific disease to be predicted
                    after exactly 1, 5, or 10 years based only
                    on a microscope particle count.

                    Therefore, the information below describes
                    <strong>potential health considerations</strong>,
                    not guaranteed future health effects.

                </p>

            </div>

        </div>

    `;


    // =================================================
    // LEVEL 1
    // =================================================

    if (risk.level === "LEVEL 1") {

        healthHTML += `

            <div class="health-time">

                <h3>
                    Approximately 1 Year
                </h3>

                <p>

                    If a similarly low detected level were
                    repeatedly observed, continued exposure
                    to suspected particles would remain a
                    consideration.

                    There is not enough evidence to predict
                    a specific disease from this result.

                </p>

            </div>


            <div class="health-time">

                <h3>
                    Approximately 5 Years
                </h3>

                <p>

                    Continued exposure over several years
                    would represent repeated contact with
                    suspected particles.

                    Laboratory research has investigated
                    oxidative stress, inflammation, and
                    cellular responses, although the relevance
                    of these findings to real-world drinking
                    water exposure remains uncertain.

                </p>

            </div>


            <div class="health-time">

                <h3>
                    Approximately 10 Years
                </h3>

                <p>

                    Long-term health effects cannot currently
                    be predicted from this particle count.

                    Continued research is needed to determine
                    the possible consequences of prolonged
                    exposure.

                </p>

            </div>

        `;

    }


    // =================================================
    // LEVEL 2
    // =================================================

    else if (risk.level === "LEVEL 2") {

        healthHTML += `

            <div class="health-time">

                <h3>
                    Approximately 1 Year
                </h3>

                <p>

                    If a similarly moderate detected level
                    continued, repeated exposure to suspected
                    particles would occur.

                    Experimental studies have investigated
                    oxidative stress, inflammation, and
                    cellular responses following exposure.

                </p>

            </div>


            <div class="health-time">

                <h3>
                    Approximately 5 Years
                </h3>

                <p>

                    Continued exposure for several years could
                    increase the duration of contact with
                    suspected particles.

                    Researchers have investigated possible
                    effects involving digestive, respiratory,
                    and reproductive systems.

                </p>

                <p>

                    However, these findings do not establish
                    that this particular water sample will
                    cause disease.

                </p>

            </div>


            <div class="health-time">

                <h3>
                    Approximately 10 Years
                </h3>

                <p>

                    A decade of repeated exposure would
                    represent a longer period of potential
                    contact with suspected particles.

                    Current evidence does not establish a
                    specific disease outcome based on this
                    microscope particle count.

                </p>

            </div>

        `;

    }


    // =================================================
    // LEVEL 3
    // =================================================

    else if (risk.level === "LEVEL 3") {

        healthHTML += `

            <div class="health-time">

                <h3>
                    Approximately 1 Year
                </h3>

                <p>

                    MicroCount detected a

                    <strong>
                        high average of
                        ${average.toFixed(2)}
                        suspected particles/image.
                    </strong>

                    If similarly elevated results were
                    repeatedly observed, continued exposure
                    would represent a greater potential
                    concern.

                </p>

                <p>

                    Experimental research has investigated
                    biological responses including

                    <strong>
                        oxidative stress, inflammation,
                        and cellular stress.
                    </strong>

                </p>

            </div>


            <div class="health-time">

                <h3>
                    Approximately 5 Years
                </h3>

                <p>

                    If a similarly elevated detected level
                    persisted for several years, repeated
                    exposure would remain an area of concern.

                    Research has investigated possible
                    effects involving the

                    <strong>
                        digestive, respiratory, and
                        reproductive systems.
                    </strong>

                </p>

                <p>

                    Human evidence remains limited and
                    cannot establish a direct cause-and-effect
                    relationship for this sample.

                </p>

            </div>


            <div class="health-time">

                <h3>
                    Approximately 10 Years
                </h3>

                <p>

                    If similarly elevated results continued
                    for approximately ten years, the prolonged
                    duration of exposure would remain an
                    important research concern.

                </p>

                <p>

                    However, this result cannot be used to
                    predict that a person will develop a
                    particular disease after ten years.

                </p>

            </div>

        `;

    }


    // =================================================
    // LEVEL 4
    // =================================================

    else {

        healthHTML += `

            <div class="health-time">

                <h3>
                    Approximately 1 Year
                </h3>

                <p>

                    MicroCount detected a

                    <strong>
                        very high average of
                        ${average.toFixed(2)}
                        suspected particles/image.
                    </strong>

                    If similarly elevated results were
                    repeatedly observed, continued exposure
                    would represent a greater potential
                    concern.

                </p>

                <p>

                    Experimental research has investigated
                    oxidative stress, inflammation, cellular
                    stress, and changes in cellular function.

                </p>

            </div>


            <div class="health-time">

                <h3>
                    Approximately 5 Years
                </h3>

                <p>

                    Continued exposure at a similarly
                    elevated detected level could result
                    in a longer period of potential contact
                    with suspected particles.

                </p>

                <p>

                    Potential biological effects being
                    investigated include responses involving
                    the digestive, respiratory, and
                    reproductive systems.

                    Human evidence remains limited.

                </p>

            </div>


            <div class="health-time">

                <h3>
                    Approximately 10 Years
                </h3>

                <p>

                    Prolonged exposure over approximately
                    a decade would remain a potential
                    concern because of the duration of
                    repeated exposure.

                </p>

                <p>

                    Nevertheless, current evidence cannot
                    determine a specific disease outcome
                    for an individual using only a microscope
                    particle count.

                </p>

            </div>

        `;

    }


    // =================================================
    // EVIDENCE CLASSIFICATION
    // =================================================

    healthHTML += `

        <div class="health-evidence">

            <h3>
                Evidence Classification
            </h3>

            <ul>

                <li>

                    <strong>
                        Established:
                    </strong>

                    Micro- and nanoplastics have been
                    detected in human biological samples.

                </li>


                <li>

                    <strong>
                        Emerging:
                    </strong>

                    Human research is investigating possible
                    associations between micro/nanoplastics
                    and health outcomes.

                </li>


                <li>

                    <strong>
                        Potential:
                    </strong>

                    Laboratory and animal studies have
                    reported oxidative stress, inflammation,
                    and cellular responses.

                </li>

            </ul>

        </div>


        <p class="health-disclaimer">

            <strong>
                Important:
            </strong>

            MicroCount results represent suspected
            particles detected in microscope images.
            They do not represent a human exposure dose,
            absorbed dose, or individual disease risk.

        </p>

    `;


    healthEffects.innerHTML =
        healthHTML;

}


// =====================================================
// DISPLAY ANALYZED MICROSCOPE IMAGES
// =====================================================

const analyzedImagesContainer =
    document.getElementById(
        "analyzedImages"
    );


let storedImages = [];

try {

    storedImages =
        JSON.parse(
            localStorage.getItem(
                "microscopeImages"
            ) || "[]"
        );

}
catch (error) {

    console.error(
        "Could not read microscopeImages:",
        error
    );

    storedImages = [];

}


let fijiResults = [];

try {

    fijiResults =
        JSON.parse(
            localStorage.getItem(
                "fijiResults"
            ) || "[]"
        );

}
catch (error) {

    console.error(
        "Could not read fijiResults:",
        error
    );

    fijiResults = [];

}


// =====================================================
// DRAW PARTICLE CIRCLES
// =====================================================

function drawParticleCircles(
    ctx,
    particles
) {

    particles.forEach(
        function(particle, index) {

            const x =
                Number(particle.x);

            const y =
                Number(particle.y);

            const radius =
                Number(particle.radius) || 15;


            if (
                !Number.isFinite(x) ||
                !Number.isFinite(y)
            ) {

                return;

            }


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


            ctx.fillStyle = "red";

            ctx.font =
                "bold 18px Arial";


            ctx.fillText(
                String(index + 1),
                x + radius + 5,
                y
            );

        }
    );

}


// =====================================================
// DISPLAY ANALYZED IMAGES
// =====================================================

function displayAnalyzedImages() {

    if (!analyzedImagesContainer) {

        return;

    }


    analyzedImagesContainer.innerHTML =
        "";


    if (
        !Array.isArray(storedImages) ||
        storedImages.length === 0
    ) {

        analyzedImagesContainer.innerHTML = `

            <p>
                No microscope images were uploaded.
            </p>

        `;

        return;

    }


    storedImages.forEach(
        function(imageData, imageIndex) {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "analyzed-image-card";


            const title =
                document.createElement(
                    "h3"
                );

            title.textContent =
                "Microscope Image " +
                (imageIndex + 1);


            const wrapper =
                document.createElement(
                    "div"
                );

            wrapper.className =
                "image-canvas-wrapper";


            const img =
                document.createElement(
                    "img"
                );

            img.src =
                imageData;


            const canvas =
                document.createElement(
                    "canvas"
                );


            wrapper.appendChild(img);

            wrapper.appendChild(canvas);


            const info =
                document.createElement(
                    "div"
                );

            info.className =
                "particle-info";


            card.appendChild(title);

            card.appendChild(wrapper);

            card.appendChild(info);


            analyzedImagesContainer.appendChild(
                card
            );


            img.onload =
                function() {

                    canvas.width =
                        img.naturalWidth;

                    canvas.height =
                        img.naturalHeight;


                    const ctx =
                        canvas.getContext(
                            "2d"
                        );


                    const result =
                        fijiResults[
                            imageIndex
                        ];


                    if (
                        !result ||
                        !Array.isArray(
                            result.particles
                        )
                    ) {

                        info.innerHTML = `

                            <span class="particle-count">

                                No particle coordinates
                                available

                            </span>

                        `;

                        return;

                    }


                    const particles =
                        result.particles;


                    info.innerHTML = `

                        Detected particles:

                        <span class="particle-count">

                            ${particles.length}

                        </span>

                    `;


                    drawParticleCircles(
                        ctx,
                        particles
                    );

                };

        }
    );

}


displayAnalyzedImages();


// =====================================================
// PER-IMAGE RESULTS
// =====================================================
// FIXED:
// Your HTML uses "perImageLink",
// not "viewPerImageResults".
// =====================================================

const perImageLink =
    document.getElementById(
        "perImageLink"
    );


const perImageContainer =
    document.getElementById(
        "perImageResults"
    );


const perImageTableBody =
    document.getElementById(
        "perImageTableBody"
    );


if (
    perImageLink &&
    perImageContainer &&
    perImageTableBody
) {

    perImageLink.addEventListener(
        "click",
        function(event) {

            event.preventDefault();


            if (
                perImageContainer.style.display ===
                "block"
            ) {

                perImageContainer.style.display =
                    "none";

                perImageLink.textContent =
                    "→ View detailed results per image";

                return;

            }


            if (
                !Array.isArray(perImageResults) ||
                perImageResults.length === 0
            ) {

                perImageTableBody.innerHTML = `

                    <tr>

                        <td
                            colspan="8"
                            class="per-image-no-data">

                            No per-image analysis data
                            was found.

                        </td>

                    </tr>

                `;

                perImageContainer.style.display =
                    "block";

                perImageLink.textContent =
                    "← Hide detailed results per image";

                return;

            }


            perImageTableBody.innerHTML =
                "";


            let totalFragments = 0;
            let totalFibers = 0;
            let totalFilms = 0;
            let totalFoams = 0;
            let totalPellets = 0;
            let totalLines = 0;
            let totalParticles = 0;


            perImageResults.forEach(
                function(result, index) {

                    const imageNumber =
                        result.imageNumber ||
                        (index + 1);


                    const imageFragments =
                        Number(
                            result.fragments
                        ) || 0;


                    const imageFibers =
                        Number(
                            result.fibers
                        ) || 0;


                    const imageFilms =
                        Number(
                            result.films
                        ) || 0;


                    const imageFoams =
                        Number(
                            result.foams
                        ) || 0;


                    const imagePellets =
                        Number(
                            result.pellets
                        ) || 0;


                    const imageLines =
                        Number(
                            result.lines
                        ) || 0;


                    let imageParticles =
                        Number(
                            result.particles
                        );


                    if (
                        !Number.isFinite(
                            imageParticles
                        )
                    ) {

                        imageParticles =
                            imageFragments +
                            imageFibers +
                            imageFilms +
                            imageFoams +
                            imagePellets +
                            imageLines;

                    }


                    totalFragments +=
                        imageFragments;

                    totalFibers +=
                        imageFibers;

                    totalFilms +=
                        imageFilms;

                    totalFoams +=
                        imageFoams;

                    totalPellets +=
                        imagePellets;

                    totalLines +=
                        imageLines;

                    totalParticles +=
                        imageParticles;


                    const row =
                        document.createElement(
                            "tr"
                        );


                    row.innerHTML = `

                        <td class="image-name">
                            Image ${imageNumber}
                        </td>

                        <td>
                            ${imageFragments}
                        </td>

                        <td>
                            ${imageFibers}
                        </td>

                        <td>
                            ${imageFilms}
                        </td>

                        <td>
                            ${imageFoams}
                        </td>

                        <td>
                            ${imagePellets}
                        </td>

                        <td>
                            ${imageLines}
                        </td>

                        <td>
                            <strong>
                                ${imageParticles}
                            </strong>
                        </td>

                    `;


                    perImageTableBody.appendChild(
                        row
                    );

                }
            );


            const totalRow =
                document.createElement(
                    "tr"
                );


            totalRow.className =
                "per-image-total-row";


            totalRow.innerHTML = `

                <td>
                    TOTAL
                </td>

                <td>
                    ${totalFragments}
                </td>

                <td>
                    ${totalFibers}
                </td>

                <td>
                    ${totalFilms}
                </td>

                <td>
                    ${totalFoams}
                </td>

                <td>
                    ${totalPellets}
                </td>

                <td>
                    ${totalLines}
                </td>

                <td>
                    ${totalParticles}
                </td>

            `;


            perImageTableBody.appendChild(
                totalRow
            );


            perImageContainer.style.display =
                "block";


            perImageLink.textContent =
                "← Hide detailed results per image";

        }
    );

}


// =====================================================
// NEW ANALYSIS
// =====================================================

const newAnalysisBtn =
    document.getElementById(
        "newAnalysisBtn"
    );


if (newAnalysisBtn) {

    newAnalysisBtn.addEventListener(
        "click",
        function() {

            window.location.href =
                "upload.html";

        }
    );

}


// =====================================================
// DOWNLOAD PDF
// =====================================================

const downloadBtn =
    document.getElementById(
        "downloadBtn"
    );


if (downloadBtn) {

    downloadBtn.addEventListener(
        "click",
        function() {

            try {

                downloadBtn.disabled =
                    true;

                downloadBtn.textContent =
                    "Creating Report...";


                const {
                    jsPDF
                } =
                    window.jspdf;


                if (!jsPDF) {

                    throw new Error(
                        "jsPDF was not loaded."
                    );

                }


                const pdf =
                    new jsPDF({
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
                    pageWidth -
                    margin * 2;


                let y = 20;


                function checkPage(
                    space = 10
                ) {

                    if (
                        y + space >
                        pageHeight - 18
                    ) {

                        pdf.addPage();

                        y = 20;

                    }

                }


                function heading(text) {

                    checkPage(14);

                    pdf.setFont(
                        "helvetica",
                        "bold"
                    );

                    pdf.setFontSize(13);

                    pdf.text(
                        text,
                        margin,
                        y
                    );

                    y += 8;

                }


                function textLine(text) {

                    checkPage(10);

                    pdf.setFont(
                        "helvetica",
                        "normal"
                    );

                    pdf.setFontSize(10);


                    const lines =
                        pdf.splitTextToSize(
                            String(text),
                            contentWidth
                        );


                    pdf.text(
                        lines,
                        margin,
                        y
                    );


                    y +=
                        lines.length * 5 +
                        3;

                }


                function labelValue(
                    label,
                    value
                ) {

                    checkPage(8);

                    pdf.setFont(
                        "helvetica",
                        "bold"
                    );

                    pdf.setFontSize(10);


                    pdf.text(
                        label + ":",
                        margin,
                        y
                    );


                    const labelWidth =
                        pdf.getTextWidth(
                            label + ": "
                        );


                    pdf.setFont(
                        "helvetica",
                        "normal"
                    );


                    pdf.text(
                        String(value),
                        margin +
                        labelWidth,
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


                // HEADER

                pdf.setFont(
                    "helvetica",
                    "bold"
                );

                pdf.setFontSize(22);


                pdf.text(
                    "MicroCount STEVision",
                    pageWidth / 2,
                    y,
                    {
                        align: "center"
                    }
                );


                y += 9;


                pdf.setFont(
                    "helvetica",
                    "normal"
                );

                pdf.setFontSize(11);


                pdf.text(
                    "Microplastic Analysis Report",
                    pageWidth / 2,
                    y,
                    {
                        align: "center"
                    }
                );


                y += 10;


                divider();


                // SAMPLE INFORMATION

                heading(
                    "Sample Information"
                );


                labelValue(
                    "School Name",
                    schoolName
                );

                labelValue(
                    "Section",
                    section
                );

                labelValue(
                    "Water Source",
                    source
                );

                labelValue(
                    "Water Condition",
                    waterCondition
                );

                labelValue(
                    "Days Stored",
                    daysStored + " day(s)"
                );

                labelValue(
                    "Microscope Magnification",
                    totalMagnification
                );

                labelValue(
                    "Sample ID",
                    sampleID
                );


                divider();


                // ANALYSIS SUMMARY

                heading(
                    "Analysis Summary"
                );


                labelValue(
                    "Number of Images",
                    imageCount
                );

                labelValue(
                    "Detected Particles",
                    particleCount
                );

                labelValue(
                    "Average Count",
                    average.toFixed(2) +
                    " particles/image"
                );

                labelValue(
                    "Total Particle Area",
                    totalArea +
                    " Fiji/ImageJ area units"
                );

                labelValue(
                    "Average Particle Area",
                    averageArea +
                    " Fiji/ImageJ area units"
                );

                labelValue(
                    "Detection Method",
                    "Fiji/ImageJ Analyze Particles"
                );


                divider();


                // RISK

                heading(
                    "Risk Assessment"
                );


                labelValue(
                    "Average Particles/Image",
                    average.toFixed(2)
                );

                labelValue(
                    "Risk Level",
                    risk.level
                );


                textLine(
                    "Assessment: " +
                    risk.text
                );


                textLine(
                    "Risk classification is based on the average number of suspected particles detected per microscope image, not the total particle count."
                );


                divider();


                // TYPES

                heading(
                    "Microplastic Types Identified"
                );


                const types = [

                    ["Fragments", fragments],

                    ["Fibers", fibers],

                    ["Films", films],

                    ["Foams", foams],

                    ["Pellets", pellets],

                    [
                        "Lines / Filaments",
                        lines
                    ]

                ];


                types.forEach(
                    function(item) {

                        textLine(
                            item[0] +
                            ": " +
                            item[1] +
                            " (" +
                            typePercentage(
                                item[1]
                            ) +
                            ")"
                        );

                    }
                );


                divider();


                // INTERPRETATION

                heading(
                    "Interpretation"
                );


                textLine(
                    particleCount +
                    " suspected particle measurements were recorded from " +
                    imageCount +
                    " microscope image(s)."
                );


                textLine(
                    "The calculated average was " +
                    average.toFixed(2) +
                    " particles/image."
                );


                textLine(
                    "The risk classification was based on the average particles detected per image."
                );


                textLine(
                    "Assessment: " +
                    risk.level +
                    " (" +
                    risk.text +
                    ")."
                );


                divider();


                // LONG TERM CONSIDERATIONS

                heading(
                    "Long-Term Health Considerations"
                );


                textLine(
                    "MicroCount detects suspected particles visible in microscope images. The result is not a measurement of absorbed microplastic dose or individual disease risk."
                );


                textLine(
                    "Current evidence does not allow a specific disease to be predicted after exactly 1, 5, or 10 years based only on this microscope particle count."
                );


                textLine(
                    "Long-term research has investigated potential biological responses including oxidative stress, inflammation, and cellular responses."
                );


                divider();


                // RECOMMENDATIONS

                heading(
                    "Recommendations"
                );


                const recommendationElement =
                    document.getElementById(
                        "recommendationText"
                    );


                if (
                    recommendationElement
                ) {

                    const recommendationText =
                        recommendationElement.innerText
                            .trim();


                    if (
                        recommendationText &&
                        !recommendationText.includes(
                            "will appear here"
                        )
                    ) {

                        textLine(
                            recommendationText
                        );

                    }

                    else {

                        textLine(
                            "Maintain clean and covered water containers and continue monitoring."
                        );

                    }

                }


                divider();


                // FOOTER

                checkPage(15);


                pdf.setFontSize(8);

                pdf.setFont(
                    "helvetica",
                    "normal"
                );


                pdf.text(
                    "MicroCount STEVision | Fiji/ImageJ-assisted analysis",
                    pageWidth / 2,
                    pageHeight - 10,
                    {
                        align: "center"
                    }
                );


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

                downloadBtn.disabled =
                    false;

                downloadBtn.textContent =
                    "📄 Download Report";

            }

        }
    );

}