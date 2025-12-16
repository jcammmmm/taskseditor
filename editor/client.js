const HOST = "localhost"
const PROTO = "http"
const FILENAMES = ["tasks", "plans", "food"];
const BUTTON_REFS = {};
var CURRENT_FILE = "tasks";
/**
 * This function is executed when the user clicks on the 'Load' button.
 * It Downloads the main.tks file from the server, reads its contents
 * and then sets this value to the monaco editor.
 */
function load(filename) {
  var url = `${PROTO}://${HOST}/script/load.py?${filename}`
  console.log(`loading file.. . "${url}"`);
  fetch(url, {
    method: 'POST'
  })
  .then(response => response.text())
  .then(data => {
    editor.setValue(data);
    console.log("loaded.");
  });
}

/**
 * @deprecated in favor of new update logic. 
 */
function save() {
  var url = `${PROTO}://${HOST}/script/save.py?${CURRENT_FILE}`
  console.log(`saving file.. . "${url}"`);

  var content = editor.getValue();
  fetch(url, {
    method: 'POST',
    body: content
  })
  .then(response => response.text())
  .then(data => {
    console.log(data);
  })
}

/**
 * 
 */
let lastEdit = null;
let i = 0;
let firstLoad = true;

function sendFileUpdate(event) {
  if (firstLoad) {
    firstLoad = false;
    return;
  }
  
  var url = `${PROTO}://${HOST}/script/save.py?${CURRENT_FILE}`
  let changes = [];
  // Several changes occur when you type '"' and automatically the
  // editor adds the matching quote.
  for (c of event.changes) {
    // https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-oop.html#erased-structural-types
    changes.push({
      range: c.range,
      text: c.text
    })
  }
  
  contentUpdates = JSON.stringify(changes, null, "\t");
  console.log(contentUpdates);
  console.log(`sending content updates to: "${url}"`);

  fetch(url, {
    method: 'POST',
    body: contentUpdates
  })
  .then(response => response.text())
  .then(data => {
    console.log(data);
  })
}

function backup() {
  var url = `${PROTO}://${HOST}/script/backup.py`
  fetch(url);
  console.log(`backing up files.. . "${url}"`);
}

function setUnsave() {
  saveStatus.innerHTML = "not saved.";
  saveStatus.style = "color: red"
}

function renderButtons() {
  // Editor DOM node
  var editorplaceholder = document.getElementById("editor");
  
  var divButton = document.createElement("div");
  document.body.insertBefore(divButton, editorplaceholder);
  
  for (var filename of FILENAMES) {
    var loadButton = document.createElement("button");
    loadButton.className = "tablink"
    loadButton.innerHTML = filename;
    loadButton.onclick = function (e) { 
      load(e.target.innerHTML);
      CURRENT_FILE = e.target.innerHTML;
      for (let btn in BUTTON_REFS) {
        BUTTON_REFS[btn].disabled = false;
        BUTTON_REFS[btn].style = "border-bottom: none; color: #858585;"
      }
      e.target.disabled = true;
      e.target.style = "border-bottom: solid white; color: white;"
    };
    divButton.appendChild(loadButton);
    BUTTON_REFS[filename] = loadButton
  }
  
  // var backupButton = document.createElement("button");
  // backupButton.innerHTML = "Backup";
  // backupButton.onclick = function() { backup() };
  // divButton.appendChild(backupButton);
  
  // var saveStatus = document.createElement("pre");
  // saveStatus.id = "saveStatus"
  // saveStatus.innerHTML = "not saved";
  // saveStatus.style = "color: red"
  // document.body.insertBefore(saveStatus, editorplaceholder);

  // var serverMessage = document.createElement("pre");
  // serverMessage.id = "serverMessage"
  // serverMessage.innerHTML = "not saved";
  // serverMessage.style = "color: red"
  // document.body.insertBefore(serverMessage, editorplaceholder);
}


function configureMonacoEditor(editor) {
  editor.getModel().onDidChangeContent(sendFileUpdate);
}

// Click on the 'tasks' button. This will load the file and
// configure the buttons

renderButtons();
configureMonacoEditor(editor);
BUTTON_REFS["tasks"].click();