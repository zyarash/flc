/**************************************************************
 * index.js
 **************************************************************/



// Global vars
let USERNAME = "";
let SPOTIFY_AUTH = false;
let SOUNDCLOUD_AUTH = false;



// General helper functions & common stuff used throughout this file
function getRandInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function isMobileDevice() {
    return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
}



// Application specific helper functions
function speechBubbleSequence(text, callback) {
    setTimeout(() => {
        $("#speech-bubble-container").show("scale", 300);
        $("#bunny-container").effect("bounce", {distance:20, times:2}, 300);
        animateText($("#speech-bubble"), text, 15, callback);
    }, 1000);
}

function speechBubbleResolve(resolve) {
    $("input").off();
    $("button").off();
    setTimeout(() => { 
        $("#speech-bubble > *").remove();
        $("#speech-bubble-container").hide("scale", 300);
        resolve();
    }, 150);
}


function animateText(target, text, speed, callback=null) {
    let i = 0;
    let tagStack = [target];
    let interval = setInterval(() => {
        if (i < text.length) {
            let curTag = tagStack[tagStack.length - 1];
            // HTML parsing...Gross
            if (text[i] == "<") {
                // If we have a closing tag just consume and discard it
                if (text[i+1] == "/") {
                    tagStack.pop();
                    while (text[i] != ">") { i++; }
                }
                // Else we have a new open tag
                else {
                    let newTagName = "";
                    while (text[i] != ">") {
                        newTagName += text[i];
                        i++;
                    }
                    newTagName += ">";
                    let newTag = $(newTagName);
                    tagStack.push(newTag);
                    curTag.append(newTag);
                }
            }
            else {
                curTag.append(text[i]);
            }
            i++;
        }
        else {
            clearInterval(interval);
            if (callback) { callback(); }
        }
    }, speed);
}


function authorizeSpotify() {
    let authorized = false;
    window.open("https://accounts.spotify.com/authorize?client_id=69124dddff7c48e9816a93cab0bbd4d9&redirect_uri=http:%2F%2F192.168.87.29:8004%2Fspotify&scope=user-read-private&response_type=token");
    //window.open("https://accounts.spotify.com/authorize?client_id=69124dddff7c48e9816a93cab0bbd4d9&redirect_uri=http:%2F%2Flocalhost:8004%2Fspotify%2Fsuccess&scope=user-read-private&response_type=token");
}


function authorizeSoundcloud() {
    SC.connect().then(function() {
        return SC.get('/me');
    }).then(function(me) {
        alert('Hello, ' + me.username);
    });
}



// Syncronous function queue code
let FUNCTION_QUEUE = [];
let p = null;
setInterval(() => {
    if (!p && FUNCTION_QUEUE.length) { 
        p = FUNCTION_QUEUE[0]();
        p.then(() => { FUNCTION_QUEUE.shift(); p = null; });
    }
}, 0);



// Main program code
function runProgram() {
    FUNCTION_QUEUE.push(loadAssets);
    FUNCTION_QUEUE.push(destroyLoadingScreen);
    FUNCTION_QUEUE.push(introAnimation);
    FUNCTION_QUEUE.push(enterUsername);
    //FUNCTION_QUEUE.push(connectSpotify);
    //FUNCTION_QUEUE.push(connectSoundcloud);
}


function loadAssets() {
    return new Promise((resolve, reject) => {
        let t = 2000;
        setTimeout(() => {
            SC.initialize({
              client_id: "05cdae6185e95e6a3b1b064d76d7e6e2",
              redirect_uri: "http://192.168.87.29:8004/soundcloud",
            });
            resolve();
        }, t);
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
        let text = `<p>Hello! My name is <span class="STEVE">STEVE</span> and I'm here \
to help you get your 2021 festival lineup together! Ready to get started?</p>`;

        speechBubbleSequence(text, () => {
            $("#speech-bubble").append("<div id='button-container'/>");
            $("#button-container").append("<button id='OK' class='scale' enabled><span>OK</span></div>");

            $(".scale").show("scale", 300);

            $("#OK").on("click", () => { speechBubbleResolve(resolve); });
        });
    });
}


function enterUsername() {
    return new Promise((resolve, reject) => {
        let text = `<p>Let's start by entering your name:</p>`;

        speechBubbleSequence(text, () => {
            $("#speech-bubble").append("<div id='input-container'/>");
            $("#input-container").append("<input class='scale' maxlength='25'/>");
            $("#input-container").append("<button id='OK' class='scale' disabled><span>OK</span></div>");

            $(".scale").show("scale", 300);

            $("input").on("input", () => {
                if ($("input").val().length >= 1) {
                    $("#OK").prop("disabled", false);
                }
                else {
                    $("#OK").prop("disabled", true);
                }
            });

            $("#OK").on("click", () => {
                if (!$("#OK").prop("disabled")) {
                    USERNAME = $("input").val();
                    speechBubbleResolve(resolve);
                }
            });
        });
    });
}


function connectSpotify() {
    return new Promise((resolve, reject) => {
        let text = `<p>Let's start by connecting to your Spotify account. Feel free to skip \
this step if you'd like.</p>`;

        speechBubbleSequence(text, () => {
            $("#speech-bubble").append("<div id='button-container'/>");
            $("#button-container").append("<div id='SPOTIFY' class='spotify scale'></div>");
            $("#button-container").append("<div id='SKIP' class='scale'><span>Skip</span></div>");
            $(".scale").show("scale", 300);
    
            $("#SPOTIFY").on("click", () => { authorizeSpotify(); });

            $("#SKIP").on("click", () => {
                $(".button").off();
                setTimeout(() => { 
                    $("#speech-bubble > *").remove();
                    $("#speech-bubble-container").hide("scale", 300);
                    resolve();
                }, 150);
            });
        });
    });
}


function connectSoundcloud() {
    return new Promise((resolve, reject) => {
        let text = `<p>Next let's connect to your Soundcloud account. Feel free to skip this \
step if you'd like.</p>`;

        speechBubbleSequence(text, () => {
            $("#speech-bubble").append("<div id='button-container'/>");
            $("#button-container").append("<div id='SOUNDCLOUD' class='button soundcloud'></div>");
            $("#button-container").append("<div id='SKIP' class='button'><span>Skip</span></div>");

            $("#SOUNDCLOUD").on("click", () => { authorizeSoundcloud(); });

            $("#SKIP").on("click", () => {
                $(".button").off();
                setTimeout(() => { 
                    $("#speech-bubble > *").remove();
                    $("#speech-bubble-container").hide("scale", 300);
                    resolve();
                }, 150);
           });
           $(".button").show("scale", 300);
        });
    });                                                                                               
}


runProgram();
