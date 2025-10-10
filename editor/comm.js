const HOST = "localhost"
const PROTO = "http"
const FILENAMES = ["tasks", "plans", "food"];
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
  .then(response => { 
    saveStatus.innerHTML = "loaded.";
    saveStatus.style = "color: blue";
    // editor.setValue(result);
    return response.text();
  })
  .then(data => editor.setValue(data));
}

function save() {
  var url = `${PROTO}://${HOST}/script/save.py?${CURRENT_FILE}`
  console.log(`saving file.. . "${url}"`);

  localStorage.savedValue = editor.getValue();
  editor.session.getUndoManager().markClean();

  var content = editor.getValue();
  fetch(url, {
    method: 'POST',
    body: content
  }).then(() => {
    saveStatus.innerHTML = "saved.";
    saveStatus.style = "color: green"
  });
}

function backup() {
  var url = `${PROTO}://${HOST}/script/backup.py?${CURRENT_FILE}`
  console.log(`backing up file.. . "${url}"`);
}

function setUnsave() {
  saveStatus.innerHTML = "not saved.";
  saveStatus.style = "color: red"
}

editor.setTheme("ace/theme/dracula");
editor.session.setMode("ace/mode/text");

var editorplaceholder = document.getElementById("editor");

var divButton = document.createElement("div");
document.body.insertBefore(divButton, editorplaceholder);

var refs = {};
var buttonFileRefs = {};
for (var filename of FILENAMES) {
  var loadButton = document.createElement("button");
  loadButton.innerHTML = filename;
  loadButton.onclick = function (e) { 
    load(e.target.innerHTML);
    CURRENT_FILE = e.target.innerHTML;
    for (let btn in buttonFileRefs) {
      buttonFileRefs[btn].disabled = false;
    }
    e.target.disabled = true;
  };
  divButton.appendChild(loadButton);
  buttonFileRefs[filename + "Button"] = loadButton
}

var backupButton = document.createElement("button");
backupButton.innerHTML = "Backup";
backupButton.onclick = function() { backup() };
divButton.appendChild(backupButton);
refs.backupButton = backupButton

var saveStatus = document.createElement("pre");
saveStatus.id = "saveStatus"
saveStatus.innerHTML = "not saved";
saveStatus.style = "color: red"
document.body.insertBefore(saveStatus, editorplaceholder);

editor.textInput.getElement().addEventListener("keyup", save);
editor.textInput.getElement().addEventListener("keydown", setUnsave);

editor.commands.addCommand({
    name: "save",
    exec: save,
    bindKey: { win: "ctrl-s", mac: "cmd-s" }
});

load("tasks");