// ======================================
// MicroCount STEVision
// Fiji/ImageJ Analysis
// ======================================

const csvInput = document.getElementById("csvInput");
const analyzeBtn = document.getElementById("analyzeBtn");

const progressBar = document.getElementById("progressBar");
const percentText = document.getElementById("percentText");
const statusText = document.getElementById("statusText");


// ======================================
// INITIAL STATE
// ======================================

analyzeBtn.disabled = true;


// ======================================
// ENABLE BUTTON WHEN CSV IS SELECTED
// ======================================

csvInput.addEventListener("change", function () {

    if (csvInput.files.length > 0) {

        analyzeBtn.disabled = false;

        statusText.textContent =
            "Fiji/ImageJ CSV selected. Ready to analyze.";

    } else {

        analyzeBtn.disabled = true;

        statusText.textContent =
            "Waiting for Fiji/ImageJ CSV...";

    }

});


// ======================================
// ANALYZE BUTTON
// ======================================

analyzeBtn.addEventListener("click", function () {

    if (!csvInput.files.length) {

        alert("Please select the Fiji/ImageJ CSV file first.");

        return;

    }

    const file = csvInput.files[0];

    statusText.textContent =
        "Reading Fiji/ImageJ Results table...";

    analyzeBtn.disabled = true;

    const reader = new FileReader();


    reader.onload = function (event) {

        const csvText = event.target.result;

        processFijiCSV(csvText);

    };


    reader.onerror = function () {

        alert("The CSV file could not be read.");

        analyzeBtn.disabled = false;

    };


    reader.readAsText(file);

});


// ======================================
// PROCESS FIJI CSV
// ======================================

function processFijiCSV(csvText) {

    progressBar.style.width = "10%";
    percentText.textContent = "10%";

    statusText.textContent =
        "Reading Fiji/ImageJ measurements...";


    setTimeout(function () {

        progressBar.style.width = "30%";
        percentText.textContent = "30%";

        statusText.textContent =
            "Counting detected particles...";


        const rows = parseCSV(csvText);


        if (rows.length < 2) {

            alert(
                "The Fiji/ImageJ CSV does not contain enough measurement data."
            );

            analyzeBtn.disabled = false;

            return;

        }


        // First row = column headings
        const headers = rows[0];

        // Remaining rows = detected particles
        const particleRows = rows.slice(1);


        // Remove completely empty rows
        const validRows = particleRows.filter(function (row) {

            return row.some(function (value) {

                return value.trim() !== "";

            });

        });


        const particleCount = validRows.length;


        progressBar.style.width = "55%";
        percentText.textContent = "55%";

        statusText.textContent =
            "Calculating particle measurements...";


        // ======================================
        // FIND AREA COLUMN
        // ======================================

        let areaIndex = -1;

        for (let i = 0; i < headers.length; i++) {

            if (
                headers[i].trim().toLowerCase() === "area"
            ) {

                areaIndex = i;
                break;

            }

        }


        let totalArea = 0;
        let averageArea = 0;


        if (areaIndex !== -1) {

            let areaValues = [];

            validRows.forEach(function (row) {

                const value =
                    parseFloat(row[areaIndex]);

                if (!isNaN(value)) {

                    areaValues.push(value);

                    totalArea += value;

                }

            });


            if (areaValues.length > 0) {

                averageArea =
                    totalArea / areaValues.length;

            }

        }


        progressBar.style.width = "75%";
        percentText.textContent = "75%";

        statusText.textContent =
            "Generating MicroCount results...";


        // ======================================
        // IMAGE COUNT
        // ======================================

        const imageCount =
            Number(localStorage.getItem("numImages")) || 1;


        const average =
            particleCount / imageCount;


        // ======================================
        // CONTAMINATION LEVEL
        // ======================================

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


        // ======================================
        // SAVE FIJI RESULTS
        // ======================================

        localStorage.setItem(
            "particles",
            particleCount
        );

        localStorage.setItem(
            "average",
            average.toFixed(2)
        );

        localStorage.setItem(
            "totalArea",
            totalArea.toFixed(2)
        );

        localStorage.setItem(
            "averageArea",
            averageArea.toFixed(2)
        );

        localStorage.setItem(
            "riskLevel",
            level
        );

        localStorage.setItem(
            "riskText",
            risk
        );


        // Save original CSV for this browser session
        localStorage.setItem(
            "fijiCSV",
            csvText
        );


        progressBar.style.width = "100%";
        percentText.textContent = "100%";

        statusText.textContent =
            "Fiji/ImageJ analysis completed successfully.";


        // ======================================
        // GO TO RESULTS
        // ======================================

        setTimeout(function () {

            window.location.href = "results.html";

        }, 1000);

    }, 500);

}


// ======================================
// SIMPLE CSV PARSER
// ======================================

function parseCSV(text) {

    const lines = text
        .replace(/\r/g, "")
        .split("\n")
        .filter(function (line) {

            return line.trim() !== "";

        });


    return lines.map(function (line) {

        return parseCSVLine(line);

    });

}


// ======================================
// HANDLE COMMAS INSIDE QUOTES
// ======================================

function parseCSVLine(line) {

    const result = [];

    let current = "";

    let insideQuotes = false;


    for (let i = 0; i < line.length; i++) {

        const character = line[i];


        if (character === '"') {

            if (
                insideQuotes &&
                line[i + 1] === '"'
            ) {

                current += '"';

                i++;

            }

            else {

                insideQuotes = !insideQuotes;

            }

        }

        else if (
            character === "," &&
            !insideQuotes
        ) {

            result.push(current);

            current = "";

        }

        else {

            current += character;

        }

    }


    result.push(current);

    return result;

}