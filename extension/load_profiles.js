var profiles;

async function get_storage() {
    var pp = new Promise(function(resolve, reject) {
        chrome.storage.sync.get(["conn_profiles"], function(options) {
            resolve(options.conn_profiles);
        });
    });

    profiles = await pp;

    generate_table();
}

function generate_table() {
    console.log(profiles);
    var counter = 0;
    if(profiles != undefined) {

        for (obj in profiles.profiles) {

            console.log(profiles.profiles[obj]);

            var curr_profile_name = profiles.profiles[obj]["profile_name"];
            var curr_profile_server = profiles.profiles[obj]["profile_server"];
            var curr_profile_port = profiles.profiles[obj]["profile_port"];

            var tr = document.createElement("tr");
            tr.setAttribute("id", "tr_" + counter);
            document.getElementById("profile_tbody").appendChild(tr);

            var td = document.createElement("td");
            td.setAttribute("id", "td_" + counter + "_0");
            document.getElementById("tr_" + counter).appendChild(td);
            td.innerText = curr_profile_name;

            var td = document.createElement("td");
            td.setAttribute("id", "td_" + counter + "_1");
            document.getElementById("tr_" + counter).appendChild(td);
            td.innerText = curr_profile_server;

            var td = document.createElement("td");
            td.setAttribute("id", "td_" + counter + "_2");
            document.getElementById("tr_" + counter).appendChild(td);
            td.innerText = curr_profile_port;

            var td = document.createElement("td");
            td.setAttribute("id", "td_" + counter + "_3");
            document.getElementById("tr_" + counter).appendChild(td);
            td.innerHTML = "<button class=\"delete_profile\" id=\"" + counter + "\">Delete</button>";

            counter++;
        }

        var delete_buttons = document.getElementsByClassName("delete_profile");
        for(var i = 0; i < delete_buttons.length; i++){
            console.log(delete_buttons[i]);

            delete_buttons[i].addEventListener("click", function(e) {
                if (confirm('Are you sure you want to delete this profile?')) {
                    var button_id = e.target.id;

                    delete profiles.profiles[button_id];

                    profiles.profiles.length = profiles.profiles.length - 1;

                    chrome.storage.sync.set({conn_profiles: profiles});
                
                    clear_table();
                    generate_table();
                } 
            });
        }
    }
}

function clear_table() {
    var tbody = document.getElementById("profile_tbody");
    tbody.innerHTML = "";
}

document.getElementById("delete_all_profiles").addEventListener("click", function(e) {
    if (confirm('Are you sure you want to delete ALL profiles?')) {
        profiles = {"profiles": []};

        chrome.storage.sync.set({conn_profiles: profiles});

        clear_table();
    } 
});

get_storage();


