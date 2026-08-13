// ==========================================
// MicroCount STEVision
// Sample Information - Supabase
// ==========================================

// Supabase connection
const SUPABASE_URL = "https://ibyndeivsnyqvobveroy.supabase.co";
const SUPABASE_KEY = "sb_publishable_NnKcP-QokUHlc7akGwNHuQ_iKrha0Al";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ==========================================
// GET FORM
// ==========================================

const form = document.querySelector("form");


// ==========================================
// FORM SUBMISSION
// ==========================================

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    // Get information
    const school = document.getElementById("schoolName").value.trim();
    const section = document.getElementById("section").value.trim();
    const source = document.getElementById("source").value;
    const waterCondition = document.getElementById("waterCondition").value;
    const numImages = document.getElementById("imageCount").value;
    const eyepiece = document.getElementById("eyepiece").value;
    const objective = document.getElementById("objective").value;

    // Calculate magnification
    const totalMagnification =
        Number(eyepiece) * Number(objective);


    // ==========================================
    // CHECK REQUIRED INFORMATION
    // ==========================================

    if (
        school === "" ||
        section === "" ||
        source === "" ||
        waterCondition === "" ||
        numImages === "" ||
        eyepiece === "" ||
        objective === ""
    ) {
        alert("Please complete all required fields.");
        return;
    }


    // ==========================================
    // CHECK DATA PRIVACY CONSENT
    // ==========================================

    const privacyConsent =
        document.getElementById("dataPrivacyConsent").checked;

    if (!privacyConsent) {
        alert("Please accept the Data Privacy Consent.");
        return;
    }


    // ==========================================
    // SAVE TO SUPABASE
    // ==========================================

    const { data, error } = await supabaseClient
        .from("analyses")
        .insert([
            {
                school_name: school,
                section: section,
                water_source: source,
                water_condition: waterCondition,
                number_of_images: Number(numImages),
                eyepiece_magnification: Number(eyepiece),
                objective_magnification: Number(objective),
                total_magnification: totalMagnification,
                data_privacy_consent: privacyConsent,
                research_participation_consent:
                    document.getElementById(
                        "researchParticipationConsent"
                    ).checked
            }
        ])
        .select();


    // ==========================================
    // CHECK FOR ERROR
    // ==========================================

    if (error) {

        console.error("Supabase error:", error);

        alert(
            "There was a problem saving your information.\n\n" +
            error.message
        );

        return;
    }


    // ==========================================
    // SUCCESS
    // ==========================================

    console.log("Saved successfully:", data);

    alert("Sample information saved successfully!");

    // Go to upload page
    window.location.href = "upload.html";

});