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
    editor.setValue(data)
    saveStatus.innerHTML = "loaded.";
    saveStatus.style = "color: blue";
  });
}

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
    serverMessage.innerHTML = data;
    serverMessage.style = "color: yellow"
  })
  .then(() => {
  });
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
    loadButton.innerHTML = filename;
    loadButton.onclick = function (e) { 
      load(e.target.innerHTML);
      CURRENT_FILE = e.target.innerHTML;
      for (let btn in BUTTON_REFS) {
        BUTTON_REFS[btn].disabled = false;
      }
      e.target.disabled = true;
    };
    divButton.appendChild(loadButton);
    BUTTON_REFS[filename] = loadButton
  }
  
  var backupButton = document.createElement("button");
  backupButton.innerHTML = "Backup";
  backupButton.onclick = function() { backup() };
  divButton.appendChild(backupButton);
  
  var saveStatus = document.createElement("pre");
  saveStatus.id = "saveStatus"
  saveStatus.innerHTML = "not saved";
  saveStatus.style = "color: red"
  document.body.insertBefore(saveStatus, editorplaceholder);

  var serverMessage = document.createElement("pre");
  serverMessage.id = "serverMessage"
  serverMessage.innerHTML = "not saved";
  serverMessage.style = "color: red"
  document.body.insertBefore(serverMessage, editorplaceholder);
}

function configureEditor(editor) {
  editor.setTheme("ace/theme/dracula");
  editor.session.setMode("ace/mode/text");
  
  editor.textInput.getElement().addEventListener("keyup", save);
  editor.textInput.getElement().addEventListener("keydown", setUnsave);
  
  editor.commands.addCommand({
      name: "save",
      exec: save,
      bindKey: { win: "ctrl-s", mac: "cmd-s" }
  });
}

// Click on the 'tasks' button. This will load the file and
// configure the buttons
renderButtons();
configureEditor(editor);
BUTTON_REFS["tasks"].click();