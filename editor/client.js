const HOST = "localhost"
const PROTO = "http"
const FILENAMES = ["tasks", "plans", "food"];
const BUTTON_REFS = {};
var FILE_UPDATES = [];
var CURRENT_FILE = "tasks";


class TasksModel {
  constructor(filename, contents="") {
    this.filename = filename;
    this.editorModel = createEditorModel(contents, "text/plain");
    this.fileUpdates = [];
    
    /**
     * Because accumulateChanges will be called in a deferred manner by
     * onDidChangeContent, the this binding to TaskModel will be undefined. 
     * The two links below explain this behavior.
     * 
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
     */
    this.editorModel.onDidChangeContent(this.accummulateChanges.bind(this));
  }

  get model() {
    return this.editorModel;
  }

  set model(contents) {
    this.editorModel.setValue(contents);
    // the previous call to 'setValue' is added to the undo stack, but 
    // we do not need it, because we that is our starting edition point.
    this.editorModel.popStackElement() 
  }
  
  get updates() {
    let u = this.fileUpdates;
    this.fileUpdates = [];
    return u;
  }

  accummulateChanges(event) {
    var statusBar = document.getElementById("statusbar");
    statusBar.innerHTML = "not saved.";
    // Several changes occur when you type '"' and automatically the
    // editor adds the matching quote. Or when you search and replace strings.
    for (let c of event.changes) {
      // https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-oop.html#erased-structural-types
      this.fileUpdates.push({
        range: c.range,
        text: c.text
      });
    }
  }
}

const FILE_MODELS = {
  "tasks": new TasksModel("tasks"),
  "plans": new TasksModel("plans"),
  "food": new TasksModel("food"),
}

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
    FILE_MODELS[CURRENT_FILE].model = data;
    editor.setModel(FILE_MODELS[CURRENT_FILE].model);
    console.log("loaded.");
  });
}

function save() {
  var url = `${PROTO}://${HOST}/script/save.py?${CURRENT_FILE}`

  contentUpdates = JSON.stringify(FILE_MODELS[CURRENT_FILE].updates, null, "\t");

  console.log(`saving file updates to: "${url}"`);
  console.log(contentUpdates);
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

function renderUI() {
  var divButton = document.getElementById("taskfiles");
  
  for (var filename in FILE_MODELS) {
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
  saveButton.onclick = save;
}





renderUI();
// Click on the 'tasks' button. This will load the file and
// configure the buttons
BUTTON_REFS["tasks"].click();