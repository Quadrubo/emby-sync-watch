function injectTheScript() {
    var server_input = document.getElementById("server_input").value;
    var port_input = document.getElementById("port_input").value;
    var error = false;

    if(server_input === ""){
        document.getElementById("error_server").innerHTML = "Please specify a server.";
        error = true;
    } else {
        document.getElementById("error_server").innerHTML = "";
    }


    if(port_input === ""){
        document.getElementById("error_port").innerHTML = "Please specify a port.";
        error = true;
    } else {
        document.getElementById("error_port").innerHTML = "";
    }

    if(!error){
        chrome.storage.sync.set({server: server_input});
        chrome.storage.sync.set({port: port_input});

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            // query the active tab, which will be only one tab
            //and inject the script in it
            chrome.scripting.executeScript({
                files: ['content.js'],
                target: {tabId: tabs[0].id}
            });
        });
    }
}

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

    document.getElementById("server_input").value = defserverp;
    document.getElementById("port_input").value = defportp;
}

get_storage();

document.getElementById("connect").addEventListener('click', injectTheScript);

document.getElementById("options").addEventListener('click', function(e){
    chrome.tabs.create({url: `chrome-extension://${chrome.runtime.id}/options.html`}, function (tab) {
        console.log("options page opened");
    });
});

document.getElementById("help").addEventListener('click', function(e){
    chrome.tabs.create({url: "https://github.com/Quadrubo/emby-sync-watch#readme"}, function (tab) {
        console.log("Github Readme page opened");
    });
});