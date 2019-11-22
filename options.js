document.addEventListener('DOMContentLoaded',function() {
  var pad = document.getElementById('script_pad')
  var save_script = document.getElementById('save_script')
  var load_script = document.getElementById('load_script')

  var save_block = document.getElementById('save_block')
  var load_block = document.getElementById('load_block')

  var clear = document.getElementById('clear_data')

  save_script.onclick = function() {
    var script_name = document.getElementById('item_name').value
    chrome.storage.local.get(['script_names'], function(result) {
      var script_names = result.script_names || [];

      script_names.push(script_name)

      chrome.storage.local.set({script_names:script_names});
      chrome.storage.local.set({[script_name]: {text:pad.value}});

      alert("Saved " + script_name);
    })
  }

  save_block.onclick = function() {
    var block_name = document.getElementById('item_name').value
    chrome.storage.local.get(['block_names'], function(result) {
      var block_names = result.block_names || [];

      block_names.push(block_name)

      var inheriting_block = document.getElementById('parent_block').value

      chrome.storage.local.set({block_names:block_names});
      chrome.storage.local.set({[block_name]: {text:pad.value, inherits:inheriting_block}});

      alert("Saved " + block_name);
    })
  }

  load_script.onclick = function() {
    var saved = chrome.storage.local.get(['script_names'], function(result) {
      if (result.script_names) {
        var listRoot = document.getElementById('load_menu')
        listRoot.innerHTML = ""

        var modal = document.getElementById('load_modal')
        modal.style.display = "";

        result.script_names.forEach(function(scriptname) {
          var node = document.createElement("LI");
          node.setAttribute('data-menu-item',null)
          node.setAttribute('data-script',scriptname)

          var textnode = document.createTextNode(scriptname)
          node.appendChild(textnode);

          listRoot.appendChild(node);

          node.onclick = function() {
            modal.style.display = "none";
            document.getElementById('parent_block_menu').style = 'display: none;'

            chrome.storage.local.get([scriptname], function(result) {
              pad.value = result[scriptname].text || result[scriptname];
            })
          }
        })
      }
    })
  }

  load_block.onclick = function() {
    document.getElementById('parent_block_menu').style = 'display: inline;'

    var saved = chrome.storage.local.get(['block_names'], function(result) {
      if (result.block_names) {
        var listRoot = document.getElementById('load_menu')
        listRoot.innerHTML = ""

        var modal = document.getElementById('load_modal')
        modal.style.display = "";

        result.block_names.forEach(function(scriptname) {
          var node = document.createElement("LI");
          node.setAttribute('data-menu-item',null)
          node.setAttribute('data-script',scriptname)

          var textnode = document.createTextNode(scriptname)
          node.appendChild(textnode);

          listRoot.appendChild(node);

          node.onclick = function() {
            modal.style.display = "none";

            chrome.storage.local.get([scriptname], function(result) {
              pad.value = result[scriptname].text;
            })
          }
        })
      }
    })
  }

  clear.onclick = function() {
    if (confirm('Are you sure?')) {
      chrome.storage.local.clear()
    }
  }

  var scratches = document.getElementById('scratch_list');

  var saved = Object.keys(localStorage)

 /* saved.forEach(function(scratch_key) {
    var item = window.localStorage.getItem(scratch_key);
    var node = document.createElement("LI");

    var textnode = document.createTextNode(item.substring(0,15));
    node.appendChild(textnode);

    node.onclick = function(e) {
      doc_key = scratch_key
      var item = chrome.storage.local.get(scratch_key);
      pad.value = item;
    }

    scratches.appendChild(node);
  })*/

},false);
