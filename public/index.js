/**************************************************************
 * index.js
 **************************************************************/


// Helper functions & common stuff used throughout this file
function getRandInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function isMobileDevice() {
    return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
}


let FUNCTION_QUEUE = [];


let p = null;
setInterval(() => {
    if (!p && FUNCTION_QUEUE.length) { 
        p = FUNCTION_QUEUE[0]();
        p.then(() => { FUNCTION_QUEUE.shift(); p = null; });
    }
}, 0);


function runProgram() {
    FUNCTION_QUEUE.push(loadAssets);
    FUNCTION_QUEUE.push(destroyLoadingScreen);
    FUNCTION_QUEUE.push(introAnimation);
}


function loadAssets() {
    return new Promise((resolve, reject) => {
        let t = 2000;
        setTimeout(() => { resolve(); }, t);
    });
}

function destroyLoadingScreen() {
    return new Promise((resolve, reject) => {
        let t = 1500;
        $("#loading-screen").fadeOut(t);
        setTimeout(() => {
            $("#loading-screen").remove();
            resolve();
        }, t);
    });
}

function introAnimation() {
    return new Promise((resolve, reject) => {
        let t = 1500;
        $("#speech-bubble").html(`
            <p>Hello! My name is <span class="STEVE">STEVE </span> and I'm here to
            help you get your 2021 festival lineup together! Ready to get started?</p>
            <div id="OK" class="button">OK!</div>`);

        setTimeout(() => {
            $("#speech-bubble-container").show("scale", 300);
            $("#bunny-container").effect("bounce", {distance:20, times:2}, 400);
            $("OK").on("click", () => {
            });
            resolve();
        }, t);
    });
}

runProgram();
