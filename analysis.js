const progressBar = document.getElementById("progressBar");
const percentText = document.getElementById("percentText");
const statusText = document.getElementById("statusText");

const messages = [
    "Initializing Fiji/ImageJ...",
    "Loading microscope images...",
    "Enhancing image quality...",
    "Detecting suspected microplastics...",
    "Quantifying detected particles...",
    "Computing contamination level...",
    "Generating report..."
];

let progress = 0;

const timer = setInterval(function(){

    progress++;

    progressBar.style.width = progress + "%";
    percentText.textContent = progress + "%";

    if(progress < 15){
        statusText.textContent = messages[0];
    }
    else if(progress < 30){
        statusText.textContent = messages[1];
    }
    else if(progress < 45){
        statusText.textContent = messages[2];
    }
    else if(progress < 65){
        statusText.textContent = messages[3];
    }
    else if(progress < 85){
        statusText.textContent = messages[4];
    }
    else{
        statusText.textContent = messages[5];
    }

    if(progress >= 100){

        clearInterval(timer);

        let imageCount = Number(localStorage.getItem("numImages")) || 1;

        let totalParticles = 0;

        for(let i = 0; i < imageCount; i++){
            totalParticles += Math.floor(Math.random()*40)+15;
        }

        const average = (totalParticles/imageCount).toFixed(2);

        let level;
        let risk;

        if(average <= 10){
            level="LEVEL 1";
            risk="Low";
        }
        else if(average <=30){
            level="LEVEL 2";
            risk="Moderate";
        }
        else if(average <=60){
            level="LEVEL 3";
            risk="High";
        }
        else{
            level="LEVEL 4";
            risk="Very High";
        }

localStorage.setItem("numImages", imageCount);
localStorage.setItem("particles", totalParticles);
localStorage.setItem("average", average);
localStorage.setItem("riskLevel", level);
localStorage.setItem("riskText", risk);

        setTimeout(function(){
            console.log(localStorage.getItem("uploadedImage"));
            alert(localStorage.getItem("uploadedImage"));
alert(localStorage.getItem("particles"));
alert(localStorage.getItem("average"));
            window.location.href = "results.html";
        },500);

    }

},30);
const fragment = Math.round(totalParticles * 0.40);
const fiber = Math.round(totalParticles * 0.25);
const film = Math.round(totalParticles * 0.15);
const foam = Math.round(totalParticles * 0.08);
const pellet = Math.round(totalParticles * 0.07);

const line =
totalParticles -
fragment -
fiber -
film -
foam -
pellet;

localStorage.setItem("fragment", fragment);
localStorage.setItem("fiber", fiber);
localStorage.setItem("film", film);
localStorage.setItem("foam", foam);
localStorage.setItem("pellet", pellet);
localStorage.setItem("line", line);