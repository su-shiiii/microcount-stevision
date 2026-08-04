const dropArea = document.getElementById("dropArea");
const fileInput = document.getElementById("fileInput");
const previewContainer = document.getElementById("previewContainer");
const analyzeBtn = document.getElementById("analyzeBtn");


if (dropArea) {


   dropArea.addEventListener("click", () => {
       fileInput.click();
   });


   fileInput.addEventListener("change", function () {
       showImages(this.files);
   });


   ["dragenter","dragover","dragleave","drop"].forEach(eventName=>{
       dropArea.addEventListener(eventName, preventDefaults,false);
   });


   // ALL the rest of your upload code goes inside this if block


}


// Browse files
fileInput.addEventListener("change", function () {
   showImages(this.files);
});


// Prevent browser opening files
["dragenter","dragover","dragleave","drop"].forEach(eventName => {
   dropArea.addEventListener(eventName, preventDefaults, false);
});


function preventDefaults(e){
   e.preventDefault();
   e.stopPropagation();
}


// Highlight upload box
["dragenter","dragover"].forEach(eventName => {
   dropArea.addEventListener(eventName, () => {
       dropArea.classList.add("dragover");
   });
});


["dragleave","drop"].forEach(eventName => {
   dropArea.addEventListener(eventName, () => {
       dropArea.classList.remove("dragover");
   });
});


// Drop files
dropArea.addEventListener("drop", function(e){


   const files = e.dataTransfer.files;


   showImages(files);


});


// Display previews
function showImages(files){


   previewContainer.innerHTML = "";


   Array.from(files).forEach((file,index)=>{


       if(!file.type.startsWith("image/")) return;


       const reader = new FileReader();


       reader.onload = function(e){
           localStorage.setItem("uploadedImage", e.target.result);


           const card = document.createElement("div");


           card.className = "preview-card";


           card.innerHTML = `
               <img src="${e.target.result}" alt="Preview">
               <p>Image ${index+1}</p>
           `;


           previewContainer.appendChild(card);


       }


       reader.readAsDataURL(file);


   });


if(files.length > 0){


   analyzeBtn.style.display = "block";


   analyzeBtn.onclick = function(){


       window.location.href = "analysis.html";


   };


}


}
dropArea.addEventListener("dragover", () => {
   dropArea.classList.add("dragover");
});


dropArea.addEventListener("dragleave", () => {
   dropArea.classList.remove("dragover");
});


dropArea.addEventListener("drop", () => {
   dropArea.classList.remove("dragover");
});
/* ===========================
  SAVE SAMPLE INFORMATION
=========================== */


const sampleForm = document.getElementById("sampleForm");


if(sampleForm){


sampleForm.addEventListener("submit", function(e){


   e.preventDefault(); // Stop normal form submission


   localStorage.setItem(
       "schoolName",
       document.querySelector('input[placeholder*="School"]').value
   );


   localStorage.setItem(
       "section",
       document.querySelector('input[placeholder*="STE"]').value
   );


   localStorage.setItem(
       "source",
       document.querySelector("select").value
   );


   localStorage.setItem(
       "sampleID",
       document.querySelector('input[placeholder*="Sample"]').value
   );


   // Go to the upload page
   window.location.href = "upload.html";


});


}
/* ===========================
  LOAD SAMPLE INFORMATION
=========================== */


const school = document.getElementById("schoolName");


if(school){


   school.textContent =
       localStorage.getItem("schoolName");


   document.getElementById("section").textContent =
       localStorage.getItem("section");


   document.getElementById("source").textContent =
       localStorage.getItem("source");


   document.getElementById("sampleID").textContent =
       localStorage.getItem("sampleID") || "N/A";


}
/* ===========================
  FIJI/IMAGEJ SIMULATION
=========================== */


if(document.getElementById("totalParticles")){


   // Number of uploaded microscope images
   const imageCount = Math.floor(Math.random()*6)+3; // 3-8 images


   // Simulated detected particles per image
   let totalParticles = 0;


   for(let i=0;i<imageCount;i++){


       totalParticles += Math.floor(Math.random()*35)+5;


   }


   const average = (totalParticles/imageCount).toFixed(2);


   document.getElementById("numImages").textContent = imageCount;


   document.getElementById("totalParticles").textContent =
       totalParticles + " particles";


   document.getElementById("averageParticles").textContent =
       average + " particles/image";


   let level = "";
   let risk = "";
   let color = "";


   if(average<=10){


       level="LEVEL 1";
       risk="Low Risk";
       color="green";


   }


   else if(average<=30){


       level="LEVEL 2";
       risk="Moderate Risk";
       color="yellow";


   }


   else if(average<=60){


       level="LEVEL 3";
       risk="High Risk";
       color="orange";


   }


   else{


       level="LEVEL 4";
       risk="Very High Risk";
       color="red";


   }


   const riskBox=document.querySelector(".risk-level");


   riskBox.className="risk-level "+color;


   riskBox.innerHTML=`
       ⚠️
       <div>
           <strong>${level}</strong><br>
           ${risk}
       </div>
   `;


   document.getElementById("interpretation").innerHTML=
   `
   Fiji/ImageJ-assisted computational image analysis identified
   an estimated average of
   <strong>${average} suspected microplastic particles per microscope image.</strong>


   Across
   <strong>${imageCount}</strong>
   uploaded microscope images, a total of
   <strong>${totalParticles}</strong>
   suspected microplastic particles were detected.


   Based on the MicroCount STEVision risk classification,
   the analyzed water sample is classified as
   <strong>${level} (${risk})</strong>.
   `;


}
/* ===========================
  DOWNLOAD REPORT
=========================== */


const downloadBtn = document.getElementById("downloadReport");


if(downloadBtn){


downloadBtn.addEventListener("click",()=>{


const report = `
========================================


MICROCOUNT STEVISION


MICROPLASTIC ANALYSIS REPORT


========================================


Sample Information


School:
${localStorage.getItem("schoolName")}


Section:
${localStorage.getItem("section")}


Water Source:
${localStorage.getItem("source")}


Sample ID:
${localStorage.getItem("sampleID")}


----------------------------------------


Analysis Summary


Number of Images:
${document.getElementById("numImages").textContent}


Total Detected Microplastic Particles:
${document.getElementById("totalParticles").textContent}


Average Count:
${document.getElementById("averageParticles").textContent}


Detection Tool:
Fiji/ImageJ-Assisted Computational Image Analysis


----------------------------------------


Interpretation


${document.getElementById("interpretation").innerText}


========================================


Generated by
MicroCount STEVision


========================================
`;


const blob = new Blob([report], {type:"text/plain"});


const link = document.createElement("a");


link.href = URL.createObjectURL(blob);


link.download = "MicroCount_Report.txt";


link.click();


});


}
/* ===========================
  LOAD RESULT IMAGE
=========================== */


const resultImage = document.getElementById("resultImage");


if(resultImage){


   resultImage.src =
       localStorage.getItem("uploadedImage");


}
/* ===========================
  ANALYSIS SIMULATION
=========================== */
const progressBar=document.getElementById("progressBar");


if(progressBar){


const percent=document.getElementById("percentText");


const status=document.getElementById("statusText");


let progress=0;


const messages=[


"Initializing Fiji/ImageJ...",


"Enhancing microscope image...",


"Identifying suspected microplastic particles...",


"Counting detected particles...",


"Calculating average quantity...",


"Generating risk assessment...",


"Preparing final report..."


];


const timer=setInterval(()=>{


progress++;


progressBar.style.width=progress+"%";


percent.innerHTML=progress+"%";


if(progress<15){


status.innerHTML=messages[0];


}


else if(progress<30){


status.innerHTML=messages[1];


}


else if(progress<50){


status.innerHTML=messages[2];


}


else if(progress<70){


status.innerHTML=messages[3];


}


else if(progress<90){


status.innerHTML=messages[4];


}


else{


status.innerHTML=messages[6];


}


if(progress>=100){


clearInterval(timer);


window.location.href="results.html";


}


},10);


}
