// ------getting HTML elements------

// get canvas elements
const cvsWrapper = document.querySelector("#canvas-wrapper");
const cvsContainer = document.querySelector("#canvas-container");
const cvs = document.querySelector("#canvas");
const body = document.querySelector("body");

// get all sliders and inputs
let tabFields = [];
for (let i = 0; i < 3; i++) {
    let parent = "#tab_" + (i + 1) + " ";
    tabFields[i] = {
        weightRange: document.querySelector(parent + ".weight-range"),
        weightText: document.querySelector(parent + ".weight-text"),
        angleRange: document.querySelector(parent + ".angle-range"),
        angleText: document.querySelector(parent + ".angle-text"),
        offsetRange: document.querySelector(parent + ".offset-range"),
        offsetText: document.querySelector(parent + ".offset-text")
    }
}



// click on default tabs in sidebar
document.getElementById("default").click();
document.getElementById("e-default").click();




// ------DEFAULT PATTERN SETTINGS------

const fNodes = [ // default node bezier coordinates at 1000px height (1x scale)
    [289.22, 280.39],
    [364.81, 280.39],
    [395.48, 176.34, 427.25, 116.1, 483.12, 63.53],
    [522.56, 26.29, 577.34, 0, 644.16, 0],
    [715.37, 0, 757, 33.95, 757, 88.72],
    [757, 139.1, 712.08, 156.63, 685.79, 156.63],
    [651.83, 156.63, 636.49, 140.2, 639.78, 121.58],
    [643.07, 105.15, 647.45, 84.34, 647.45, 71.19],
    [647.45, 44.91, 640.88, 27.38, 622.25, 27.38],
    [600.34, 27.38, 583.91, 52.57, 569.67, 90.91],
    [552.14, 143.48, 536.8, 200.44, 518.18, 280.39],
    [615.68, 280.39],
    [604.72, 307.78],
    [510.51, 314.35],
    [455.73, 532.31, 409.72, 692.22, 379.05, 760.13],
    [335.23, 855.42, 267.31, 923.33, 187.33, 970.43],
    [148.99, 992.33, 113.93, 1000, 78.88, 1000],
    [42.73, 1000, 0, 973.71, 0, 936.47],
    [0, 911.28, 24.1, 879.52, 50.39, 866.37],
    [71.21, 855.42, 85.45, 859.8, 96.41, 877.33],
    [120.51, 916.76, 144.61, 941.95, 167.61, 941.95],
    [187.33, 941.95, 199.38, 927.71, 211.43, 892.66],
    [237.73, 815.99, 302.36, 539.98, 357.14, 314.35],
    [278.26, 307.78],
    [289.22, 280.39]
]

const fDimensions = { x: 757, y: 1000 } // default bounding box dimensions of F at 1000px height

const fDefaultSettings = { // default context transformations and F characteristics

    angleInitial: 0, // rotation of whole circle
    angleCircle: 0, // rotation increment around center of circle, relative value, can be calculated by number of Fs
    angleF: 0, // rotation around center of individual F character, absolute value
    offset: 25, // distance from center of circle (radius)
    scale: 1.2,
    fillStyle: "black",
    fillOn: true,
    strokeStyle: "black",
    lineWidth: 1,
    strokeOn: false,
    weightValue: 0,
    nodes: fNodes,
    backgroundColor: "#FFFFFF"
}


// ------utility functions------

function randomNumber(min, max) { // inclusive of both min and max numbers
    return Math.round(Math.random() * (max - min)) + min;
}

function easeMath(x) {
    return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}


// ------drawing functions------

// clones the fDefaultSettings object and returns a settingsObject with any overwritten settings
function customSettings(overwrite = {}) {

    let newSettings = JSON.parse(JSON.stringify(fDefaultSettings));

    Object.assign(newSettings, overwrite);

    return newSettings;
}

// returns a set of modified nodes based on fNodes depending on the weight value
function weightedNodes(weightAdd = 0) { // default weight (bold) = 0

    const nodesMove = { // which nodes to move left or right
        // first item in array is node number
        left: [
            [0, 0],
            [1, 0],
            [2, 0],
            [2, 2],
            [2, 4],
            [3, 0],
            //
            [15, 2],
            [15, 4],
            [16, 0],
            [16, 2],
            [16, 4],
            [17, 0],
            [17, 2],
            [17, 4],
            [18, 0],
            [18, 2],
            [18, 4],
            [19, 0],
            [19, 2],
            [19, 4],
            [20, 0],
            [20, 2],
            [20, 4],
            [21, 0],
            [21, 2],
            [21, 4],
            [22, 0],
            [22, 2],
            [22, 4],
            [23, 0],
            [24, 0]
        ],
        right: [
            [3, 2],
            [3, 4],
            [4, 0],
            [4, 2],
            [4, 4],
            [5, 0],
            [5, 2],
            [5, 4],
            [6, 0],
            [6, 2],
            [6, 4],
            [7, 0],
            [7, 2],
            [7, 4],
            [8, 0],
            [8, 2],
            [8, 4],
            [9, 0],
            [9, 2],
            [9, 4],
            [10, 0],
            [10, 2],
            [10, 4],
            [11, 0],
            [12, 0],
            [13, 0],
            [14, 0],
            [14, 2],
            [14, 4],
            [15, 0]
        ]
    }

    var modifyNodes = JSON.parse(JSON.stringify(fNodes));

    if (weightAdd && weightAdd >= 0) {

        // moving nodes left
        for (let i = 0; i < nodesMove.left.length; i++) {
            modifyNodes[nodesMove.left[i][0]][nodesMove.left[i][1]] -= weightAdd;
        }

        // moving nodes right
        for (let i = 0; i < nodesMove.right.length; i++) {
            modifyNodes[nodesMove.right[i][0]][nodesMove.right[i][1]] += weightAdd;
        }

        // adjusting handles
    }

    return modifyNodes;
}

// draws F at ctx (0,0)
function drawF(settingsObj) { // function parameters are passed as an object

    const scaleTenth = settingsObj.scale * 0.1;

    ctx.beginPath();
    ctx.moveTo(settingsObj.nodes[0][0] * scaleTenth, settingsObj.nodes[0][1] * scaleTenth); // starting coordinates

    // setting fill and stroke based on settingsObj parameters
    ctx.fillStyle = settingsObj.fillStyle;
    ctx.strokeStyle = settingsObj.strokeStyle;
    ctx.lineWidth = settingsObj.lineWidth;

    // drawing path based on scaleTenth parameter
    for (let i = 1; i < settingsObj.nodes.length; i++) {
        if (settingsObj.nodes[i].length == 2) {
            let scaleNodes = [settingsObj.nodes[i][0] * scaleTenth, settingsObj.nodes[i][1] * scaleTenth];
            ctx.lineTo(scaleNodes[0], scaleNodes[1]);
        } else if (settingsObj.nodes[i].length == 6) {
            let scaleNodes = [settingsObj.nodes[i][0] * scaleTenth, settingsObj.nodes[i][1] * scaleTenth, settingsObj.nodes[i][2] * scaleTenth, settingsObj.nodes[i][3] * scaleTenth, settingsObj.nodes[i][4] * scaleTenth, settingsObj.nodes[i][5] * scaleTenth];
            ctx.bezierCurveTo(scaleNodes[0], scaleNodes[1], scaleNodes[2], scaleNodes[3], scaleNodes[4], scaleNodes[5]);
        }
    }

    // applying fill and stroke
    if (settingsObj.fillOn == true) {
        ctx.fill();
    }
    if (settingsObj.strokeOn == true) {
        ctx.stroke();
    }
}

// rotates and translates context and then runs drawF() once
function placeF(settingsObj) {

    const scaleTenth = settingsObj.scale * 0.1;

    // transform context, rotate around center of circle
    ctx.rotate(settingsObj.angleCircle);
    ctx.translate((-fDimensions.x / 4) * scaleTenth, (-fDimensions.y / 2) * scaleTenth - settingsObj.offset * settingsObj.scale);

    // rotate around center of F
    ctx.rotate(settingsObj.angleF * Math.PI / 180);
    ctx.translate((-fDimensions.x / 4) * scaleTenth, (-fDimensions.y / 2) * scaleTenth);

    // drawing F
    drawF(settingsObj);

    // undo context transforms except for angleCircle
    ctx.translate((fDimensions.x / 4) * scaleTenth, (fDimensions.y / 2) * scaleTenth);
    ctx.rotate(-settingsObj.angleF * Math.PI / 180);

    ctx.translate((fDimensions.x / 4) * scaleTenth, (fDimensions.y / 2) * scaleTenth + settingsObj.offset * settingsObj.scale);

}

// runs placeF() a specified number of times
function circleFs(repeats, settingsObj = Object.assign({}, fDefaultSettings)) {

    ctx.rotate(settingsObj.angleInitial); // rotation of whole circle

    settingsObj.angleCircle = 360 / repeats * Math.PI / 180;

    for (let i = 0; i < repeats; i++) {
        placeF(settingsObj);
    }

    return settingsObj;
}

// makes pattern of 3 circles based on activePattern obj
function makePattern(pattern = activePattern, setLast = true) {

    ctx.restore();
    ctx.save();
    ctx.clearRect(0, 0, cvs.width, cvs.height);

    for (let i = 0; i < 3; i++) {
        ctx.restore();
        ctx.save();
        ctx.translate(cvsCentre.x, cvsCentre.y);

        circleFs(10, pattern[i]);

    }

    body.style.backgroundColor = pattern[randomNumber(0, 2)].backgroundColor;

    setFields(pattern);

    if (setLast == true) {
        lastPattern = JSON.parse(JSON.stringify(pattern));
    }
};

function randomPattern() {

    const colorSets = ["three-unique", "two-to-one", "global"] // types of colour combo
    // const setSelect = colorSets[randomNumber(0, (colorSets.length - 1))]
    const setSelect = "two-to-one"; // which colour combo type
    let layerColors = {}; // put colour combo type

    if (setSelect == "three-unique") {
        for (let i = 0; i < 3; i++) {
            layerColors[i] = randomColor();
        }
    }
    else if (setSelect == "two-to-one") {
        const commonColor = randomColor();
        const uniqueLayer = randomNumber(0, 2);
        for (let i = 0; i < 3; i++) {
            if (i == uniqueLayer) {
                layerColors[i] = randomColor();
            }
            else {
                layerColors[i] = commonColor;
            }
        }
    }
    else {
        let commonColor = randomColor();
        layerColors[0] = commonColor;
        layerColors[1] = commonColor;
        layerColors[2] = commonColor;
    }



    for (let i = 0; i < 3; i++) {
        activePattern[i].weightValue = randomNumber(0, 80);
        activePattern[i].nodes = weightedNodes(activePattern[i].weightValue);
        activePattern[i].angleF = randomNumber(0, 359);
        activePattern[i].offset = randomNumber(0, 100);
        activePattern[i].fillStyle = layerColors[i];
        // activePattern[i].backgroundColor = randomColor()

    }
    // makePattern(activePattern);
}

function randomColor() {
    let color = {}
    color.h = randomNumber(0, 360);
    color.s = randomNumber(60, 100);
    color.l = randomNumber(20, 60);
    color.a = 1;

    return "hsla(" + color.h + "," + color.s + "%," + color.l + "%," + color.a + ")";
}

function changeColor(lastHSL, activeHSL, progress) {
}



const animationTime = 800;

function animatePattern() {

    animateStatus = true;

    //get current value of animation parameters

    let patternDiff = [
        {}, {}, {}
    ];

    for (let i = 0; i < 3; i++) {
        patternDiff[i].weightValue = activePattern[i].weightValue - lastPattern[i].weightValue;
        patternDiff[i].angleF = activePattern[i].angleF - lastPattern[i].angleF;
        patternDiff[i].offset = activePattern[i].offset - lastPattern[i].offset;
    }

    let transPattern = Object.assign({}, lastPattern);
    const fps = 30;
    const animationFrames = fps * animationTime / 1000;

    for (let i = 1; i < animationFrames; i++) {
        if (i == animationFrames - 1) { // last instance
            setTimeout(function () {
                /* for (let i = 0; i < 3; i++) {
                    transPattern[i].weightValue += patternDiff[i].weightValue / animationFrames;
                    transPattern[i].angleF += patternDiff[i].angleF / animationFrames;
                    transPattern[i].offset += patternDiff[i].offset / animationFrames;
                }*/
                animateStatus = false;
                makePattern(activePattern, true);
            }, i * 1000 / fps);
        }
        else {
            setTimeout(function (thisEase = easeMath(i/animationFrames), lastEase = easeMath((i-1)/animationFrames)) {
                for (let i = 0; i < 3; i++) {
                    // transPattern[i].weightValue += patternDiff[i].weightValue / animationFrames;
                    // transPattern[i].angleF += patternDiff[i].angleF / animationFrames;
                    // transPattern[i].offset += patternDiff[i].offset / animationFrames;
                    transPattern[i].weightValue += patternDiff[i].weightValue * thisEase - patternDiff[i].weightValue * lastEase;
                    transPattern[i].angleF += patternDiff[i].angleF * thisEase - patternDiff[i].angleF * lastEase;
                    transPattern[i].offset += patternDiff[i].offset * thisEase - patternDiff[i].offset * lastEase;
                    transPattern[i].nodes = weightedNodes(transPattern[i].weightValue);
                }
                makePattern(transPattern, false);
            }, i * 1000 / fps);
        }
    }
}




// ------SIDEBAR TAB SWITCHING------

function openPanel(evt, panelName) {

    //Declare all variables
    var i, panelContent, panelLinks;

    // Get all elements with class="tab__content" and hide them
    panelContent = document.getElementsByClassName("sidebar__panel");
    for (i = 0; i < panelContent.length; i++) {
        panelContent[i].style.display = "none";
    }

    // Get all elements with class="tab__button" and remove the class "active"
    panelLinks = document.getElementsByClassName("sidebar__item");
    for (i = 0; i < panelLinks.length; i++) {
        panelLinks[i].className = panelLinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(panelName).style.display = "block";
    evt.currentTarget.className += " active";

}

// close all panels

// var nodes = document.querySelectorAll('.sidebar__item.active');
// Array.from(nodes).forEach(function (node) {
//     node.addEventListener('click', function () {
//         closePanel()
//     })
// });

function closePanel() {

    //Declare all variables
    var i, panelContent, panelLinks;

    // Get all elements with class="tab__content" and hide them
    panelContent = document.getElementsByClassName("sidebar__panel");
    for (i = 0; i < panelContent.length; i++) {
        panelContent[i].style.display = "none";
    }

    // Get all elements with class="tab__button" and remove the class "active"
    panelLinks = document.getElementsByClassName("sidebar__item");
    for (i = 0; i < panelLinks.length; i++) {
        panelLinks[i].className = panelLinks[i].className.replace(" active", "");
    }
}

// ------SETTINGS TAB SWITCHING------

function openTab(evt, tabName) {

    //Declare all variables
    var i, tabContent, tabLinks;

    // Get all elements with class="tab__content" and hide them
    tabContent = document.getElementsByClassName("tab__content");
    for (i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
    }

    // Get all elements with class="tab__button" and remove the class "active"
    tabLinks = document.getElementsByClassName("tab__button");
    for (i = 0; i < tabLinks.length; i++) {
        tabLinks[i].className = tabLinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}





// ------SLIDER/INPUT EVENTS------

// Update the current slider values 
// Update activePattern obj
// (each time you drag the slider handle)
for (let i = 0; i < tabFields.length; i++) {

    // weight
    tabFields[i].weightRange.oninput = function () {
        tabFields[i].weightText.innerHTML = this.value;
        activePattern[i].weightValue = parseFloat(this.value);
        activePattern[i].nodes = weightedNodes(activePattern[i].weightValue);
    }
    tabFields[i].weightRange.addEventListener('input', function (e) {
        tabFields[i].weightText.value = e.target.value;
        activePattern[i].weightValue = parseFloat(e.target.value);
        activePattern[i].nodes = weightedNodes(activePattern[i].weightValue);

        if (animateStatus == false) {
            makePattern(activePattern);
        }
    });
    tabFields[i].weightText.addEventListener('input', function (e) {
        tabFields[i].weightRange.value = e.target.value;
        activePattern[i].weightValue = parseFloat(e.target.value);
        activePattern[i].nodes = weightedNodes(activePattern[i].weightValue);
        
        if (animateStatus == false) {
            makePattern(activePattern);
        }
    });

    // angle
    tabFields[i].angleRange.oninput = function () {
        tabFields[i].angleText.innerHTML = this.value;
        activePattern[i].angleF = parseFloat(this.value);
    }
    tabFields[i].angleRange.addEventListener('input', function (e) {
        tabFields[i].angleText.value = e.target.value;
        activePattern[i].angleF = parseFloat(e.target.value);
        
        if (animateStatus == false) {
            makePattern(activePattern);
        }
    });
    tabFields[i].angleText.addEventListener('input', function (e) {
        tabFields[i].angleRange.value = e.target.value;
        activePattern[i].angleF = parseFloat(e.target.value);
        
        if (animateStatus == false) {
            makePattern(activePattern);
        }
    });

    // offset
    tabFields[i].offsetRange.oninput = function () {
        tabFields[i].offsetText.innerHTML = this.value;
        activePattern[i].offset = parseFloat(this.value);
    }

    tabFields[i].offsetRange.addEventListener('input', function (e) {
        tabFields[i].offsetText.value = e.target.value;
        activePattern[i].offset = parseFloat(e.target.value);
        
        if (animateStatus == false) {
            makePattern(activePattern);
        }
    });
    tabFields[i].offsetText.addEventListener('input', function (e) {
        tabFields[i].offsetRange.value = e.target.value;
        activePattern[i].offset = parseFloat(e.target.value);
        
        if (animateStatus == false) {
            makePattern(activePattern);
        }
    });

}

function setFields(pattern) { // sets sliders/inputs based on activePattern values
    for (let i = 0; i < 3; i++) {
        tabFields[i].weightRange.value = pattern[i].weightValue;
        tabFields[i].weightText.innerHTML = Math.round(pattern[i].weightValue);
        tabFields[i].weightText.value = Math.round(pattern[i].weightValue);
        tabFields[i].angleRange.value = pattern[i].angleF;
        tabFields[i].angleText.innerHTML = Math.round(pattern[i].angleF);
        tabFields[i].angleText.value = Math.round(pattern[i].angleF);
        tabFields[i].offsetRange.value = pattern[i].offset;
        tabFields[i].offsetText.value = Math.round(pattern[i].offset);
        tabFields[i].offsetText.innerHTML = Math.round(pattern[i].offset);
    }
}



// ------ON RESIZE------

let cvsCentre = {};

function resizeCanvas() {
    let targetHeight = cvsContainer.clientHeight;
    let targetWidth = (targetHeight / 9) * 16;
    cvs.setAttribute("height", targetHeight);
    cvs.setAttribute("width", targetWidth);

    cvsCentre = { x: targetWidth / 2, y: targetHeight / 2 }
    makePattern(activePattern);
}
window.addEventListener("resize", resizeCanvas);




// ------ON LOAD------

window.addEventListener("load", function () {
    resizeCanvas();
    randomPattern();
    makePattern(activePattern, true);
});

let ctx = cvs.getContext("2d");
ctx.save();

let lastPattern = [];
let activePattern = [];

for (let i = 0; i < 3; i++) {
    activePattern[i] = Object.assign({}, fDefaultSettings);
}

let animateStatus = false;


// ------TOP LEFT BAR FUNCTIONALITY------

const randomizeButton = document.getElementById("topbar__button");

randomizeButton.addEventListener('click', function () {

    if (animateStatus == false) {
        randomPattern();
        animatePattern();
    }
});

// ------BUTTON EVENTS------

const randomPatternButton = document.getElementById('randomize');

randomPatternButton.addEventListener('click', function () {
    
    if (animateStatus == false) {
        randomPattern();
        animatePattern();
    }
});


// ------IMAGE EXPORT------

const pngButton = document.getElementById("export-png");
const svgButton = document.getElementById("export-svg");

pngButton.addEventListener('click', pngExport);

function pngExport() {
    // var canvas = document.getElementById("canvas");
    // var img = canvas.toDataURL("image/png");

    // document.write('<img src="'+img+'"/>');

    const link = document.createElement('a');
    link.download = 'fractal.png';
    link.href = canvas.toDataURL();
    link.click();
    link.delete;
}

// ------EXPORT TAB SWITCHING------


function openEtab(evt, tabName) {

    //Declare all variables
    var i, tabContent, tabLinks;

    // Get all elements with class="e-tab__content" and hide them
    tabContent = document.getElementsByClassName("e-tab__content");
    for (i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
    }

    // Get all elements with class="e-tab__button" and remove the class "active"
    tabLinks = document.getElementsByClassName("e-tab__button");
    for (i = 0; i < tabLinks.length; i++) {
        tabLinks[i].className = tabLinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// ------ZOOM IN/OUT FUNCTIONALITY------

let zoomInButton = document.getElementById("zoom-in");
let zoomOutButton = document.getElementById("zoom-out");

zoomInButton.addEventListener('click', zoomIn);
zoomOutButton.addEventListener('click', zoomOut);

function zoomIn() {
    fDefaultSettings.scale += 0.1;
    for (let i = 0; i < 3; i++) {
        activePattern[i].scale += 0.1;
    }
    makePattern(activePattern);
}

function zoomOut() {

    // if (fDefaultSettings.scale <= 0.15) {
    fDefaultSettings.scale -= 0.1;
    for (let i = 0; i < 3; i++) {
        activePattern[i].scale -= 0.1;
    }
    makePattern(activePattern);
    // }
}



// ------ANIMATE BETWEEN RANDOMIZED PATTERNS------
let autoplay = false;
let animateButton = document.getElementById("animate-button");
let autoplayInterval;

animateButton.addEventListener('click', function() {
    autoplay = !autoplay;

    if (autoplay) {
        autoplayInterval = setInterval(function() {
            randomPattern();
            animatePattern();
        },animationTime);
    }
    else {
        clearInterval(autoplayInterval);
    }

});