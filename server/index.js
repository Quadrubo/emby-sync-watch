function writeLog(text, type) {
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours()+':'+today.getMinutes()+':'+today.getSeconds();
    console.log(date + " " + time + " " + type + ": " + text);
}

var fsprom = require("fs").promises;
var fs = require("fs");

let pfxpath = __dirname + '/yourcert.pfx';
let passpath = __dirname + '/yourcertpassword.txt';

let options = {
    pfx: fs.readFileSync(pfxpath),
    passphrase: fs.readFileSync(passpath),
};

async function getPort() {
    var config_file = "./port.json";
    var WebSocketServerPort;

    if(fs.existsSync(config_file)){
        WebSocketServerPort = await fsprom.readFile(config_file, "utf8");
        WebSocketServerPort = JSON.parse(WebSocketServerPort)["port"];

        writeLog("Port set to " + WebSocketServerPort + " from file \"" + config_file + "\". You can change the port there.", "INFO")
    } else {
        jsondata = {
            "port": 8082
        }
        
        fs.writeFile(config_file, JSON.stringify(jsondata), function(err, result) {
            if(err) console.log("error", err);
        });
    
        WebSocketServerPort = 8082;

        writeLog("Port set to " + WebSocketServerPort + ". Config File \"" + config_file + "\" created. You can change the port there.", "INFO")
    }

    startServer(WebSocketServerPort);
}

function startServer(port) {
    //const WebSocketServerPort = 8082;
const WebSocketServer = require("websocket").server;
const WebSocketServerPort = port;
const http = require('https');

const server = http.createServer(options);
server.listen(WebSocketServerPort);
const wss = new WebSocketServer({
    httpServer: server 
});

writeLog("Server started. Listening on Port " + WebSocketServerPort + "...", "INFO");

var CLIENTS = [];
var id_counter = 0;

// wss is the Server
// ws is a single connection

wss.on("request", function(request) {
    const ws = request.accept(null, request.origin);

    CLIENTS.push([ws, id_counter]);

    writeLog("New Client connected. Client id: " + id_counter, "INFO");

    //SEND ID to CLient
    sending = {
        "command": "id",
        "id": id_counter,
        "sender": "server"
    }
    ws.send(JSON.stringify(sending));
    id_counter++;

    //On Message from Client with Data
    ws.on("message", function(e) {
        data = JSON.parse(e.utf8Data);
        
        writeLog(`Message received: ${JSON.stringify(data)}`, "INFO");

        if(data["command"] == "next"){
            // SEND NEXT TO ALL
            for (var i=0; i < CLIENTS.length; i++) {
                client = "";
                for(var j=0; j < CLIENTS.length; j++){
                    if(CLIENTS[j][0] == ws){
                        client = CLIENTS[j];
                        break;
                    }
                }
                sending = {
                    "command": "next",
                    "percentage": data["percentage"],
                    "sender": client[1]
                }
                writeLog("Sending JSON data to client " + CLIENTS[i][1] + ": " + JSON.stringify(sending), "INFO");
                CLIENTS[i][0].send(JSON.stringify(sending));
            }
        }
        if(data["command"] == "prev"){
            // SEND PREV TO ALL
            for (var i=0; i < CLIENTS.length; i++) {
                client = "";
                for(var j=0; j < CLIENTS.length; j++){
                    if(CLIENTS[j][0] == ws){
                        client = CLIENTS[j];
                        break;
                    }
                }
                sending = {
                    "command": "prev",
                    "percentage": data["percentage"],
                    "sender": client[1]
                }
                writeLog("Sending JSON data to client " + CLIENTS[i][1] + ": " + JSON.stringify(sending), "INFO");
                CLIENTS[i][0].send(JSON.stringify(sending));
            }
        }
        if(data["command"] == "pause"){
            // SEND PAUSE AND SKIP TO ALL
            for (var i=0; i < CLIENTS.length; i++) {
                client = "";
                for(var j=0; j < CLIENTS.length; j++){
                    if(CLIENTS[j][0] == ws){
                        client = CLIENTS[j];
                        break;
                    }
                }
                sending = {
                    "command": "pause",
                    "percentage": data["percentage"],
                    "sender": client[1]
                }
                writeLog("Sending JSON data to client " + CLIENTS[i][1] + ": " + JSON.stringify(sending), "INFO");
                CLIENTS[i][0].send(JSON.stringify(sending));
            }
        }
        if(data["command"] == "play"){
            // SEND PLAY AND SKIP TO ALL
            for (var i=0; i < CLIENTS.length; i++) {
                client = "";
                for(var j=0; j < CLIENTS.length; j++){
                    if(CLIENTS[j][0] == ws){
                        client = CLIENTS[j];
                        break;
                    }
                }
                sending = {
                    "command": "play",
                    "percentage": data["percentage"],
                    "sender": client[1]
                }
                writeLog("Sending JSON data to client " + CLIENTS[i][1] + ": " + JSON.stringify(sending), "INFO");
                CLIENTS[i][0].send(JSON.stringify(sending));
            }
        }
    });
    

    ws.on("close", () => {
        client = "";
        position = 0;
        var curr_id = 0;
        for(var i=0; i < CLIENTS.length; i++){
            if(CLIENTS[i][0] == ws){
                client = CLIENTS[i];
                curr_id = CLIENTS[i][1];
                position = i;
                break;
            }
        }
        CLIENTS.splice(position, 1);
        writeLog("Client with the id " + curr_id + " has disconnected. There are now " + CLIENTS.length + " clients on the room.", "INFO");
    });
});
}

getPort();