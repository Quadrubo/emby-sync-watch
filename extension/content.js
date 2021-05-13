var id = "";
var message = "";

async function get_storage() {
    var sp = new Promise(function(resolve, reject) {
        chrome.storage.sync.get(["server"], function(options) {
            resolve(options.server);
        });
    });

    var pp = new Promise(function(resolve, reject) {
        chrome.storage.sync.get(["port"], function(options) {
            resolve(options.port);
        });
    });

    const serverp = await sp;
    const portp = await pp;

    connectToServer(serverp, portp);
}

function setPos(percent) {
    console.log("Skipping to " + percent + "%.");

    var input_slider = document.getElementsByClassName("videoOsdPositionSlider")[0];

    percent = parseFloat(percent);

    input_slider.value = percent;

    input_slider.dispatchEvent(new Event('change'));

}

function pause() {
    var pause_button = document.getElementsByClassName("videoOsd-btnPause")[0];

    console.log("Pausing...");

    if(pause_button.getAttribute("title") == "Pause") {
        pause_button.click();
    }
}

function play() {
    var pause_button = document.getElementsByClassName("videoOsd-btnPause")[0];

    
    if(pause_button.getAttribute("title") == "Play") {
        pause_button.click();
    }
}

function prev() {
    document.getElementsByClassName("btnPreviousTrack")[0].click();
}

function next() {
    document.getElementsByClassName("btnNextTrack")[0].click();
}

function connectToServer(server_tmp, port_tmp) {
    var ws_connection_url = "ws://" + server_tmp + ":" + port_tmp;
    const ws = new WebSocket(ws_connection_url);

    // On opened connection
    ws.addEventListener("open", () => {
        window.alert("Connected to Websocket Server \"" + ws_connection_url + "\".");

        ws.send(JSON.stringify({
            "command": "ready"
        })); 
        
    });

    // On Message receive from Server
    ws.addEventListener("message", function(e) {

        console.log(e.data);
        data = JSON.parse(e.data);
        
        console.log(`Message received: ${data}`);
        console.log("Our ID: " + id);

        if(data["sender"] != id) {
            if(data["command"] == "id"){
                id = data["id"];
                console.log("ID set to " + id);
            }
            
            if(data["command"] == "pause"){
                // Pausing
                pause();
                // Skipping to Position
                setPos(data["percentage"]);
            }

            if(data["command"] == "play"){
                // Playing
                setPos(data["percentage"]);
                // Skipping to Position
                play();
            }

            if(data["command"] == "next"){
                // Next
                next();
            }

            if(data["command"] == "prev"){
                // Prev
                prev();
            }
        } else {
            console.log("Own request. Ignoring!");
        }
          
    });

    ws.addEventListener("close", () => {
        window.alert("Connection closed.");
    });

    // On play_pause button press
    document.getElementsByClassName("videoOsd-btnPause")[0].addEventListener("click", function(e) {
        console.log(e);
        if(e.isTrusted){
            // Human input, sending to other people
            var percentage = document.getElementsByClassName("emby-slider-background-lower")[0].getAttribute("style");
            percentage = percentage.split(":")[1].split("%")[0];

            var play_button = document.getElementsByClassName("videoOsd-btnPause")[0];
            if(play_button.getAttribute("title") == "Play") {
                // Sending Play with percentage Server
                sending = {
                    "command": "play",
                    "percentage": percentage
                }
                console.log("SENDING \"" + sending + "\" to server!");
                ws.send(JSON.stringify(sending)); 
            } else if(play_button.getAttribute("title") == "Pause") {
                // Sending Play with percentage Server
                sending = {
                    "command": "pause",
                    "percentage": percentage
                }
                console.log("SENDING \"" + sending + "\" to server!");
                ws.send(JSON.stringify(sending)); 
            }
        }
    });

    
    document.getElementsByClassName("view flex page")[1].addEventListener("click", function(e) {
        if(e.isTrusted){
            if(e.target.className == "view flex page"){
                console.log(e); 
                // Human input, sending to other people
                var percentage = document.getElementsByClassName("emby-slider-background-lower")[0].getAttribute("style");
                percentage = percentage.split(":")[1].split("%")[0];

                var play_button = document.getElementsByClassName("videoOsd-btnPause")[0];
                if(play_button.getAttribute("title") == "Play") {
                    // Sending Play with percentage Server
                    sending = {
                        "command": "play",
                        "percentage": percentage
                    }
                    console.log("SENDING \"" + sending + "\" to server!");
                    ws.send(JSON.stringify(sending)); 
                } else if(play_button.getAttribute("title") == "Pause") {
                    // Sending Play with percentage Server
                    sending = {
                        "command": "pause",
                        "percentage": percentage
                    }
                    console.log("SENDING \"" + sending + "\" to server!");
                    ws.send(JSON.stringify(sending)); 
                }
            }
        }
    })

    // On next_track button press
    document.getElementsByClassName("btnNextTrack")[0].addEventListener("click", function(e) {
        console.log(e);
        if(e.isTrusted) {
            sending = {
                "command": "next",
                "percentage": 0
            }
            ws.send(JSON.stringify(sending));
        }
    });

    // On previous_track button press
    document.getElementsByClassName("btnPreviousTrack")[0].addEventListener("click", function(e){
        console.log(e);
        if(e.isTrusted) {
            sending = {
                "command": "prev",
                "percentage": 0
            }
            ws.send(JSON.stringify(sending));
        }
    });

    // On 10_backward button press
    document.getElementsByClassName("btnRewind")[0].addEventListener("click", function(e) {
        console.log(e);
        if(e.isTrusted) {
            var time_left = document.getElementsByClassName("videoOsdPositionText")[0].textContent.split(":");
            var time_right = document.getElementsByClassName("videoOsdDurationText")[0].textContent.split(":");

            if(time_left.length == 2){
                time_left = (parseInt(time_left[0]) * 60) + parseInt(time_left[1]);
            } else if(time_left.length == 3) {
                time_left = (parseInt(time_left[0]) * 3600) + (parseInt(time_left[1]) * 60) + parseInt(time_left[2]);
            }

            if(time_right.length == 2){
                time_right = (parseInt(time_right[0]) * 60) + parseInt(time_right[1]);
            } else if(time_right.length == 3) {
                time_right = (parseInt(time_right[0]) * 3600) + (parseInt(time_right[1]) * 60) + parseInt(time_right[2]);
            }

            var percentage = (((time_left - 10) / (time_right + time_left)) * 100).toFixed(2);

            var play_button = document.getElementsByClassName("videoOsd-btnPause")[0];
            if(play_button.getAttribute("title") == "Play") {
                // Sending Pause with percentage Server
                sending = {
                    "command": "pause",
                    "percentage": percentage
                }
                console.log("SENDING \"" + sending + "\" to server!");
                ws.send(JSON.stringify(sending));
            } else if(play_button.getAttribute("title") == "Pause") {
                // Sending Play with percentage Server
                sending = {
                    "command": "play",
                    "percentage": percentage
                }
                console.log("SENDING \"" + sending + "\" to server!");
                ws.send(JSON.stringify(sending));
            }
        }
    });

    // On 10_forward button press
    document.getElementsByClassName("btnOsdFastForward")[0].addEventListener("click", function(e) {
        console.log(e);
        if(e.isTrusted) {
            var time_left = document.getElementsByClassName("videoOsdPositionText")[0].textContent.split(":");
            var time_right = document.getElementsByClassName("videoOsdDurationText")[0].textContent.split(":");

            if(time_left.length == 2){
                time_left = (parseInt(time_left[0]) * 60) + parseInt(time_left[1]);
            } else if(time_left.length == 3) {
                time_left = (parseInt(time_left[0]) * 3600) + (parseInt(time_left[1]) * 60) + parseInt(time_left[2]);
            }

            if(time_right.length == 2){
                time_right = (parseInt(time_right[0]) * 60) + parseInt(time_right[1]);
            } else if(time_right.length == 3) {
                time_right = (parseInt(time_right[0]) * 3600) + (parseInt(time_right[1]) * 60) + parseInt(time_right[2]);
            }

            var percentage = (((time_left + 10) / (time_right + time_left)) * 100).toFixed(2);

            var play_button = document.getElementsByClassName("videoOsd-btnPause")[0];
            if(play_button.getAttribute("title") == "Play") {
                // Sending Pause with percentage Server
                sending = {
                    "command": "pause",
                    "percentage": percentage
                }
                console.log("SENDING \"" + sending + "\" to server!");
                ws.send(JSON.stringify(sending));
            } else if(play_button.getAttribute("title") == "Pause") {
                // Sending Play with percentage Server
                sending = {
                    "command": "play",
                    "percentage": percentage
                }
                console.log("SENDING \"" + sending + "\" to server!");
                ws.send(JSON.stringify(sending));
            }
        }
    });

    // On slider change
    document.getElementsByClassName("videoOsdPositionSlider emby-slider")[0].addEventListener("click", function(e) {
        console.log(e);
        if(e.isTrusted){
            var percentage = document.getElementsByClassName("emby-slider-background-lower")[0].getAttribute("style");
            percentage = percentage.split(":")[1].split("%")[0];

            var play_button = document.getElementsByClassName("videoOsd-btnPause")[0];
            if(play_button.getAttribute("title") == "Play") {
                // Sending Pause with percentage Server
                sending = {
                    "command": "pause",
                    "percentage": percentage
                }
                console.log("SENDING \"" + sending + "\" to server!");
                ws.send(JSON.stringify(sending));
            } else if(play_button.getAttribute("title") == "Pause") {
                // Sending Play with percentage Server
                sending = {
                    "command": "play",
                    "percentage": percentage
                }
                console.log("SENDING \"" + sending + "\" to server!");
                ws.send(JSON.stringify(sending));
            }
        }
    });

}

get_storage();