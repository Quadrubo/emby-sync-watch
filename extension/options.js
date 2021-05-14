var profiles;

async function get_storage() {
    var pp = new Promise(function(resolve, reject) {
        chrome.storage.sync.get(["conn_profiles"], function(options) {
            resolve(options.conn_profiles);
        });
    });

    profiles = await pp;

    // document.getElementById("def_server_input").value = defserverp;
}

document.getElementById("apply").addEventListener("click", function(e) {
    var empty = false;
    if(JSON.stringify(profiles) == "{}" || profiles == undefined){
        empty = true;
    }

    document.getElementById("save_text").innerHTML = "";

    var profile_name = document.getElementById("profile_name_input").value;
    var profile_server = document.getElementById("profile_server_input").value;
    var profile_port = document.getElementById("profile_port_input").value;

    var error = false;

    if(profile_name === ""){
        document.getElementById("error_profile_name_input").innerHTML = "Please specify a Name. Can be anything you want. Just not empty :)";
        error = true;
    } else {
        document.getElementById("error_profile_name_input").innerHTML = "";
    }

    if(profile_server === ""){
        document.getElementById("error_profile_server_input").innerHTML = "Please specify the Server. (\"localhost\" for your own pc, IP-Adress of other PC, etc...)";
        error = true;
    } else {
        document.getElementById("error_profile_server_input").innerHTML = "";
    }

    if(profile_port === ""){
        document.getElementById("error_profile_port_input").innerHTML = "Please specify the Port. Default is 8082, You can see it in the \"port.json\" file on the server.";
        error = true;
    } else {
        document.getElementById("error_profile_port_input").innerHTML = "";
    }

    
    if(!error){

        if(empty) {
            profiles = {"profiles": []};
        }

        profiles["profiles"].push({
            "profile_name": profile_name,
            "profile_server": profile_server,
            "profile_port": profile_port
        }) 
        
        chrome.storage.sync.set({conn_profiles: profiles});
        document.getElementById("save_text").innerHTML = "Successfully saved!";

        new_row(profile_name, profile_server, profile_port);

    }
    

});

function new_row(profile_name, profile_server, profile_port) {

    var tr_tags = document.getElementById("profile_tbody").getElementsByTagName("tr");
    
    var max_id = -1;
    for(element of tr_tags){
        var curr_id = element.id.split("_")[1];
        if (curr_id > max_id) {
            max_id = curr_id;
        }
    }

    var counter = max_id + 1;

    var tr = document.createElement("tr");
    tr.setAttribute("id", "tr_" + counter);
    document.getElementById("profile_tbody").appendChild(tr);

    var td = document.createElement("td");
    td.setAttribute("id", "td_" + counter + "_0");
    document.getElementById("tr_" + counter).appendChild(td);
    td.innerText = profile_name;

    var td = document.createElement("td");
    td.setAttribute("id", "td_" + counter + "_1");
    document.getElementById("tr_" + counter).appendChild(td);
    td.innerText = profile_server;

    var td = document.createElement("td");
    td.setAttribute("id", "td_" + counter + "_2");
    document.getElementById("tr_" + counter).appendChild(td);
    td.innerText = profile_port;

    var td = document.createElement("td");
    td.setAttribute("id", "td_" + counter + "_3");
    document.getElementById("tr_" + counter).appendChild(td);
    td.innerHTML = "<button class=\"delete_profile\" id=\"" + counter + "\">Delete</button>";

    clear_table();
    generate_table();
}

get_storage();