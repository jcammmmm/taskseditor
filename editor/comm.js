function save() {
  var content = editor.getValue();
  console.log(content);
  fetch('http://localhost/script/save.py', {
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
  fetch('http://localhost/taskseditor/tasks/main.tks')
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

var button = document.createElement("button");
button.innerHTML = "Save";
button.onclick = save;
document.body.appendChild(button);

button = document.createElement("button");
button.innerHTML = "Load";
button.onclick = load;
document.body.appendChild(button);