// ===============================
// MicroCount STEVision
// Upload Page
// ===============================

const dropArea = document.getElementById("dropArea");
const fileInput = document.getElementById("fileInput");
const previewContainer = document.getElementById("previewContainer");
const analyzeBtn = document.getElementById("analyzeBtn");

analyzeBtn.style.display = "none";

dropArea.addEventListener("click", () => {
    fileInput.click();
});

fileInput.addEventListener("change", () => {
    previewFiles(fileInput.files);
});

["dragenter","dragover","dragleave","drop"].forEach(event=>{
    dropArea.addEventListener(event,e=>{
        e.preventDefault();
        e.stopPropagation();
    });
});

["dragenter","dragover"].forEach(event=>{
    dropArea.addEventListener(event,()=>{
        dropArea.classList.add("dragover");
    });
});

["dragleave","drop"].forEach(event=>{
    dropArea.addEventListener(event,()=>{
        dropArea.classList.remove("dragover");
    });
});

dropArea.addEventListener("drop",(e)=>{

    previewFiles(e.dataTransfer.files);

});

function previewFiles(files){

    previewContainer.innerHTML="";

    if(files.length===0) return;

    localStorage.setItem("numImages",files.length);

    let finished = 0;

    Array.from(files).forEach((file,index)=>{

        if(!file.type.startsWith("image/")) return;

        const reader = new FileReader();

        reader.onload=function(e){
            alert("Reader loaded!");

if (index === 0) {

    const imageData = e.target.result;

localStorage.setItem("uploadedImage", imageData);
alert("Image saved!");

    console.log("Image saved successfully.");

    console.log(imageData.length);

}

            const card=document.createElement("div");

            card.className="preview-card";

            card.innerHTML=`
                <img src="${e.target.result}">
                <p>Image ${index+1}</p>
            `;

            previewContainer.appendChild(card);

            finished++;

            // Wait until ALL images finish loading
            if(finished===files.length){

                analyzeBtn.style.display="inline-block";

            }

        };

        reader.readAsDataURL(file);

    });

}

analyzeBtn.addEventListener("click",()=>{

    if(!localStorage.getItem("uploadedImage")){

        alert("Please wait for the image to finish loading.");

        return;

    }

    window.location.href="analysis.html";

});
analyzeBtn.addEventListener("click", function () {
    window.location.href = "analysis.html";
});
const nextBtn = document.getElementById("nextBtn");

if (nextBtn) {
    nextBtn.addEventListener("click", function () {
        window.location.href = "analysis.html";
    });
}