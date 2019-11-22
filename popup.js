document.addEventListener("DOMContentLoaded", function(event) {
    var menu = document.querySelector("ul[data-menu]")

    var items = listScripts(menu, function(items) {
      items.forEach( function(item) {
        item.onclick = runPageScript(item.getAttribute('data-script'));
      })
    })

    document.querySelector('a[data-options]').onclick = function() {
      if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
      } else {
        window.open(chrome.runtime.getURL('options.html'));
      }
    };
});

function runPageScript(script){
  return function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "runScript", script:script }, function (response) { });
    });
  }
}

function listScripts(listRoot, scriptsCallback) {
  var saved = chrome.storage.local.get(['script_names'], function(result) {
    var items = [];

    if (result.script_names) {
      result.script_names.forEach(function(scriptname) {
        var node = document.createElement("LI");
        node.setAttribute('data-menu-item',null)
        node.setAttribute('data-script',scriptname)

        var textnode = document.createTextNode(scriptname)
        node.appendChild(textnode);

        listRoot.appendChild(node);

        items.push(node)
      })
    }

    scriptsCallback(items);
  })
}
