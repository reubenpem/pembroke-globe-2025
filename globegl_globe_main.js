import './globe.css'
import Globe from "./globegl.js";

const myGlobe = Globe();

myGlobe(document.getElementById('app'))
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
    .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
    .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png');

myGlobe.controls().autoRotate = true;
myGlobe.controls().autoRotateSpeed = 1.0;

function showHighlights() {
    fetch('./data/pembroke_alumni.arr')
    .then(response => 
        response.json().then(json => {
            console.log(json);
            myGlobe.htmlElementsData(json);
        })
    );
    fetch('../data/pembroke_alumni.geojson')
        .then(res => res.json())
        .then(countries => {
            myGlobe
                .labelsData(countries.features)
                .onLabelClick(stopRotation)
                .labelLat(d => d.properties.latitude)
                .labelLng(d => d.properties.longitude)
                .labelText(d => d.properties.shortname)
                .labelColor(() => 'rgba(255, 165, 0, 0.75)')
                .labelSize(0.5)
                .labelDotRadius(0)
                .htmlElement(d => {
                    const el = document.createElement('div');
                    el.innerHTML = `
                        <img src=${d.imageUrl} width="50" height="50" onclick="stopRotation">
                    `;
                    return el;
                });
            setTimeout(() => myGlobe
                .labelsTransitionDuration(4000)
                .labelAltitude(
                    feat =>
                        Math.max(0.05, Math.sqrt(+feat.properties.labelrank)*0.05)), 3000);
        });
}

function stopHighlights() {
    myGlobe.labelsData([]);
}

function showDistribution() {
    fetch('./data/pembroke_alumni.arr')
    .then(response => 
        response.json().then(json => {
            console.log(json);
            myGlobe.htmlElementsData(json)})
    );
    myGlobe.htmlElement(d => {
            const el = document.createElement('div');
            el.innerHTML = `<svg viewBox="-4, 0, 36 36"><path fill="currentColor" d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z"></path><circle fill="black" cx="14" cy="14" r="7"></circle></svg>`;
            el.style.color = d.color;
            el.style.width = `${d.size}px`;
            el.style['pointer-events'] = 'auto';
            el.style.cursor = 'pointer';
            return el;
        });
}

function stopDistribution() {
    myGlobe.htmlElementsData([]);
}


function stopRotation() {
    myGlobe.controls().autoRotate = !myGlobe.controls().autoRotate;

    if (myGlobe.controls().autoRotate) {
        myGlobe.labelLabel(d => `
            <div class="card">
                <img src=${d.properties.imageUrl} alt=${d.properties.name} style="width:20%">
                <div class="container">
                    <h2>${d.properties.name}</h2>
                    <p>${d.properties.facts}</p>
                </div>
            </div>
        `);
    } else {
        myGlobe.labelLabel();
    }
}

const viewButton = document.getElementById("view");
viewButton.addEventListener('click', toggleView);

function toggleView() {
    //var viewButton = document.getElementById("view");
    console.log(viewButton.value);

    if (viewButton.value === 'View - Highlights') {
        stopDistribution();
        showHighlights();
        viewButton.value = 'View - Distribution';
    } else {
        stopHighlights();
        showDistribution();
        viewButton.value = 'View - Highlights';
    }
}

// const button = document.querySelector("#button");
// const icon = document.querySelector("#button > i");
// const audio = document.querySelector("audio");

// button.addEventListener("click", () => {
//     if (audio.paused) {
//         audio.play();
//         audio.volume = 0.2;
//         icon.classList.remove('fa-volume-up');
//         icon.classList.add('fa-volume-mute');
//     } else {
//         audio.pause();
//         icon.classList.remove('fa-volume-mute');
//         icon.classList.add('fa-volume-up');
//     }
//     button.classList.add('fade');
// });
