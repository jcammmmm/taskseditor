# TODO
# check if the following software is installed to continue:
# - node
# - python
# - git


echo Setting up folder for $1 editor

git restore index.html

case $1 in

"ace")
  # remove link if any
  rm -rf src*
  rm -f comm.js

  # clone ace build's repository
  pushd editor
  rm -rf ace-builds
  git clone https://github.com/ajaxorg/ace-builds/ --depth 1

  # make links to shorten urls
  popd
  ls -l
  ln -s editor/ace-builds/src-noconflict/
;;

"monaco")
  pushd editor/monaco
  npm install .
  npx webpack
  popd

  ln -s editor/monaco/dist/ts.worker.bundle.js
  ln -s editor/monaco/dist/editor.worker.bundle.js
  ;;

*)
  echo "Please select and option: 'monaco' or 'ace'"
  exit

esac

python generate-index.py $1

# setting exec and write permissions
chmod a+w tasks/tasks.tks    # apache server user has write access
chmod a+w tasks/plans.tks    # apache server user has write access
chmod a+w tasks/food.tks     # apache server user has write access
chmod 655 script/save.py     # apache server user can execute
chmod 655 script/backup.py   # apache server user can execute
chmod 655 script/load.py     # apache server user can execute
