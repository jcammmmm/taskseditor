function save() {
  var content = editor.getValue();
  console.log(content);
  fetch('http://192.168.0.61/script/save.py', {
    method: 'POST',
    body: content 
  });
}

/**
 * This function is executed when the user clicks on the 'Load' button.
 * It Downloads the main.tks file from the server, reads its contents
 * and then sets this value to the monaco editor.
 */
function load() {
  // Taken from https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream#examples
  fetch('http://192.168.0.61/taskseditor/tasks/main.tks')
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
                console.log("done", done);
                controller.close();
                return;
              }
              // Get the data and send it to the browser via the controller
              controller.enqueue(value);
              // Check chunks by logging to the console
              console.log(done, value);
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

editor.setTheme("ace/theme/dracula");
editor.session.setMode("ace/mode/text");

var editorplaceholder = document.getElementById("editor");

var saveButton = document.createElement("button");
saveButton.innerHTML = "Save";
saveButton.onclick = save;
document.body.insertBefore(saveButton, editorplaceholder)

var loadButton = document.createElement("button");
loadButton.innerHTML = "Load";
loadButton.onclick = load;
document.body.insertBefore(loadButton, editorplaceholder)

var undoButton = document.createElement("button");
undoButton.innerHTML = "Undo";
undoButton.onclick = function() { editor.undo() };
document.body.insertBefore(undoButton, editorplaceholder)

var redoButton = document.createElement("button");
redoButton.innerHTML = "Redo";
redoButton.onclick = function() { editor.redo() };
document.body.insertBefore(redoButton, editorplaceholder)

var refs = {
  saveButton: saveButton,
  loadButton: loadButton,
  undoButton: undoButton,
  redoButton: redoButton,
}

function updateToolbar() {
    refs.saveButton.disabled = editor.session.getUndoManager().isClean();
    refs.undoButton.disabled = !editor.session.getUndoManager().hasUndo();
    refs.redoButton.disabled = !editor.session.getUndoManager().hasRedo();
}

editor.on("input", updateToolbar);

editor.session.setValue(localStorage.savedValue || "Welcome to ace Toolbar demo!")

function save() {
    localStorage.savedValue = editor.getValue(); 
    editor.session.getUndoManager().markClean();
    updateToolbar();
}

editor.commands.addCommand({
    name: "save",
    exec: save,
    bindKey: { win: "ctrl-s", mac: "cmd-s" }
});