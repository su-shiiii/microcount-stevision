// ==========================
// MicroCount STEVision
// Sample Information
// ==========================

const sampleForm = document.getElementById("sampleForm");

// Field save buttons
const schoolNameBtn = document.getElementById("schoolNameBtn");
const sectionBtn = document.getElementById("sectionBtn");
const sourceBtn = document.getElementById("sourceBtn");
const waterConditionBtn = document.getElementById("waterConditionBtn");
const populationBtn = document.getElementById("populationBtn");
const numImagesBtn = document.getElementById("numImagesBtn");
const magnificationBtn = document.getElementById("magnificationBtn");

// Handle School Name save
if (schoolNameBtn) {
    schoolNameBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const value = document.getElementById("schoolName").value.trim();
        localStorage.setItem("schoolName", value);
        document.getElementById("schoolNameStatus").textContent = value ? "✓ Saved" : "";
    });
}

// Handle Section save
if (sectionBtn) {
    sectionBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const value = document.getElementById("section").value.trim();
        localStorage.setItem("section", value);
        document.getElementById("sectionStatus").textContent = value ? "✓ Saved" : "";
    });
}

// Handle Water Source save
if (sourceBtn) {
    sourceBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const value = document.getElementById("source").value;
        const otherValue = document.getElementById("otherSource").value.trim();
        
        if (value === "Other" && otherValue) {
            localStorage.setItem("source", otherValue);
            document.getElementById("sourceStatus").textContent = "✓ Saved";
        } else if (value && value !== "Other") {
            localStorage.setItem("source", value);
            document.getElementById("sourceStatus").textContent = "✓ Saved";
        }
    });
}

// Handle Water Condition save
if (waterConditionBtn) {
    waterConditionBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const value = document.getElementById("waterCondition").value;
        if (value) {
            localStorage.setItem("waterCondition", value);
            document.getElementById("waterConditionStatus").textContent = "✓ Saved";
        }
    });
}

// Handle Population save
if (populationBtn) {
    populationBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const value = document.getElementById("population").value.trim();
        localStorage.setItem("population", value);
        document.getElementById("populationStatus").textContent = value ? "✓ Saved" : "";
    });
}

// Handle Number of Images save
if (numImagesBtn) {
    numImagesBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const value = document.getElementById("numImages").value;
        if (value && value >= 1 && value <= 20) {
            localStorage.setItem("numImages", value);
            document.getElementById("numImagesStatus").textContent = "✓ Saved";
        } else {
            alert("Please enter a number between 1 and 20.");
        }
    });
}

// Handle Magnification save
if (magnificationBtn) {
    magnificationBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const eyepiece = document.getElementById("eyepiece").value;
        const objective = document.getElementById("objective").value;
        
        if (eyepiece && objective) {
            const totalMagnification = Number(eyepiece) * Number(objective);
            localStorage.setItem("eyepiece", eyepiece);
            localStorage.setItem("objective", objective);
            localStorage.setItem("totalMagnification", totalMagnification);
            document.getElementById("magnificationStatus").textContent = "✓ Saved";
        }
    });
}

// Handle Source field display for "Other"
const sourceSelect = document.getElementById("source");
const otherSourceInput = document.getElementById("otherSource");

if (sourceSelect && otherSourceInput) {
    sourceSelect.addEventListener("change", () => {
        if (sourceSelect.value === "Other") {
            otherSourceInput.style.display = "block";
        } else {
            otherSourceInput.style.display = "none";
        }
    });
}

// Update total magnification display
const eyepieceSelect = document.getElementById("eyepiece");
const objectiveSelect = document.getElementById("objective");
const totalMagnificationDisplay = document.getElementById("totalMagnification");

if (eyepieceSelect && objectiveSelect && totalMagnificationDisplay) {
    const updateMagnification = () => {
        if (eyepieceSelect.value && objectiveSelect.value) {
            const total = Number(eyepieceSelect.value) * Number(objectiveSelect.value);
            totalMagnificationDisplay.textContent = total + "x";
        } else {
            totalMagnificationDisplay.textContent = "—";
        }
    };
    
    eyepieceSelect.addEventListener("change", updateMagnification);
    objectiveSelect.addEventListener("change", updateMagnification);
}

// Handle form submission
sampleForm.addEventListener("submit", function (event) {
    // All fields are optional now, so we just save the numImages and proceed
    const numImages = document.getElementById("numImages").value || "10";
    
    localStorage.setItem("numImages", numImages);
    localStorage.setItem("researchParticipationConsent", 
        document.getElementById("researchParticipationConsent").checked ? "true" : "false"
    );

    // Go to upload page
    window.location.href = "upload.html";
});