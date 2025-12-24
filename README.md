Tasks Editor
==============================================================
> Keep track of your tasks with a simple text editor!

Setup
==============================================================

1. Install Node, Apache2, Python
2. Clone this repository to your home folder
3. Create a symbolic link from that folder to `/var/www/html/taskeditor`
4. Run `bash system-setup.sh`



Development Process
==============================================================
You don't need to setup any environment or have some 'autoreload' framework
to develop the files of this project. Just setup the project and modify the
files as described below.

Frontend Client
-----------------------
Because the changes are made to the `comm.js`` file there is no need
to recompile the monaco editor. Monaco Editor now is treated as another
dependency.

The `monaco.d.ts` file contains the API description for the monaco editor,
and it is used extensively to develop the `comm.js` file.

(this folder contains the output of `npm run build` to one of the examples
from monaco editor)???

Backend Scripts
-----------------------
Just run the scripts as standalone Python scripts. 


Run tests
===============================================================

0. cd `script`
1. `export PYTHONPATH=.. && python test/save.py`


Other Notes
===============================================================
While looking for a way to find file differences, I find several approaches: 
- monaco diff generator: has its own format, and no docs
- compile diff to wasm from gnu coreutils and use it in the client
- look for js library.
It happened that google wrote a set of libraries to resolve this problem!
They mention that they have use it to power google docs! And at the end the
intention of this editor is to offer something similar but with a 'simple'
yet good looking text editor. 
