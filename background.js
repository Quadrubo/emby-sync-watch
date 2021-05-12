chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason === "install") {
        // Code to be executed on first install
        // eg. open a tab with a url
        chrome.tabs.create({url: `chrome-extension://${chrome.runtime.id}/options.html`}, function (tab) {
            console.log("options page opened");
        });
    } else if (details.reason === "update") {
        // When extension is updated
    } else if (details.reason === "chrome_update") {
        // When browser is updated
    } else if (details.reason === "shared_module_update") {
        // When a shared module is updated
    }
  });