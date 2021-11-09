var id = "";
var message = "";
/* Arabic, Belarusian, Bulgarian, Catalan, Chinese Simplified, Chinese Traditional, Chinese Traditional (Hong Kong), Croatian, Czech,
* Danish, Dutch, English (UK), English (US), Estonian, Finnish, French, French (Canada), German, Greek, Hindi (India), Hungarian,
* Indonesian, Italian, Japanese, Kazakh, Korean, Lithuanian, Malay, Norwegian, Persian, Polish, Portuguese (Brazil), Portuguese (Portugal),
* Romanian, Russian, Slovak, Slovenian (Slovenia), Spanish, Spanish (Latin America), Spanish (Mexico), Spanish (United States), Swedish,
* Swiss German, Turkish, Ukrainian, Vietnamnese
*/
var button_play_array = ["تشغيل", "Play", "Изпълняване", "Reprodueix", "播放", "播放", "播放", "Pokreni", "Pokreni",
"Afspil", "Afspelen", "Play", "Play", "Esita", "Toista", "Lire", "Lire", "Abspielen", "Αναπαραγωγή", "נגן", "Play", "Lejátszás",
"Play", "Riproduci", "Play", "Ойнату", "재생", "Leisti", "Play", "Spill", "Play", "Odtwarzaj", "Reproduzir", "Reproduzir",
"Play", "Смотреть", "Prehrať", "Play", "Reproducir", "Play", "Reproducir", "Play", "Spela",
"Play", "Oynat", "Відтворити", ""];
var button_pause_array = ["إيقاف مؤقت", "Pause", "Пауза", "Pause", "暂停", "暫停", "Pause", "Pause", "Pause",
"Pause", "Pauze", "Pause", "Pause", "Paus", "Pysäytä", "Pause", "Pause", "Pause", "Παύση", "Pause", "Pause", "Szünet",
"Pause", "Pause", "Pause", "Pause", "일시정지", "Pause", "Pause", "Pause", "Pause", "Wstrzymaj", "Pausar", "Pause", 
"Pause", "Пауза", "Pozastaviť", "Pause", "Pausa", "Pause", "Pausa", "Pause", "Pausa",
"Pause", "Pause", "Пауза", ""];

function writeLog(text, type) {
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours()+':'+today.getMinutes()+':'+today.getSeconds();
    console.log(date + " " + time + " " + type + ": " + text);
}

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
    writeLog("Skipping to " + percent + "%.", "INFO");

    var input_slider = document.getElementsByClassName("videoOsdPositionSlider")[0];

    percent = parseFloat(percent);

    input_slider.value = percent;

    input_slider.dispatchEvent(new Event('change'));

}

function pause() {
    var pause_button = document.getElementsByClassName("videoOsd-btnPause")[0];

    writeLog("Pausing.", "INFO");

    if(button_pause_array.includes(pause_button.getAttribute("title"))){
        pause_button.click();
    }
}

function play() {
    var pause_button = document.getElementsByClassName("videoOsd-btnPause")[0];

    
    if(button_play_array.includes(pause_button.getAttribute("title"))){
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
    var ws_connection_url = "wss://" + server_tmp + ":" + port_tmp;
    var ws = new WebSocket(ws_connection_url);
    
    // On opened connection
    ws.addEventListener("open", () => {
        window.alert("Connected to Websocket Server \"" + ws_connection_url + "\".");

        ws.send(JSON.stringify({
            "command": "ready"
        })); 
        
    });

    // On Message receive from Server
    ws.addEventListener("message", function(e) {

        data = JSON.parse(e.data);

        writeLog(`Message received: ${JSON.stringify(data)}`, "INFO");
        
        if(data["sender"] != id) {
            if(data["command"] == "id"){
                id = data["id"];
                writeLog("ID set to " + id, "INFO");
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
            writeLog("This is our own request. Ignoring it.", "INFO");
        }
          
    });

    ws.addEventListener("close", function(e) {
        window.alert("Connection closed.");
        ws = undefined;
    });

    // On play_pause button press
    document.getElementsByClassName("videoOsd-btnPause")[0].addEventListener("click", function(e) {
        if(ws == undefined) {
            return;
        }
        if(e.isTrusted){
            // Human input, sending to other people
            var percentage = document.getElementsByClassName("emby-slider-background-lower")[0].getAttribute("style");
            percentage = percentage.split(":")[1].split("%")[0];

            var play_button = document.getElementsByClassName("videoOsd-btnPause")[0];
            if(button_play_array.includes(play_button.getAttribute("title"))){
                // Sending Play with percentage Server
                sending = {
                    "command": "play",
                    "percentage": percentage
                }
                writeLog("Sending JSON data to server: " + JSON.stringify(sending), "INFO");
                ws.send(JSON.stringify(sending)); 
            }else if(button_pause_array.includes(play_button.getAttribute("title"))){
                // Sending Play with percentage Server
                sending = {
                    "command": "pause",
                    "percentage": percentage
                }
                writeLog("Sending JSON data to server: " + JSON.stringify(sending), "INFO");
                ws.send(JSON.stringify(sending)); 
            }
        }
    });

    var page = document.getElementsByClassName("view flex page");
    for(var i = 0; i < page.length; i++){
        if (page[i].getAttribute("data-properties") == "fullscreen"){
            page[i].addEventListener("click", function(e) {
                if(ws == undefined) {
                    return;
                }
                if(e.isTrusted){
                    if(e.target.className == "view flex page"){
                        if(e.target.getAttribute)
                        // Human input, sending to other people
                        var percentage = document.getElementsByClassName("emby-slider-background-lower")[0].getAttribute("style");
                        percentage = percentage.split(":")[1].split("%")[0];
        
                        var play_button = document.getElementsByClassName("videoOsd-btnPause")[0];
                        if(button_play_array.includes(play_button.getAttribute("title"))){
                            // Sending Play with percentage Server
                            sending = {
                                "command": "play",
                                "percentage": percentage
                            }
                            writeLog("Sending JSON data to server: " + JSON.stringify(sending), "INFO");
                            ws.send(JSON.stringify(sending)); 
                        }else if(button_pause_array.includes(play_button.getAttribute("title"))){
                            // Sending Play with percentage Server
                            sending = {
                                "command": "pause",
                                "percentage": percentage
                            }
                            writeLog("Sending JSON data to server: " + JSON.stringify(sending), "INFO");
                            ws.send(JSON.stringify(sending)); 
                        }
                    }
                }
            });
            break;
        }
    }

    // On next_track button press
    document.getElementsByClassName("btnNextTrack")[0].addEventListener("click", function(e) {
        if(ws == undefined) {
            return;
        }
        if(e.isTrusted) {
            sending = {
                "command": "next",
                "percentage": 0
            }
            writeLog("Sending JSON data to server: " + JSON.stringify(sending), "INFO");
            ws.send(JSON.stringify(sending));
        }
    });

    // On previous_track button press
    document.getElementsByClassName("btnPreviousTrack")[0].addEventListener("click", function(e){
        if(ws == undefined) {
            return;
        }
        if(e.isTrusted) {
            sending = {
                "command": "prev",
                "percentage": 0
            }
            writeLog("Sending JSON data to server: " + JSON.stringify(sending), "INFO");
            ws.send(JSON.stringify(sending));
        }
    });

    // On 10_backward button press
    document.getElementsByClassName("btnRewind")[0].addEventListener("click", function(e) {
        if(e.isTrusted) {
            if(ws == undefined) {
                return;
            }
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
            if(button_play_array.includes(play_button.getAttribute("title"))){
                // Sending Pause with percentage Server
                sending = {
                    "command": "pause",
                    "percentage": percentage
                }
                writeLog("Sending JSON data to server: " + JSON.stringify(sending), "INFO");
                ws.send(JSON.stringify(sending));
            }else if(button_pause_array.includes(play_button.getAttribute("title"))){
                // Sending Play with percentage Server
                sending = {
                    "command": "play",
                    "percentage": percentage
                }
                writeLog("Sending JSON data to server: " + JSON.stringify(sending), "INFO");
                ws.send(JSON.stringify(sending));
            }
        }
    });

    // On 10_forward button press
    document.getElementsByClassName("btnOsdFastForward")[0].addEventListener("click", function(e) {
        if(ws == undefined) {
            return;
        }
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
            if(button_play_array.includes(play_button.getAttribute("title"))){
                // Sending Pause with percentage Server
                sending = {
                    "command": "pause",
                    "percentage": percentage
                }
                writeLog("Sending JSON data to server: " + JSON.stringify(sending), "INFO");
                ws.send(JSON.stringify(sending));
            }else if(button_pause_array.includes(play_button.getAttribute("title"))){
                // Sending Play with percentage Server
                sending = {
                    "command": "play",
                    "percentage": percentage
                }
                writeLog("Sending JSON data to server: " + JSON.stringify(sending), "INFO");
                ws.send(JSON.stringify(sending));
            }
        }
    });

    // On slider change
    document.getElementsByClassName("videoOsdPositionSlider emby-slider")[0].addEventListener("click", function(e) {
        if(ws == undefined) {
            return;
        }
        if(e.isTrusted){
            var percentage = document.getElementsByClassName("emby-slider-background-lower")[0].getAttribute("style");
            percentage = percentage.split(":")[1].split("%")[0];

            var play_button = document.getElementsByClassName("videoOsd-btnPause")[0];
            if(button_play_array.includes(play_button.getAttribute("title"))){
                // Sending Pause with percentage Server
                sending = {
                    "command": "pause",
                    "percentage": percentage
                }
                writeLog("Sending JSON data to server: " + JSON.stringify(sending), "INFO");
                ws.send(JSON.stringify(sending));
            }else if(button_pause_array.includes(play_button.getAttribute("title"))){
                // Sending Play with percentage Server
                sending = {
                    "command": "play",
                    "percentage": percentage
                }
                writeLog("Sending JSON data to server: " + JSON.stringify(sending), "INFO");
                ws.send(JSON.stringify(sending));
            }
        }
    });

}

get_storage();