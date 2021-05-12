const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8082 });
var CLIENTS = [];
var id_counter = 0;

// wss is the Server
// ws is a single connection

wss.on("connection", function(ws) {
    CLIENTS.push([ws, id_counter]);

    console.log("New client connected!");

    //SEND ID to CLient
    //ws.send("id|id|" + CLIENTS.indexOf(ws));
    ws.send("id|id|" + id_counter);
    id_counter++;

    //On Message from Client with Data
    ws.on("message", data => {
        console.log(`Client has sent us: ${data}`);

        if(data.split("|")[0] == "next"){
            // SEND NEXT TO ALL
            for (var i=0; i < CLIENTS.length; i++) {
                console.log(i);
                console.log("SENDING next with percentage " + data.split("|")[1] + " to client!");
                client = "";
                for(var j=0; j < CLIENTS.length; j++){
                    if(CLIENTS[j][0] == ws){
                        console.log(CLIENTS[j][1]);
                        client = CLIENTS[j];
                        break;
                    }
                }
                CLIENTS[i][0].send("next|" + data.split("|")[1] + "|" + client[1]);
            }
        }
        if(data.split("|")[0] == "prev"){
            // SEND PREV TO ALL
            for (var i=0; i < CLIENTS.length; i++) {
                console.log(i);
                console.log("SENDING prev with percentage " + data.split("|")[1] + " to client!");
                client = "";
                for(var j=0; j < CLIENTS.length; j++){
                    if(CLIENTS[j][0] == ws){
                        console.log(CLIENTS[j][1]);
                        client = CLIENTS[j];
                        break;
                    }
                }
                CLIENTS[i][0].send("prev|" + data.split("|")[1] + "|" + client[1]);
            }
        }
        if(data.split("|")[0] == "pause"){
            // SEND PAUSE AND SKIP TO ALL
            for (var i=0; i < CLIENTS.length; i++) {
                console.log(i);
                console.log("SENDING pause with percentage " + data.split("|")[1] + " to client!");
                client = "";
                for(var j=0; j < CLIENTS.length; j++){
                    if(CLIENTS[j][0] == ws){
                        console.log(CLIENTS[j][1]);
                        client = CLIENTS[j];
                        break;
                    }
                }
                CLIENTS[i][0].send("pause|" + data.split("|")[1] + "|" + client[1]);
            }
        }
        if(data.split("|")[0] == "play"){
            // SEND PLAY AND SKIP TO ALL
            console.log("Length of Clients: " + CLIENTS.length);
            for (var i=0; i < CLIENTS.length; i++) {
                console.log("Looping sending, current id: " + i);
                console.log("SENDING play with percentage " + data.split("|")[1] + " to client!");
                client = "";
                for(var j=0; j < CLIENTS.length; j++){
                    if(CLIENTS[j][0] == ws){
                        console.log(CLIENTS[j][1]);
                        client = CLIENTS[j];
                        break;
                    }
                }
                CLIENTS[i][0].send("play|" + data.split("|")[1] + "|" + client[1]);
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
