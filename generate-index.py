import sys

mode = sys.argv[1]

monaco = """<!-- MONACO -->
  <div id="container" style="width: 800px; height: 600px; border: 1px solid #ccc"></div>
  <script src="editor/monaco/dist/app.bundle.js"></script>
"""

ace = """<!-- ACE -->
  <pre id="editor"></pre>
  <script src="src-noconflict/ace.js" type="text/javascript" charset="utf-8"></script>
  <script>
    var editor = ace.edit("editor");
  </script>
"""

with open('index.html') as index:
  template = index.read()
  if mode == 'ace':
    template = template.replace("<!--EDITOR-->", ace)
  else:
    template = template.replace("<!--EDITOR-->", monaco)

  with open('index.html', 'w') as index:
    index.write(template)
  