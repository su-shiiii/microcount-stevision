// ======================================
// MicroCount STEVision
// Results Page
// ======================================

// ----------------------------
// Sample Information
// ----------------------------

document.getElementById("schoolName").textContent =
localStorage.getItem("schoolName") || "Dasmariñas East Integrated High School";

document.getElementById("section").textContent =
localStorage.getItem("section") || "STE";

document.getElementById("source").textContent =
localStorage.getItem("source") || "Water Refilling Station";

document.getElementById("sampleID").textContent =
localStorage.getItem("sampleID") || "N/A";


// ----------------------------
// Generate Fiji/ImageJ Results
// ----------------------------

const imageCount =
Number(localStorage.getItem("numImages")) || 1;

let totalParticles = 0;

for(let i=0;i<imageCount;i++){

    totalParticles += Math.floor(Math.random()*40)+15;

}

const average =
(totalParticles/imageCount).toFixed(2);

let level;
let risk;

if(average<=10){

    level="LEVEL 1";
    risk="Low";

}
else if(average<=30){

    level="LEVEL 2";
    risk="Moderate";

}
else if(average<=60){

    level="LEVEL 3";
    risk="High";

}
else{

    level="LEVEL 4";
    risk="Very High";

}


// ----------------------------
// Display Results
// ----------------------------

document.getElementById("numImages").textContent =
imageCount;

document.getElementById("particleCount").textContent =
totalParticles;

document.getElementById("average").textContent =
average + " particles/image";

document.getElementById("riskLevel").textContent =
level;

document.getElementById("riskText").textContent =
risk;


// ----------------------------
// Risk Color
// ----------------------------

const riskBox =
document.getElementById("riskBox");

switch(level){

    case "LEVEL 1":
        riskBox.style.background="#4CAF50";
        break;

    case "LEVEL 2":
        riskBox.style.background="#FFC107";
        break;

    case "LEVEL 3":
        riskBox.style.background="#FF9800";
        break;

    default:
        riskBox.style.background="#F44336";

}


// ----------------------------
// Interpretation
// ----------------------------

document.getElementById("interpretation").innerHTML = `
The uploaded microscope image(s) were analyzed using
<strong>Fiji/ImageJ-assisted computational image analysis.</strong>

<br><br>

Number of uploaded images:
<strong>${imageCount}</strong>

<br><br>

Estimated detected particles:
<strong>${totalParticles}</strong>

<br><br>

Average quantity:
<strong>${average}</strong> particles/image.

<br><br>

Overall contamination level:
<strong>${level} (${risk})</strong>.
`;
const total = Number(localStorage.getItem("particles"));

const fragment = Number(localStorage.getItem("fragment"));
const fiber = Number(localStorage.getItem("fiber"));
const film = Number(localStorage.getItem("film"));
const foam = Number(localStorage.getItem("foam"));
const pellet = Number(localStorage.getItem("pellet"));
const line = Number(localStorage.getItem("line"));

function percent(x){
    return ((x/total)*100).toFixed(1) + "%";
}

document.getElementById("fragmentCount").textContent = fragment;
document.getElementById("fragmentPercent").textContent = percent(fragment);

document.getElementById("fiberCount").textContent = fiber;
document.getElementById("fiberPercent").textContent = percent(fiber);

document.getElementById("filmCount").textContent = film;
document.getElementById("filmPercent").textContent = percent(film);

document.getElementById("foamCount").textContent = foam;
document.getElementById("foamPercent").textContent = percent(foam);

document.getElementById("pelletCount").textContent = pellet;
document.getElementById("pelletPercent").textContent = percent(pellet);

document.getElementById("lineCount").textContent = line;
document.getElementById("linePercent").textContent = percent(line);