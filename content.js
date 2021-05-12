var id = "";

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

function setPos(tmp_id, percent) {
    console.log("Skipping to " + percent + "%.");

    var input_slider = document.getElementsByClassName("videoOsdPositionSlider")[0];

    percent = parseFloat(percent);

    input_slider.value = percent;

    input_slider.dispatchEvent(new Event('change'));

}

function pause(tmp_id) {
    var pause_button = document.getElementsByClassName("videoOsd-btnPause")[0];

    console.log("Pausing...");

    if(pause_button.getAttribute("title") == "Pause") {
        pause_button.click();
    }
}

function play(tmp_id) {
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

        ws.send("ready.");
    });

    // On Message receive from Server
    ws.addEventListener("message", msg => {
        console.log("Message received: \"" + msg.data + "\"");
        console.log("Our ID: " + id);

        if(msg.data.split("|")[2] != id) {
            if(msg.data.startsWith("id")){
                id = msg.data.split("|")[2];
                console.log("ID set to " + id);
            }
            
            if(msg.data.startsWith("pause")){
                // Pausing
                pause(msg.data.split("|")[2]);
                // Skipping to Position
                setPos(msg.data.split("|")[2], msg.data.split("|")[1]);
            }

            if(msg.data.startsWith("play")){
                // Playing
                setPos(msg.data.split("|")[2], msg.data.split("|")[1]);
                // Skipping to Position
                play(msg.data.split("|")[2]);
            }

            if(msg.data.startsWith("next")){
                // Next
                next();
            }

            if(msg.data.startsWith("prev")){
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
                sending = "play|" + percentage;
                console.log("SENDING \"" + sending + "\" to server!");
                ws.send(sending);
            } else if(play_button.getAttribute("title") == "Pause") {
                // Sending Play with percentage Server
                sending = "pause|" + percentage;
                console.log("SENDING \"" + sending + "\" to server!");
                ws.send(sending);
            }
        }
    });

    // On next_track button press
    document.getElementsByClassName("btnNextTrack")[0].addEventListener("click", function(e) {
        console.log(e);
        if(e.isTrusted) {
            sending = "next|0";
            ws.send(sending);
        }
    });

    // On previous_track button press
    document.getElementsByClassName("btnPreviousTrack")[0].addEventListener("click", function(e){
        console.log(e);
        if(e.isTrusted) {
            sending = "prev|0";
            ws.send(sending);
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
                sending = "pause|" + percentage;
                console.log("SENDING \"" + sending + "\" to server!");
                ws.send(sending);
            } else if(play_button.getAttribute("title") == "Pause") {
                // Sending Play with percentage Server
                sending = "play|" + percentage;
                console.log("SENDING \"" + sending + "\" to server!");
                ws.send(sending);
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
                sending = "pause|" + percentage;
                console.log("SENDING \"" + sending + "\" to server!");
                ws.send(sending);
            } else if(play_button.getAttribute("title") == "Pause") {
                // Sending Play with percentage Server
                sending = "play|" + percentage;
                console.log("SENDING \"" + sending + "\" to server!");
                ws.send(sending);
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
                sending = "pause|" + percentage;
                console.log("SENDING \"" + sending + "\" to server!");
                ws.send(sending);
            } else if(play_button.getAttribute("title") == "Pause") {
                // Sending Play with percentage Server
                sending = "play|" + percentage;
                console.log("SENDING \"" + sending + "\" to server!");
                ws.send(sending);
            }
        }
    });

}

get_storage();