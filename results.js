// ======================================
// MicroCount STEVision
// Results Page
// ======================================

function parseCSVLine(line) {
    const result = [];
    let current = "";
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            insideQuotes = !insideQuotes;
        } else if (char === ',' && !insideQuotes) {
            result.push(current.trim());
            current = "";
        } else {
            current += char;
        }
    }

    result.push(current.trim());
    return result;
}

function findColumn(headers, name) {
    return headers.findIndex(header =>
        header.trim().toLowerCase() === name.toLowerCase()
    );
}

function resolveStoredResults() {
    const csvText = localStorage.getItem("fijiCSV");
    const imageCountFromStorage = Number(localStorage.getItem("numImages")) || 1;

    if (!csvText) {
        return;
    }

    const lines = csvText.trim().split(/\r?\n/).filter(line => line.trim() !== "");
    if (lines.length < 2) {
        return;
    }

    const headers = parseCSVLine(lines[0]);
    const rows = lines.slice(1).map(parseCSVLine);
    const totalParticles = rows.length;
    const imageCount = Math.max(1, Number(localStorage.getItem("numImages")) || rows.length || 1);

    const summary = typeof summarizeCsvRows === 'function'
        ? summarizeCsvRows(rows, headers, imageCount)
        : {
            totalParticles,
            averageParticlesPerImage: totalParticles / imageCount,
            typeBreakdown: {
                Fragments: 0,
                Fibers: 0,
                Films: 0,
                Foams: 0,
                Pellets: 0,
                "Lines / Filaments": 0
            },
            risk: { level: 'LEVEL 1', text: 'Low' }
        };

    localStorage.setItem("particles", String(summary.totalParticles));
    localStorage.setItem("average", String((summary.averageParticlesPerImage || 0).toFixed(2)));
    localStorage.setItem("riskLevel", summary.risk.level);
    localStorage.setItem("riskText", summary.risk.text);
    localStorage.setItem("typeBreakdown", JSON.stringify(summary.typeBreakdown || {}));
    localStorage.setItem("numImages", String(imageCount));
}

// SAMPLE INFORMATION

document.getElementById("schoolName").textContent =
    localStorage.getItem("schoolName") ||
    "Dasmariñas East Integrated High School";

document.getElementById("section").textContent =
    localStorage.getItem("section") ||
    "STE";

document.getElementById("source").textContent =
    localStorage.getItem("source") ||
    "Water Refilling Station";

document.getElementById("sampleID").textContent =
    localStorage.getItem("sampleID") ||
    "N/A";

resolveStoredResults();

// ======================================
// FIJI / IMAGEJ RESULTS
// ======================================

const imageCount =
    Number(localStorage.getItem("numImages")) || 0;

const totalParticles =
    Number(localStorage.getItem("particles")) || 0;

const average =
    localStorage.getItem("average") || "0";

const level =
    localStorage.getItem("riskLevel") || "N/A";

const risk =
    localStorage.getItem("riskText") || "N/A";


// ======================================
// DISPLAY RESULTS
// ======================================

document.getElementById("numImages").textContent =
    imageCount;

document.getElementById("particleCount").textContent =
    totalParticles;

document.getElementById("average").textContent =
    average + " particles/image";

document.getElementById("riskLevel").textContent =
    level;

document.getElementById("riskText").textContent =
    risk;


// ======================================
// PARTICLE AREA
// ======================================

const totalArea =
    localStorage.getItem("totalArea");

const averageArea =
    localStorage.getItem("averageArea");


// If these elements exist on the page,
// display the Fiji/ImageJ measurements.

const totalAreaElement =
    document.getElementById("totalArea");

if (totalAreaElement) {

    totalAreaElement.textContent =
        totalArea
        ? totalArea + " µm²"
        : "N/A";

}


const averageAreaElement =
    document.getElementById("averageArea");

if (averageAreaElement) {

    averageAreaElement.textContent =
        averageArea
        ? averageArea + " µm²"
        : "N/A";

}


// ======================================
// RISK COLOR
// ======================================

const riskBox =
    document.getElementById("riskBox");

if (riskBox) {

    if (level === "LEVEL 1") {

        riskBox.style.background = "#4CAF50";

    }

    else if (level === "LEVEL 2") {

        riskBox.style.background = "#FFC107";

    }

    else if (level === "LEVEL 3") {

        riskBox.style.background = "#FF9800";

    }

    else if (level === "LEVEL 4") {

        riskBox.style.background = "#F44336";

    }

}


// ======================================
// INTERPRETATION
// ======================================

const interpretation =
    document.getElementById("interpretation");

function getTypeBreakdown() {
    try {
        const stored = JSON.parse(localStorage.getItem("typeBreakdown") || '{}');
        return {
            Fragments: Number(stored.Fragments) || 0,
            Fibers: Number(stored.Fibers) || 0,
            Films: Number(stored.Films) || 0,
            Foams: Number(stored.Foams) || 0,
            Pellets: Number(stored.Pellets) || 0,
            "Lines / Filaments": Number(stored["Lines / Filaments"]) || 0,
        };
    } catch (error) {
        return {
            Fragments: 0,
            Fibers: 0,
            Films: 0,
            Foams: 0,
            Pellets: 0,
            "Lines / Filaments": 0,
        };
    }
}

function updateMicroplasticTable() {
    const breakdown = getTypeBreakdown();
    const categories = [
        ["Fragments", "fragmentsCount", "fragmentsPercentage"],
        ["Fibers", "fibersCount", "fibersPercentage"],
        ["Films", "filmsCount", "filmsPercentage"],
        ["Foams", "foamsCount", "foamsPercentage"],
        ["Pellets", "pelletsCount", "pelletsPercentage"],
        ["Lines / Filaments", "linesCount", "linesPercentage"],
    ];

    const total = categories.reduce((sum, [type]) => sum + (breakdown[type] || 0), 0) || totalParticles || 1;

    categories.forEach(([type, countId, percentageId]) => {
        const count = document.getElementById(countId);
        const percentage = document.getElementById(percentageId);

        if (!count || !percentage) return;

        const value = breakdown[type] || 0;
        count.textContent = value;
        percentage.textContent = `${((value / total) * 100).toFixed(1)}%`;
    });
}

function getContaminationExplanation() {
    const riskText = (risk || '').toLowerCase();
    const breakdown = getTypeBreakdown();
    const dominantType = Object.entries(breakdown).sort((a, b) => b[1] - a[1])[0] || ['Fragments', 0];

    if (riskText.includes('very high') || level === 'LEVEL 4') {
        return `The sample shows a very high microplastic burden, suggesting stronger contamination from multiple sources such as packaging debris, synthetic fibers, and particle fragments. The dominant type was ${dominantType[0]}, which is consistent with a high-risk exposure profile.`;
    }

    if (riskText.includes('high') || level === 'LEVEL 3') {
        return `The sample falls in the high contamination range and may reflect persistent source contamination, including synthetic fiber shedding and fragment release from plastic materials. The dominant classification was ${dominantType[0]}, indicating active exposure to processed plastic particles.`;
    }

    if (riskText.includes('moderate') || level === 'LEVEL 2') {
        return `The sample shows a moderate contamination level, which may indicate occasional inflow from plastic packaging, filtration wear, or synthetic textile fibers. The dominant type was ${dominantType[0]}, suggesting a recurring but not severe contamination pattern.`;
    }

    return `The sample shows low contamination and may indicate limited exposure to synthetic plastic particles. The dominant type was ${dominantType[0]}, which remains below the higher-risk threshold according to the Li & Xing (2025) screening framework.`;
}

function getWaterRecommendations() {
    const levelValue = level || 'LEVEL 1';
    const recommendations = {
        'LEVEL 1': [
            'Continue routine source monitoring and keep water-contact materials clean.',
            'Inspect drinking containers and dispensing units for wear or plastic degradation.',
            'Repeat testing every few months to confirm low-risk conditions.'
        ],
        'LEVEL 2': [
            'Replace or clean storage containers and filtration accessories regularly.',
            'Limit exposure to plastic-packaged water and synthetic fiber sources near the dispensing area.',
            'Repeat the analysis after corrective action to confirm improvement.'
        ],
        'LEVEL 3': [
            'Improve water handling by replacing old plastic lines, filters, and containers.',
            'Reduce contact with plastic packaging and textile fibers near the water source.',
            'Schedule immediate follow-up testing and implement source-control measures.'
        ],
        'LEVEL 4': [
            'Stop using the affected supply until a corrective action plan is implemented.',
            'Inspect all storage, piping, and filtration components for plastic contamination sources.',
            'Perform further laboratory verification and source tracing before resuming use.'
        ]
    };

    return recommendations[levelValue] || recommendations['LEVEL 1'];
}

if (interpretation) {
    updateMicroplasticTable();

    const explanationElement = document.getElementById("contaminationExplanation");
    if (explanationElement) {
        explanationElement.textContent = getContaminationExplanation();
    }

    const recommendationsList = document.getElementById("waterRecommendations");
    if (recommendationsList) {
        recommendationsList.innerHTML = getWaterRecommendations()
            .map(item => `<li>${item}</li>`)
            .join('');
    }

    interpretation.innerHTML = `

        The microscope image data were analyzed
        using <strong>Fiji/ImageJ-assisted
        computational image analysis</strong>.

        <br><br>

        Number of uploaded images:
        <strong>${imageCount}</strong>

        <br><br>

        Detected particles:
        <strong>${totalParticles}</strong>

        <br><br>

        Average particles per image:
        <strong>${average}</strong>

        <br><br>

        Overall contamination level:
        <strong>${level} (${risk})</strong>.

        <br><br>

        This screening level is based on the adapted Li & Xing (2025)
        microplastic contamination framework and is intended as a research-based preliminary assessment.

    `;

}