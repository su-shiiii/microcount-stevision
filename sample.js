// ==========================
// MicroCount STEVision
// Sample Information
// ==========================

const sampleForm = document.getElementById("sampleForm");

sampleForm.addEventListener("submit", function (event) {

    // Get information from the form
    const school = document.getElementById("schoolName").value.trim();
    const section = document.getElementById("section").value.trim();
    const source = document.getElementById("source").value;
    const waterCondition = document.getElementById("waterCondition").value;
    const numImages = document.getElementById("numImages").value;

    const eyepiece = document.getElementById("eyepiece").value;
    const objective = document.getElementById("objective").value;

    const dataPrivacyConsent =
        document.getElementById("dataPrivacyConsent").checked;

    const researchParticipationConsent =
        document.getElementById("researchParticipationConsent").checked;


    // Check required fields
    if (
        school === "" ||
        section === "" ||
        source === "" ||
        waterCondition === "" ||
        numImages === "" ||
        eyepiece === "" ||
        objective === ""
    ) {
        event.preventDefault();

        alert("Please complete all required fields.");

        return;
    }


    // Data privacy consent
    if (!dataPrivacyConsent) {

        event.preventDefault();

        alert("Please accept the Data Privacy Consent.");

        return;
    }


    // Calculate total magnification
    const totalMagnification =
        Number(eyepiece) * Number(objective);


    // Save sample information
    localStorage.setItem("schoolName", school);
    localStorage.setItem("section", section);
    localStorage.setItem("source", source);
    localStorage.setItem("waterCondition", waterCondition);
    localStorage.setItem("numImages", numImages);

    localStorage.setItem("eyepiece", eyepiece);
    localStorage.setItem("objective", objective);
    localStorage.setItem(
        "totalMagnification",
        totalMagnification
    );

    localStorage.setItem(
        "dataPrivacyConsent",
        "true"
    );

    localStorage.setItem(
        "researchParticipationConsent",
        researchParticipationConsent
    );


    // Go to upload page
    window.location.href = "upload.html";
});