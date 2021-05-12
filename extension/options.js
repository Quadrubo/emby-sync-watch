async function get_storage() {
    var dsp = new Promise(function(resolve, reject) {
        chrome.storage.sync.get(["default_server"], function(options) {
            resolve(options.default_server);
        });
    });

    var dpp = new Promise(function(resolve, reject) {
        chrome.storage.sync.get(["default_port"], function(options) {
            resolve(options.default_port);
        });
    });

    const defserverp = await dsp;
    const defportp = await dpp;

    document.getElementById("def_server_input").value = defserverp;
    document.getElementById("def_port_input").value = defportp;
}

document.getElementById("apply").addEventListener("click", function(e) {
    document.getElementById("save_text").innerHTML = "";

    var def_server = document.getElementById("def_server_input").value;
    var def_port = document.getElementById("def_port_input").value;

    var error = false;

    if(def_server === ""){
        document.getElementById("error_def_server").innerHTML = "Please specify a server.";
        error = true;
    } else {
        document.getElementById("error_def_server").innerHTML = "";
    }


    if(def_port === ""){
        document.getElementById("error_def_port").innerHTML = "Please specify a port.";
        error = true;
    } else {
        document.getElementById("error_def_port").innerHTML = "";
    }

    if(!error){
        chrome.storage.sync.set({default_server: def_server});
        chrome.storage.sync.set({default_port: def_port});
        document.getElementById("save_text").innerHTML = "Successfully saved!";
    }

});

get_storage();