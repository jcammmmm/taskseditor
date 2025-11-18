
echo Setting up folder for $1 editor
case $1 in

"ace")
  # remove link if any
  rm -rf src*
  rm -f comm.js

  # clone ace build's repository
  cd editor
  rm -rf ace-builds
  git clone https://github.com/ajaxorg/ace-builds/ --depth 1

  # make links to shorten urls
  cd ..
  ls -l
  ln -s editor/ace-builds/src-noconflict/
;;

"monaco")
  cd editor/monaco
  npm install .
  npx webpack
  cd dist
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




exit


exit
ln -s monacoeditor/example/dist/index.html index.html
ln -s monacoeditor/example/dist/index.js index.js
ln -s monacoeditor/example/dist/index.css index.css

#this is a dratf

#giving execution permissions to apache
chmod 655 script/save.py
mkdir tasks
touch tasks/main.tks
chmod 666 tasks/main.tks

#cd /etc/apache2/conf-enable
#sudo ln -s ~/repo.m/taskseditor/serve-cgi-bin.conf serve-cgi-bin.conf

