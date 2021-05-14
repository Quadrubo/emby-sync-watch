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
    var pp = new Promise(function(resolve, reject) {
        chrome.storage.sync.get(["conn_profiles"], function(options) {
            resolve(options.conn_profiles);
        });
    });

    profiles = await pp;

    console.log(profiles.profiles);

    var counter = 0;
    for(obj in profiles.profiles) {
        console.log(profiles.profiles[obj]);
        
        var option = document.createElement("option");
        option.setAttribute("value", "option_" + counter);
        option.innerText = profiles.profiles[obj]["profile_name"];
        document.getElementById("profile").appendChild(option);

        counter++;
    }

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

document.getElementById("profile").addEventListener("change", function(e) {
    console.log(e);
    var nbr = e.target.options[e.target.selectedIndex].value.split("_")[1];

    if(nbr == undefined) {
        document.getElementById("server_input").value = "";
        document.getElementById("port_input").value = "";
    } else {
        var curr_profile = profiles.profiles[nbr];

        console.log(profiles.profiles[nbr]);

        document.getElementById("server_input").value = curr_profile["profile_server"];
        document.getElementById("port_input").value = curr_profile["profile_port"];
    }
});