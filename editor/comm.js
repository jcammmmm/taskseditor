const HOST = "localhost"
const PROTO = "http"
const FILENAMES = ["tasks", "plans", "food"];
var CURRENT_FILE = "tasks";
/**
 * This function is executed when the user clicks on the 'Load' button.
 * It Downloads the main.tks file from the server, reads its contents
 * and then sets this value to the monaco editor.
 */
// var load = function (filename) {
function load(filename) {
  // Taken from https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream#examples
  var url = `${PROTO}://${HOST}/taskseditor/tasks/${filename}.tks`
  console.log(`loading file.. . "${url}"`);
  fetch(url)
    .then((response) => response.body)
    .then((rb) => {
      const reader = rb.getReader();

      return new ReadableStream({
        start(controller) {
          // The following function handles each data chunk
          function push() {
            // "done" is a Boolean and value a "Uint8Array"
            reader.read().then(({ done, value }) => {
              // If there is no more data to read
              if (done) {
                controller.close();
                return;
              }
              // Get the data and send it to the browser via the controller
              controller.enqueue(value);
              push();
            });
          }
          push();
        },
      });
    })
    .then((stream) =>
    // Respond with our stream
    new Response(stream, { headers: { "Content-Type": "text/html" } }).text(),
  )
  .then((result) => {
    editor.setValue(result);
  });
}

function updateToolbar() {
  refs.undoButton.disabled = !editor.session.getUndoManager().hasUndo();
  refs.redoButton.disabled = !editor.session.getUndoManager().hasRedo();
}

function save() {
  var url = `${PROTO}://${HOST}/script/save.py?${CURRENT_FILE}`
  console.log(`saving file.. . "${url}"`);

  localStorage.savedValue = editor.getValue();
  editor.session.getUndoManager().markClean();
  updateToolbar();

  var content = editor.getValue();
  fetch(url, {
    method: 'POST',
    body: content
  }).then(() => {
    saveStatus.innerHTML = "saved.";
    saveStatus.style = "color: green"
  });
}

function setUnsave() {
  saveStatus.innerHTML = "not saved.";
  saveStatus.style = "color: red"
}

editor.setTheme("ace/theme/dracula");
editor.session.setMode("ace/mode/text");

var refs = {};
var buttonFileRefs = {};
var editorplaceholder = document.getElementById("editor");
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
  document.body.insertBefore(loadButton, editorplaceholder)
  buttonFileRefs[filename + "Button"] = loadButton
}

var undoButton = document.createElement("button");
undoButton.innerHTML = "Undo";
undoButton.onclick = function() { editor.undo() };
document.body.insertBefore(undoButton, editorplaceholder)
refs.undoButton = undoButton

var redoButton = document.createElement("button");
redoButton.innerHTML = "Redo";
redoButton.onclick = function() { editor.redo() };
document.body.insertBefore(redoButton, editorplaceholder)
refs.redoButton = redoButton

var saveStatus = document.createElement("pre");
saveStatus.id = "saveStatus"
saveStatus.innerHTML = "not saved";
saveStatus.style = "color: red"
document.body.insertBefore(saveStatus, editorplaceholder);

editor.on("input", updateToolbar);
editor.textInput.getElement().addEventListener("keyup", save);
editor.textInput.getElement().addEventListener("keydown", setUnsave);

editor.commands.addCommand({
    name: "save",
    exec: save,
    bindKey: { win: "ctrl-s", mac: "cmd-s" }
});

load("tasks");