// ======================================
// MicroCount STEVision
// Upload Page
// ======================================


// ======================================
// ELEMENTS
// ======================================

const uploadBox =
    document.getElementById("uploadBox");

const imageInput =
    document.getElementById("imageInput");

const browseBtn =
    document.getElementById("browseBtn");

const imagePreview =
    document.getElementById("imagePreview");

const imageCount =
    document.getElementById("imageCount");

const proceedAnalysisBtn =
    document.getElementById("proceedAnalysisBtn");


// ======================================
// BROWSE BUTTON
// ======================================

browseBtn.addEventListener("click", function (event) {

    event.stopPropagation();

    imageInput.click();

});


// ======================================
// CLICK UPLOAD BOX
// ======================================

uploadBox.addEventListener("click", function (event) {

    // Don't trigger the file picker twice
    // when the Browse Files button is clicked.

    if (event.target === browseBtn) {
        return;
    }

    imageInput.click();

});


// ======================================
// FILE SELECTION
// ======================================

imageInput.addEventListener(
    "change",
    function () {

        handleImages(imageInput.files);

    }
);


// ======================================
// DRAG AND DROP
// ======================================

uploadBox.addEventListener(
    "dragover",
    function (event) {

        event.preventDefault();

        uploadBox.classList.add("dragover");

    }
);


uploadBox.addEventListener(
    "dragleave",
    function () {

        uploadBox.classList.remove("dragover");

    }
);


uploadBox.addEventListener(
    "drop",
    function (event) {

        event.preventDefault();

        uploadBox.classList.remove("dragover");

        handleImages(
            event.dataTransfer.files
        );

    }
);


// ======================================
// PROCESS IMAGES
// ======================================

function handleImages(files) {

    // Clear previous preview
    imagePreview.innerHTML = "";

    imageCount.textContent = "";

    proceedAnalysisBtn.disabled = true;


    // No files selected
    if (!files || files.length === 0) {

        return;

    }


    // ==================================
    // MAXIMUM 20 IMAGES
    // ==================================

    if (files.length > 20) {

        alert(
            "Maximum 20 microscope images are allowed."
        );

        imageInput.value = "";

        return;

    }


    // ==================================
    // ONLY IMAGE FILES
    // ==================================

    const imageFiles =
        Array.from(files).filter(
            file =>
                file.type.startsWith("image/")
        );


    if (imageFiles.length === 0) {

        alert(
            "Please select microscope image files."
        );

        return;

    }


    // ==================================
    // READ ALL IMAGES
    // ==================================

    const uploadedImages = [];

    let completed = 0;


    imageFiles.forEach(
        function (file, index) {

            const reader =
                new FileReader();


            reader.onload = function (event) {

                uploadedImages[index] = {

                    name: file.name,

                    data: event.target.result

                };


                completed++;


                // ==================================
                // WAIT FOR ALL IMAGES
                // ==================================

                if (
                    completed === imageFiles.length
                ) {

                    // Display images
                    displayUploadedImages(
                        uploadedImages
                    );


                    // ==================================
                    // SAVE ALL IMAGES
                    // ==================================

                    localStorage.setItem(
                        "uploadedImages",
                        JSON.stringify(
                            uploadedImages
                        )
                    );


                    // ==================================
                    // SAVE FIRST IMAGE
                    // FOR COMPATIBILITY
                    // ==================================

                    localStorage.setItem(
                        "uploadedImage",
                        uploadedImages[0].data
                    );


                    // ==================================
                    // SAVE IMAGE COUNT
                    // ==================================

                    localStorage.setItem(
                        "numImages",
                        uploadedImages.length
                    );


                    // ==================================
                    // UPDATE COUNTER
                    // ==================================

                    imageCount.textContent =
                        uploadedImages.length +
                        " microscope image(s) selected.";


                    // ==================================
                    // ENABLE BUTTON
                    // ==================================

                    proceedAnalysisBtn.disabled =
                        false;

                }

            };


            reader.onerror = function () {

                alert(
                    "Unable to read image: " +
                    file.name
                );

            };


            reader.readAsDataURL(file);

        }
    );

}


// ======================================
// DISPLAY ALL UPLOADED IMAGES
// ======================================

function displayUploadedImages(images) {

    imagePreview.innerHTML = "";


    images.forEach(
        function (image, index) {

            // ==================================
            // CARD
            // ==================================

            const card =
                document.createElement("div");

            card.className =
                "preview-card";


            // ==================================
            // IMAGE
            // ==================================

            const img =
                document.createElement("img");

            img.src =
                image.data;

            img.alt =
                "Microscope Image " +
                (index + 1);


            // ==================================
            // IMAGE NAME
            // ==================================

            const name =
                document.createElement("p");

            name.textContent =
                "Image " +
                (index + 1) +
                ": " +
                image.name;


            // ==================================
            // ADD TO CARD
            // ==================================

            card.appendChild(img);

            card.appendChild(name);


            // ==================================
            // ADD TO PREVIEW
            // ==================================

            imagePreview.appendChild(card);

        }
    );

}


// ======================================
// PROCEED TO ANALYSIS
// ======================================

proceedAnalysisBtn.addEventListener(
    "click",
    function () {

        const images =
            localStorage.getItem(
                "uploadedImages"
            );


        if (!images) {

            alert(
                "Please upload at least one microscope image."
            );

            return;

        }


        const parsedImages =
            JSON.parse(images);


        if (
            !parsedImages ||
            parsedImages.length === 0
        ) {

            alert(
                "Please upload at least one microscope image."
            );

            return;

        }


        // ==================================
        // GO TO ANALYSIS
        // ==================================

        window.location.href =
            "analysis.html";

    }
);