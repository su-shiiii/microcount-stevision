// ======================================
// MicroCount STEVision
// Fiji/ImageJ CSV Import
// ======================================

function parseNumeric(value) {
    if (value === null || value === undefined || value === '') {
        return NaN;
    }

    const parsed = Number(String(value).replace(/,/g, '').trim());
    return Number.isFinite(parsed) ? parsed : NaN;
}

function calculateRiskLevel(averageParticlesPerImage) {
    const average = Number(averageParticlesPerImage) || 0;

    if (average <= 10) {
        return { level: 'LEVEL 1', text: 'Low' };
    }

    if (average <= 30) {
        return { level: 'LEVEL 2', text: 'Moderate' };
    }

    if (average <= 60) {
        return { level: 'LEVEL 3', text: 'High' };
    }

    return { level: 'LEVEL 4', text: 'Very High' };
}

function classifyParticleType(particle) {
    const area = parseNumeric(particle.Area);
    const circularity = parseNumeric(particle.Circ ?? particle.circularity ?? particle.Circumference ?? particle.CIRC);
    const aspectRatio = parseNumeric(particle.AR ?? particle.aspectRatio ?? particle.Feret ?? particle['Aspect Ratio']);

    const effectiveCircularity = Number.isFinite(circularity) ? circularity : 0;
    const effectiveAspect = Number.isFinite(aspectRatio) ? aspectRatio : 1;

    if (effectiveAspect > 2.5 || effectiveCircularity < 0.35) {
        return 'Fibers';
    }

    if (effectiveAspect <= 1.8 && effectiveCircularity >= 0.7) {
        return 'Pellets';
    }

    if (effectiveCircularity >= 0.45 && effectiveCircularity <= 0.7) {
        return 'Fragments';
    }

    if (area > 2000) {
        return 'Films';
    }

    if (effectiveAspect > 1.8 && effectiveCircularity >= 0.35 && effectiveCircularity < 0.7) {
        return 'Lines / Filaments';
    }

    return 'Fragments';
}

const csvInput =
    document.getElementById("csvInput");

const fileName =
    document.getElementById("fileName");

const analysisStatus =
    document.getElementById("analysisStatus");

const viewResultsBtn =
    document.getElementById("viewResultsBtn");


csvInput.addEventListener("change", function () {

    const file = csvInput.files[0];

    if (!file) {
        return;
    }

    fileName.textContent =
        "Selected: " + file.name;

    analysisStatus.textContent =
        "Reading Fiji/ImageJ results...";

    const reader = new FileReader();


    reader.onload = function (event) {

        const csvText =
            event.target.result;

        processFijiCSV(csvText);

    };


    reader.onerror = function () {

        analysisStatus.textContent =
            "Unable to read the CSV file.";

    };


    reader.readAsText(file);

});


// ======================================
// PROCESS FIJI CSV
// ======================================

function processFijiCSV(csvText) {

    const lines =
        csvText.trim().split(/\r?\n/);


    if (lines.length < 2) {

        analysisStatus.textContent =
            "The Fiji/ImageJ CSV does not contain measurement data.";

        return;

    }


    // First row = column names
    const headers =
        parseCSVLine(lines[0]);


    // Remaining rows = measurements
    const rows = [];


    for (let i = 1; i < lines.length; i++) {

        if (lines[i].trim() === "") {
            continue;
        }

        rows.push(
            parseCSVLine(lines[i])
        );

    }


    // ----------------------------------
    // FIND COLUMN VARIANTS
    // ----------------------------------

    const areaIndex =
        findColumn(headers, "Area");

    const circularityIndex =
        findColumn(headers, "Circ.") !== -1
            ? findColumn(headers, "Circ.")
            : findColumn(headers, "Circ");

    const aspectRatioIndex =
        findColumn(headers, "AR") !== -1
            ? findColumn(headers, "AR")
            : findColumn(headers, "Aspect Ratio");

    const feretIndex =
        findColumn(headers, "Feret") !== -1
            ? findColumn(headers, "Feret")
            : findColumn(headers, "Feret X");

    const minFeretIndex =
        findColumn(headers, "MinFeret") !== -1
            ? findColumn(headers, "MinFeret")
            : findColumn(headers, "Min Feret");


    // ----------------------------------
    // FIND PARTICLE COUNT
    // ----------------------------------

    const totalParticles =
        rows.length;


    // ----------------------------------
    // NUMBER OF IMAGES
    // ----------------------------------

    const imageCount =
        Number(
            localStorage.getItem("numImages")
        ) || 1;


    // ----------------------------------
    // AVERAGE
    // ----------------------------------

    const average =
        (totalParticles / imageCount)
        .toFixed(2);


    // ----------------------------------
    // RISK LEVEL
    // ----------------------------------

    const riskResult =
        calculateRiskLevel(Number(average));

    const level = riskResult.level;
    const risk = riskResult.text;


    // ----------------------------------
    // TYPE CLASSIFICATION
    // ----------------------------------

    const typeBreakdown = {
        Fragments: 0,
        Fibers: 0,
        Films: 0,
        Foams: 0,
        Pellets: 0,
        "Lines / Filaments": 0
    };


    rows.forEach((row) => {

        const particle = {
            Area: row[areaIndex] || row[0],
            Circ: circularityIndex !== -1 ? row[circularityIndex] : undefined,
            AR: aspectRatioIndex !== -1 ? row[aspectRatioIndex] : undefined,
            Feret: feretIndex !== -1 ? row[feretIndex] : undefined,
            MinFeret: minFeretIndex !== -1 ? row[minFeretIndex] : undefined,
        };

        const particleType = classifyParticleType(particle);

        if (typeBreakdown[particleType] !== undefined) {
            typeBreakdown[particleType] += 1;
        }
        else {
            typeBreakdown.Fragments += 1;
        }

    });


    // ----------------------------------
    // SAVE RESULTS
    // ----------------------------------

    localStorage.setItem(
        "particles",
        totalParticles
    );

    localStorage.setItem(
        "average",
        average
    );

    localStorage.setItem(
        "riskLevel",
        level
    );

    localStorage.setItem(
        "riskText",
        risk
    );

    localStorage.setItem(
        "typeBreakdown",
        JSON.stringify(typeBreakdown)
    );


    // Save the actual Fiji CSV
    localStorage.setItem(
        "fijiCSV",
        csvText
    );


    // ----------------------------------
    // SAVE BASIC MEASUREMENTS
    // ----------------------------------

    if (areaIndex !== -1) {

        const areas = rows
            .map(row => Number(row[areaIndex]))
            .filter(value => !isNaN(value));


        if (areas.length > 0) {

            const totalArea =
                areas.reduce(
                    (sum, value) => sum + value,
                    0
                );


            const averageArea =
                totalArea / areas.length;


            localStorage.setItem(
                "totalArea",
                totalArea.toFixed(2)
            );

            localStorage.setItem(
                "averageArea",
                averageArea.toFixed(2)
            );

        }

    }


    // ----------------------------------
    // SUCCESS
    // ----------------------------------

    analysisStatus.innerHTML = `
        <strong>Fiji/ImageJ results imported successfully.</strong>
        <br><br>
        Detected particles:
        <strong>${totalParticles}</strong>
        <br>
        Average particles per image:
        <strong>${average}</strong>
        <br>
        Contamination level:
        <strong>${level} (${risk})</strong>
    `;


    viewResultsBtn.style.display =
        "inline-block";

}


// ======================================
// FIND COLUMN
// ======================================

function findColumn(headers, name) {

    return headers.findIndex(
        header =>
            header.trim().toLowerCase() ===
            name.toLowerCase()
    );

}


// ======================================
// CSV PARSER
// ======================================

function parseCSVLine(line) {

    const result = [];

    let current = "";
    let insideQuotes = false;


    for (let i = 0; i < line.length; i++) {

        const char = line[i];


        if (char === '"') {

            insideQuotes =
                !insideQuotes;

        }

        else if (
            char === "," &&
            !insideQuotes
        ) {

            result.push(
                current.trim()
            );

            current = "";

        }

        else {

            current += char;

        }

    }


    result.push(
        current.trim()
    );


    return result;

}


// ======================================
// RESULTS BUTTON
// ======================================

viewResultsBtn.addEventListener(
    "click",
    function () {

        window.location.href =
            "results.html";

    }
);