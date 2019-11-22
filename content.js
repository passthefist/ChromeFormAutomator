chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.action === "runScript") {
        runScript(request.script);
        // this is required to use sendResponse asynchronously
        return true;
    }
  }
);

function runScript(script) {
  chrome.storage.local.get([script], function(result) {
    eval(result[script].text);
  })
}
