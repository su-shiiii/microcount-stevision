// ======================================
// MicroCount STEVision
// Fiji/ImageJ CSV Import
// ======================================

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
    // FIND AREA COLUMN
    // ----------------------------------

    let areaIndex =
        findColumn(headers, "Area");


    // ----------------------------------
    // FIND CIRCULARITY
    // ----------------------------------

    let circularityIndex =
        findColumn(headers, "Circ.");


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

    let level;
    let risk;


    if (average <= 10) {

        level = "LEVEL 1";
        risk = "Low";

    }

    else if (average <= 30) {

        level = "LEVEL 2";
        risk = "Moderate";

    }

    else if (average <= 60) {

        level = "LEVEL 3";
        risk = "High";

    }

    else {

        level = "LEVEL 4";
        risk = "Very High";

    }


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