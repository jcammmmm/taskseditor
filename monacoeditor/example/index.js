import * as monaco from 'monaco-editor/esm/vs/editor/editor.main.js';

self.MonacoEnvironment = {
	getWorkerUrl: function (moduleId, label) {
		if (label === 'json') {
			return './vs/language/json/json.worker.js';
		}
		if (label === 'css' || label === 'scss' || label === 'less') {
			return './vs/language/css/css.worker.js';
		}
		if (label === 'html' || label === 'handlebars' || label === 'razor') {
			return './vs/language/html/html.worker.js';
		}
		if (label === 'typescript' || label === 'javascript') {
			return './vs/language/typescript/ts.worker.js';
		}
		return './vs/editor/editor.worker.js';
	}
};

var editor = monaco.editor.create(document.getElementById('container'), {});

function save() {
  var content = editor.getValue();
  console.log(content);
  fetch('http://localhost/script/save.py', {
    method: 'POST',
    body: content 
  });
}

function load() {
  fetch('http://localhost/taskseditor/tasks/main.tks', {
    method: 'GET'
  })


  var pre = document.getElementsByTagName("pre");
  pre[0].innerHTML = "OGROSITO!!!"
}

var button = document.createElement("button");
button.innerHTML = "Save";
button.onclick = save;
document.body.appendChild(button);

button = document.createElement("button");
button.innerHTML = "Load";
button.onclick = load;
document.body.appendChild(button);

var pre = document.createElement("pre");
pre.innerHTML = "ogrosito";
pre.onclick = load;
document.body.appendChild(pre);
