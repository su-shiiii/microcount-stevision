// ======================================
// MicroCount STEVision
// Fiji/ImageJ Analysis Page
// ======================================

// ----------------------------
// Page elements
// ----------------------------

const progressBar = document.getElementById("progressBar");
const percentText = document.getElementById("percentText");
const statusText = document.getElementById("statusText");


// ----------------------------
// Create Fiji CSV input
// ----------------------------

const analysisCard = document.querySelector(".analysis-card");

const csvWrapper = document.createElement("div");

csvWrapper.style.marginTop = "25px";

csvWrapper.innerHTML = `
    <p style="font-weight:bold;">
        Upload the Fiji/ImageJ Results CSV:
    </p>

    <input
        type="file"
        id="fijiCSVInput"
        accept=".csv,text/csv"
        style="
            padding:12px;
            border:2px solid #35c1cf;
            border-radius:8px;
            background:white;
            cursor:pointer;
        "
    >

    <p style="font-size:14px;margin-top:10px;">
        Export this from Fiji/ImageJ using
        <strong>Results → Save As → CSV</strong>.
    </p>
`;

analysisCard.appendChild(csvWrapper);

const csvInput =
    document.getElementById("fijiCSVInput");


// ----------------------------
// Initial state
// ----------------------------

progressBar.style.width = "0%";
percentText.textContent = "0%";
statusText.textContent =
    "Waiting for Fiji/ImageJ Results CSV...";


// ----------------------------
// CSV selected
// ----------------------------

csvInput.addEventListener("change", function () {

    const file = csvInput.files[0];

    if (!file) {
        return;
    }

    if (!file.name.toLowerCase().endsWith(".csv")) {

        alert("Please select a Fiji/ImageJ CSV file.");

        return;
    }

    readFijiCSV(file);

});


// ======================================
// READ FIJI CSV
// ======================================

function readFijiCSV(file) {

    statusText.textContent =
        "Reading Fiji/ImageJ Results...";

    progressBar.style.width = "15%";
    percentText.textContent = "15%";

    const reader = new FileReader();

    reader.onload = function (event) {

        const csvText = event.target.result;

        progressBar.style.width = "30%";
        percentText.textContent = "30%";

        statusText.textContent =
            "Processing Fiji/ImageJ measurements...";

        setTimeout(function () {

            processFijiCSV(csvText);

        }, 500);

    };

    reader.onerror = function () {

        alert("Unable to read the Fiji/ImageJ CSV.");

        statusText.textContent =
            "Error reading CSV.";

    };

    reader.readAsText(file);

}


// ======================================
// PROCESS CSV
// ======================================

function processFijiCSV(csvText) {

    const rows = parseCSV(csvText);

    if (rows.length < 2) {

        alert(
            "The Fiji/ImageJ CSV does not contain enough Results data."
        );

        return;

    }

    const headers = rows[0].map(header =>
        header.trim().toLowerCase()
    );

    const dataRows = rows.slice(1);

    progressBar.style.width = "45%";
    percentText.textContent = "45%";

    statusText.textContent =
        "Reading particle measurements...";


    // ----------------------------
    // Find important Fiji columns
    // ----------------------------

    const areaIndex =
        headers.indexOf("area");

    const typeIndex =
        headers.indexOf("type");

    const imageIndex =
        headers.indexOf("image");


    // ----------------------------
    // Check Area column
    // ----------------------------

    if (areaIndex === -1) {

        alert(
            "The Fiji/ImageJ Results CSV must contain an 'Area' column."
        );

        statusText.textContent =
            "Missing Fiji/ImageJ Area column.";

        return;

    }


    // ----------------------------
    // Particle measurements
    // ----------------------------

    let particleCount = 0;

    let totalArea = 0;

    let validAreaMeasurements = 0;


    // ----------------------------
    // Microplastic types
    // ----------------------------

    let fragments = 0;
    let fibers = 0;
    let films = 0;
    let foams = 0;
    let pellets = 0;
    let lines = 0;

    let classifiedParticles = 0;


    // ----------------------------
    // Process every Fiji row
    // ----------------------------

    dataRows.forEach(row => {

        if (!row || row.length === 0) {
            return;
        }

        const areaValue =
            parseFloat(
                String(row[areaIndex] || "")
                    .replace(/,/g, "")
            );


        // Count particle if Area exists
        if (!isNaN(areaValue)) {

            particleCount++;

            totalArea += areaValue;

            validAreaMeasurements++;

        }


        // ----------------------------
        // Type classification
        // ----------------------------

        if (typeIndex !== -1) {

            const type =
                String(row[typeIndex] || "")
                    .trim()
                    .toLowerCase();

            if (
                type === "fragment" ||
                type === "fragments"
            ) {

                fragments++;
                classifiedParticles++;

            }

            else if (
                type === "fiber" ||
                type === "fibers"
            ) {

                fibers++;
                classifiedParticles++;

            }

            else if (
                type === "film" ||
                type === "films"
            ) {

                films++;
                classifiedParticles++;

            }

            else if (
                type === "foam" ||
                type === "foams"
            ) {

                foams++;
                classifiedParticles++;

            }

            else if (
                type === "pellet" ||
                type === "pellets"
            ) {

                pellets++;
                classifiedParticles++;

            }

            else if (
                type === "line" ||
                type === "lines" ||
                type === "filament" ||
                type === "filaments"
            ) {

                lines++;
                classifiedParticles++;

            }

        }

    });


    // ----------------------------
    // Calculate averages
    // ----------------------------

    const average =
        particleCount > 0
            ? (particleCount / getImageCount()).toFixed(2)
            : "0.00";


    const averageArea =
        validAreaMeasurements > 0
            ? (totalArea / validAreaMeasurements).toFixed(2)
            : "0.00";


    // ----------------------------
    // Risk level
    // ----------------------------

    let riskLevel;
    let riskText;


    if (particleCount <= 10) {

        riskLevel = "LEVEL 1";
        riskText = "Low";

    }

    else if (particleCount <= 30) {

        riskLevel = "LEVEL 2";
        riskText = "Moderate";

    }

    else if (particleCount <= 60) {

        riskLevel = "LEVEL 3";
        riskText = "High";

    }

    else {

        riskLevel = "LEVEL 4";
        riskText = "Very High";

    }


    // ----------------------------
    // Save Fiji results
    // ----------------------------

    localStorage.setItem(
        "numImages",
        getImageCount()
    );

    localStorage.setItem(
        "particles",
        particleCount
    );

    localStorage.setItem(
        "average",
        average
    );

    localStorage.setItem(
        "totalArea",
        totalArea.toFixed(2)
    );

    localStorage.setItem(
        "averageArea",
        averageArea
    );

    localStorage.setItem(
        "riskLevel",
        riskLevel
    );

    localStorage.setItem(
        "riskText",
        riskText
    );


    // ----------------------------
    // Save microplastic types
    // ----------------------------

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


    // ----------------------------
    // Classification status
    // ----------------------------

    if (typeIndex !== -1 && classifiedParticles > 0) {

        localStorage.setItem(
            "classificationStatus",
            "classified"
        );

    }

    else {

        localStorage.setItem(
            "classificationStatus",
            "not-classified"
        );

    }


    // ----------------------------
    // Save CSV
    // ----------------------------

    localStorage.setItem(
        "fijiCSV",
        csvText
    );


    // ----------------------------
    // Finish
    // ----------------------------

    progressBar.style.width = "80%";
    percentText.textContent = "80%";

    statusText.textContent =
        "Generating Fiji/ImageJ analysis report...";


    setTimeout(function () {

        progressBar.style.width = "100%";
        percentText.textContent = "100%";

        statusText.textContent =
            "Fiji/ImageJ analysis completed.";


        setTimeout(function () {

            window.location.href =
                "results.html";

        }, 700);

    }, 700);

}


// ======================================
// GET NUMBER OF IMAGES
// ======================================

function getImageCount() {

    return (
        Number(
            localStorage.getItem("numImages")
        ) || 1
    );

}


// ======================================
// SIMPLE CSV PARSER
// ======================================

function parseCSV(text) {

    const rows = [];

    let row = [];

    let value = "";

    let insideQuotes = false;


    for (let i = 0; i < text.length; i++) {

        const character = text[i];

        const nextCharacter =
            text[i + 1];


        // Quoted text
        if (character === '"' && insideQuotes && nextCharacter === '"') {

            value += '"';

            i++;

            continue;

        }


        if (character === '"') {

            insideQuotes = !insideQuotes;

            continue;

        }


        // Comma
        if (
            character === "," &&
            !insideQuotes
        ) {

            row.push(value);

            value = "";

            continue;

        }


        // New line
        if (
            (character === "\n" || character === "\r") &&
            !insideQuotes
        ) {

            if (character === "\r" && nextCharacter === "\n") {
                i++;
            }

            row.push(value);

            rows.push(row);

            row = [];

            value = "";

            continue;

        }


        value += character;

    }


    // Last value
    if (value !== "" || row.length > 0) {

        row.push(value);

        rows.push(row);

    }


    return rows;

}