// ==========================
// MicroCount STEVision
// Sample Page
// ==========================

const continueBtn = document.getElementById("continueBtn");

continueBtn.addEventListener("click", function () {

    const school = document.getElementById("schoolName").value.trim();
    const section = document.getElementById("section").value.trim();
    const source = document.getElementById("source").value;
    const numImages = document.getElementById("numImages").value;
    const microscope = document.getElementById("microscopeType").value;
    if (
    school === "" ||
    section === "" ||
    source === "" ||
    numImages === "" ||
    microscope === ""
) {
    alert("Please complete all fields.");
    return;
}

    if (
        school === "" ||
        section === "" ||
        source === "" ||
        numImages === ""
    ) {
        alert("Please complete all fields.");
        return;
    }

    localStorage.setItem("schoolName", school);
    localStorage.setItem("section", section);
    localStorage.setItem("source", source);
    localStorage.setItem("numImages", numImages);

    window.location.href = "upload.html";

});