const WebSocketServerPort = 8082;
const WebSocketServer = require("websocket").server;
const http = require('http');

const server = http.createServer();
server.listen(WebSocketServerPort);
const wss = new WebSocketServer({
    httpServer: server 
});

var CLIENTS = [];
var id_counter = 0;

// wss is the Server
// ws is a single connection

wss.on("request", function(request) {
    const ws = request.accept(null, request.origin);

    CLIENTS.push([ws, id_counter]);

    console.log("New client connected!");

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
        console.log(e.utf8Data);
        data = JSON.parse(e.utf8Data);
        
        console.log(`Message received: ${data}`);

        if(data["command"] == "next"){
            // SEND NEXT TO ALL
            for (var i=0; i < CLIENTS.length; i++) {
                console.log(i);
                console.log("SENDING next with percentage " + data["percentage"] + " to client!");
                client = "";
                for(var j=0; j < CLIENTS.length; j++){
                    if(CLIENTS[j][0] == ws){
                        console.log(CLIENTS[j][1]);
                        client = CLIENTS[j];
                        break;
                    }
                }
                sending = {
                    "command": "next",
                    "percentage": data["percentage"],
                    "sender": client[1]
                }
                CLIENTS[i][0].send(JSON.stringify(sending));
            }
        }
        if(data["command"] == "prev"){
            // SEND PREV TO ALL
            for (var i=0; i < CLIENTS.length; i++) {
                console.log(i);
                console.log("SENDING prev with percentage " + data["percentage"] + " to client!");
                client = "";
                for(var j=0; j < CLIENTS.length; j++){
                    if(CLIENTS[j][0] == ws){
                        console.log(CLIENTS[j][1]);
                        client = CLIENTS[j];
                        break;
                    }
                }
                sending = {
                    "command": "prev",
                    "percentage": data["percentage"],
                    "sender": client[1]
                }
                CLIENTS[i][0].send(JSON.stringify(sending));
            }
        }
        if(data["command"] == "pause"){
            // SEND PAUSE AND SKIP TO ALL
            for (var i=0; i < CLIENTS.length; i++) {
                console.log(i);
                console.log("SENDING pause with percentage " + data["percentage"] + " to client!");
                client = "";
                for(var j=0; j < CLIENTS.length; j++){
                    if(CLIENTS[j][0] == ws){
                        console.log(CLIENTS[j][1]);
                        client = CLIENTS[j];
                        break;
                    }
                }
                sending = {
                    "command": "pause",
                    "percentage": data["percentage"],
                    "sender": client[1]
                }
                CLIENTS[i][0].send(JSON.stringify(sending));
            }
        }
        if(data["command"] == "play"){
            // SEND PLAY AND SKIP TO ALL
            console.log("Length of Clients: " + CLIENTS.length);
            for (var i=0; i < CLIENTS.length; i++) {
                console.log("Looping sending, current id: " + i);
                console.log("SENDING play with percentage " + data["percentage"] + " to client!");
                client = "";
                for(var j=0; j < CLIENTS.length; j++){
                    if(CLIENTS[j][0] == ws){
                        console.log(CLIENTS[j][1]);
                        client = CLIENTS[j];
                        break;
                    }
                }
                sending = {
                    "command": "play",
                    "percentage": data["percentage"],
                    "sender": client[1]
                }
                CLIENTS[i][0].send(JSON.stringify(sending));
            }
        }
    });
    

    ws.on("close", () => {
        console.log("Length of CLIENTS before disconnect: " + CLIENTS.length);
        client = "";
        position = 0;
        for(var i=0; i < CLIENTS.length; i++){
            if(CLIENTS[i][0] == ws){
                console.log(CLIENTS[i][1]);
                client = CLIENTS[i];
                position = i;
                break;
            }
        }
        CLIENTS.splice(position, 1);
        console.log("Client has disconnected!");
        console.log("Length of CLIENTS after disconnect: " + CLIENTS.length);
    });
});
