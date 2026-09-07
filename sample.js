// ======================================
// MicroCount STEVision
// Sample Information
// ======================================


// ======================================
// ELEMENTS
// ======================================

const sampleForm = document.getElementById("sampleForm");

const schoolName = document.getElementById("schoolName");
const section = document.getElementById("section");

const source = document.getElementById("source");
const otherSource = document.getElementById("otherSource");
const otherSourceGroup = document.getElementById("otherSourceGroup");

const waterCondition =
    document.getElementById("waterCondition");

const daysStored =
    document.getElementById("daysStored");

const numImages =
    document.getElementById("numImages");

const eyepiece =
    document.getElementById("eyepiece");

const objective =
    document.getElementById("objective");

const totalMagnification =
    document.getElementById("totalMagnification");

const dataPrivacyConsent =
    document.getElementById("dataPrivacyConsent");

const researchParticipationConsent =
    document.getElementById("researchParticipationConsent");


// ======================================
// SAVE SAMPLE INFORMATION
// ======================================

function saveSampleData() {

    localStorage.setItem(
        "schoolName",
        schoolName.value
    );

    localStorage.setItem(
        "section",
        section.value
    );

    localStorage.setItem(
        "source",
        source.value
    );

    localStorage.setItem(
        "otherSource",
        otherSource.value
    );

    localStorage.setItem(
        "waterCondition",
        waterCondition.value
    );

    localStorage.setItem(
        "daysStored",
        daysStored.value
    );

    localStorage.setItem(
        "numImages",
        numImages.value
    );

    localStorage.setItem(
        "eyepiece",
        eyepiece.value
    );

    localStorage.setItem(
        "objective",
        objective.value
    );

    localStorage.setItem(
        "totalMagnification",
        totalMagnification.textContent
    );

    localStorage.setItem(
        "dataPrivacyConsent",
        dataPrivacyConsent.checked
    );

    localStorage.setItem(
        "researchParticipationConsent",
        researchParticipationConsent.checked
    );

}


// ======================================
// LOAD SAVED INFORMATION
// ======================================

function loadSampleData() {

    schoolName.value =
        localStorage.getItem("schoolName") || "";

    section.value =
        localStorage.getItem("section") || "";

    source.value =
        localStorage.getItem("source") || "";

    otherSource.value =
        localStorage.getItem("otherSource") || "";

    waterCondition.value =
        localStorage.getItem("waterCondition") || "";

    daysStored.value =
        localStorage.getItem("daysStored") || "";

    numImages.value =
        localStorage.getItem("numImages") || "";

    eyepiece.value =
        localStorage.getItem("eyepiece") || "";

    objective.value =
        localStorage.getItem("objective") || "";

    dataPrivacyConsent.checked =
        localStorage.getItem("dataPrivacyConsent") === "true";

    researchParticipationConsent.checked =
        localStorage.getItem("researchParticipationConsent") === "true";


    updateOtherSource();

    calculateMagnification(false);

}


// ======================================
// OTHER WATER SOURCE
// ======================================

function updateOtherSource() {

    if (source.value === "Other") {

        otherSourceGroup.style.display = "block";

        otherSource.required = true;

    } else {

        otherSourceGroup.style.display = "none";

        otherSource.required = false;

        otherSource.value = "";

    }

}


// ======================================
// CALCULATE MAGNIFICATION
// ======================================

function calculateMagnification(save = true) {

    const eye =
        Number(eyepiece.value);

    const obj =
        Number(objective.value);


    if (eye > 0 && obj > 0) {

        const total =
            eye * obj;

        totalMagnification.textContent =
            total + "x";

    } else {

        totalMagnification.textContent =
            "—";

    }


    if (save) {
        saveSampleData();
    }

}


// ======================================
// SAVE WHEN USER CHANGES INFORMATION
// ======================================

const fields = [

    schoolName,
    section,
    source,
    otherSource,
    waterCondition,
    daysStored,
    numImages,
    eyepiece,
    objective,
    dataPrivacyConsent,
    researchParticipationConsent

];


fields.forEach(field => {

    if (!field) return;

    field.addEventListener(
        "input",
        saveSampleData
    );

    field.addEventListener(
        "change",
        saveSampleData
    );

});


// ======================================
// WATER SOURCE CHANGE
// ======================================

source.addEventListener(
    "change",
    function () {

        updateOtherSource();

        saveSampleData();

    }
);


// ======================================
// MAGNIFICATION CHANGE
// ======================================

eyepiece.addEventListener(
    "change",
    function () {

        calculateMagnification(true);

    }
);


objective.addEventListener(
    "change",
    function () {

        calculateMagnification(true);

    }
);


// ======================================
// FORM SUBMIT
// ======================================

sampleForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        // Save everything before leaving

        saveSampleData();


        // ==================================
        // CREATE SUBMISSION / SAMPLE CODE
        // ==================================

        if (!localStorage.getItem("sampleID")) {

            const date =
                new Date();

            const year =
                date.getFullYear();

            const month =
                String(
                    date.getMonth() + 1
                ).padStart(2, "0");

            const day =
                String(
                    date.getDate()
                ).padStart(2, "0");


            const randomCode =
                Math.random()
                    .toString(36)
                    .substring(2, 6)
                    .toUpperCase();


            const sampleID =
                `MC-${year}${month}${day}-${randomCode}`;


            localStorage.setItem(
                "sampleID",
                sampleID
            );

        }


        // ==================================
        // GO TO UPLOAD PAGE
        // ==================================

        window.location.href =
            "upload.html";

    }
);


// ======================================
// LOAD SAVED DATA WHEN PAGE OPENS
// ======================================

loadSampleData();
const numImagesInput =
    document.getElementById("numImages");

if (numImagesInput) {

    numImagesInput.addEventListener("input", function () {

        const value = Number(this.value);

        if (value < 10) {
            this.setCustomValidity(
                "Please enter at least 10 microscope images."
            );
        }

        else if (value > 20) {
            this.setCustomValidity(
                "You can upload a maximum of 20 microscope images."
            );
        }

        else {
            this.setCustomValidity("");
        }

    });

}
// =====================================================
// IMAGE RECOMMENDATION LINK
// =====================================================

const imageRecommendationLink =
    document.getElementById("imageRecommendationLink");

const imageRecommendation =
    document.getElementById("imageRecommendation");


if (
    imageRecommendationLink &&
    imageRecommendation
) {

    imageRecommendationLink.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            if (
                imageRecommendation.style.display === "none"
            ) {

                imageRecommendation.style.display = "block";

                imageRecommendationLink.textContent =
                    "📷 Hide image recommendation";

            }

            else {

                imageRecommendation.style.display = "none";

                imageRecommendationLink.textContent =
                    "📷 Recommended number of images per water sample: 10 or more";

            }

        }
    );

}