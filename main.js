class Page {
  static fillAll(json) {
    for (let [inputLabel, inputValue] of Object.entries(json)) {
      Input.for(inputLabel).set(inputValue)
    }
  }
}

class Form {
  static fill(json) {
    for (let [inputLabel, inputValue] of Object.entries(json)) {
      Input.for(inputLabel).set(inputValue)
    }
  }

  static submit(selector) {
    var button = new Button(selector);
    button.click();
  }
}


class Input {
  constructor(selector) {
    this.node = document.querySelector(selector);
  }

  static for(text) {
    if( text[0] == '#' || text[0] == '.') {
      return Input.asWrapped(text);
    }

    var elements = document.getElementsByTagName('label');
    var nodes = [].filter.call(elements, function(element){
      return RegExp(text).test(element.textContent);
    });

    if (nodes.length !== 1) {
      throw `Expected exactly one match for ${text}`
    } else {
      return Input.asWrapped('#' + nodes[0].getAttribute('for'));
    }
  }

  static asWrapped(selector) {
    if (!selector) {
      return new NullInput(selector)
    }

    var node = document.querySelector(selector);

    switch (node.tagName) {
      case 'SELECT':
        return new SelectInput(selector);
      case 'INPUT':
        if (node.getAttribute('type') === 'submit') {
          return new Button(selector);
        }
        return new TextInput(selector);
      case 'BUTTON':
      case 'SUBMIT':
        return new Button(selector);
      default:
        throw 'Unknown Tag Name';
    }
  }

  static interpolate(string) {
    string = string.replace('%i', Math.trunc(Math.random()*100000));
    string = string.replace('%t', (new Date()).getTime());

    return string;
  }
}

class NullInput extends Input {
  set(value) { }
}

class SelectInput extends Input{
  options() {
    return this.node.options;
  }

  set(optionText) {
    var opts = this.options();

    for (var opt, j = 0; opt = opts[j]; j++) {
      if (opt.innerText == optionText) {
        this.node.selectedIndex = j;
        break;
      }
    }
  }
}

class TextInput extends Input{
  set(text) {
    this.node.value = Input.interpolate(text);
  }
}

class Button extends Input {
  set(action) {
    switch (action) {
      case 'click':
        this.node.click();
        break;
      case 'submit':
        this.node.submit();
        break;
    }
  }

  click() {
    this.node.click()
  }

  submit() {
    this.node.submit()
  }
}

class Block {
  constructor(block_name) {
    this.json = this.load_content(block_name)
  }

  static load(block_name, params) {
    var block = new Block(block_name)

    if (params) {
      return Object.assign({}, block.json, params)
    } else {
      return block.json;
    }
  }

  async load_content(block_name) {
    return await this.async_load_content(block_name)
  }

  async_load_content(block_name) {
    return new Promise(resolve => {
      chrome.storage.local.get([block_name], function(result) {
        resolve(JSON.parse(result[block_name].text));
      })
    })
  }

  load_parent(parent_block) {
    if (parent_block == 'base') {
      return {}
    }

    return (new Block(parent_block)).content()
  }
}
