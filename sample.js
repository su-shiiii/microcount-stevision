// ==========================
// MicroCount STEVision
// Sample Page
// ==========================

const continueBtn = document.getElementById("continueBtn");

continueBtn.addEventListener("click", function () {

    const school = document.getElementById("schoolName").value.trim();
    const section = document.getElementById("section").value.trim();
    const source = document.getElementById("source").value;
    const waterCondition = document.getElementById("waterCondition").value;
    const numImages = document.getElementById("numImages").value;
    const microscope = document.getElementById("microscopeType").value;

    // Check if all fields are completed
    if (
        school === "" ||
        section === "" ||
        source === "" ||
        waterCondition === "" ||
        numImages === "" ||
        microscope === ""
    ) {
        alert("Please complete all fields.");
        return;
    }

    // Save information
    localStorage.setItem("schoolName", school);
    localStorage.setItem("section", section);
    localStorage.setItem("source", source);
    localStorage.setItem("waterCondition", waterCondition);
    localStorage.setItem("numImages", numImages);
    localStorage.setItem("microscopeType", microscope);

    // Go to upload page
    window.location.href = "upload.html";
});