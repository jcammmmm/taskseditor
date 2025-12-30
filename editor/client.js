const HOST = "localhost"
const PROTO = "http"
const FILENAMES = ["tasks", "plans", "food"];
const BUTTON_REFS = {};
var FILE_UPDATES = [];
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

function sendFileUpdate() {
  var url = `${PROTO}://${HOST}/script/save.py?${CURRENT_FILE}`
  
  contentUpdates = JSON.stringify(FILE_UPDATES, null, "\t");
  FILE_UPDATES = [];

  console.log(contentUpdates);
  console.log(`sending content updates to: "${url}"`);
  fetch(url, {
    method: 'POST',
    body: contentUpdates
  })
  .then(response => response.text())
  .then(data => {
    console.log(data);
    
    var statusBar = document.getElementById("statusbar");
    statusBar.innerHTML = "saved."
  })
}

function backup() {
  var url = `${PROTO}://${HOST}/script/backup.py`
  fetch(url);
  console.log(`backing up files.. . "${url}"`);
}

function renderUI() {
  var divButton = document.getElementById("taskfiles");
  
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

  var statusBar = document.getElementById("statusbar");
  statusBar.innerHTML = "saved"

  var saveButton = document.getElementById("savebutton");
  saveButton.onclick = sendFileUpdate;
}

var firstLoad = true;
function accummulateChanges(event) {
  if (firstLoad) {
    firstLoad = false;
    return;
  }

  var statusBar = document.getElementById("statusbar");
  statusBar.innerHTML = "not saved"
  // Several changes occur when you type '"' and automatically the
  // editor adds the matching quote.
  for (c of event.changes) {
    // https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-oop.html#erased-structural-types
    FILE_UPDATES.push({
      range: c.range,
      text: c.text
    })
  }
}


function configureMonacoEditor(editor) {
  editor.getModel().onDidChangeContent(accummulateChanges);
}

// Click on the 'tasks' button. This will load the file and
// configure the buttons

renderUI();
configureMonacoEditor(editor);
BUTTON_REFS["tasks"].click();