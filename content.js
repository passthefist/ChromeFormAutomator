chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.action === "runScript") {
        runScript(request.script, sender.tab.id);
        // this is required to use sendResponse asynchronously
        return true;
    }
  }
);

function runScript(script, tab_id) {
  chrome.tabs.get(tab_id, function(triggered_tab) {
    chrome.storage.local.get([script], function(result) {
      var tab = triggered_tab;

      eval(result[script].text);
    })
  })
}
