// ===============================
// MicroCount STEVision
// Upload Page
// ===============================

const dropArea = document.getElementById("dropArea");
const fileInput = document.getElementById("fileInput");
const previewContainer = document.getElementById("previewContainer");
const analyzeBtn = document.getElementById("analyzeBtn");
const nextBtn = document.getElementById("nextBtn");


// Hide buttons initially
if (analyzeBtn) {
    analyzeBtn.style.display = "none";
}

if (nextBtn) {
    nextBtn.style.display = "none";
}


// ===============================
// CLICK UPLOAD AREA
// ===============================

dropArea.addEventListener("click", () => {
    fileInput.click();
});


// ===============================
// FILE SELECTED
// ===============================

fileInput.addEventListener("change", () => {

    previewFiles(fileInput.files);

});


// ===============================
// DRAG & DROP
// ===============================

["dragenter", "dragover", "dragleave", "drop"].forEach(event => {

    dropArea.addEventListener(event, e => {

        e.preventDefault();
        e.stopPropagation();

    });

});


["dragenter", "dragover"].forEach(event => {

    dropArea.addEventListener(event, () => {

        dropArea.classList.add("dragover");

    });

});


["dragleave", "drop"].forEach(event => {

    dropArea.addEventListener(event, () => {

        dropArea.classList.remove("dragover");

    });

});


dropArea.addEventListener("drop", e => {

    previewFiles(e.dataTransfer.files);

});


// ===============================
// PREVIEW FILES
// ===============================

function previewFiles(files) {

    previewContainer.innerHTML = "";

    if (files.length === 0) {
        return;
    }


    // Save number of images
    localStorage.setItem("numImages", files.length);


    let finished = 0;

    const uploadedImages = [];


    Array.from(files).forEach((file, index) => {

        if (!file.type.startsWith("image/")) {
            return;
        }


        const reader = new FileReader();


        reader.onload = function(e) {

            const imageData = e.target.result;

            uploadedImages.push(imageData);


            // Create preview card
            const card = document.createElement("div");

            card.className = "preview-card";

            card.innerHTML = `
                <img src="${imageData}" alt="Microscope Image ${index + 1}">
                <p>Image ${index + 1}</p>
            `;

            previewContainer.appendChild(card);


            finished++;


            // When all images are processed
            if (finished === files.length) {

                // Save all images
                localStorage.setItem(
                    "uploadedImages",
                    JSON.stringify(uploadedImages)
                );


                // Keep first image for compatibility
                localStorage.setItem(
                    "uploadedImage",
                    uploadedImages[0]
                );


                console.log("Images saved:", uploadedImages.length);


                // Show buttons
                if (analyzeBtn) {
                    analyzeBtn.style.display = "inline-block";
                }

                if (nextBtn) {
                    nextBtn.style.display = "inline-block";
                }

            }

        };


        reader.readAsDataURL(file);

    });

}


// ===============================
// ANALYZE BUTTON
// ===============================

if (analyzeBtn) {

    analyzeBtn.addEventListener("click", () => {

        if (!localStorage.getItem("uploadedImages")) {

            alert("Please wait for the images to finish loading.");

            return;

        }

        window.location.href = "analysis.html";

    });

}


// ===============================
// NEXT BUTTON
// ===============================

if (nextBtn) {

    nextBtn.addEventListener("click", () => {

        if (!localStorage.getItem("uploadedImages")) {

            alert("Please upload your microscope images first.");

            return;

        }

        window.location.href = "analysis.html";

    });

}