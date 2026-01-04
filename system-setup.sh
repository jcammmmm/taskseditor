PRIVATE_KEY_NAME="digitalocean-dropletbasic"
HOST_ADDR="164.92.98.105"
HOST_USER="root"
APPNAME=taskseditor
RELEASE_ARTIFACT_NAME=$APPNAME-release.zip



clean() {
  git restore index.html
}

check_installed() {
  echo "Verify environment requirements.. ."
  for i in $@
  do
    which $i > '/dev/null'
    if [[ $? -eq 1 ]]; then
      echo "You need to install '$i' to proceed."
      exit
    fi
  done
  echo "Verify environemnt requirements OK"
}

build_system() {
  echo "Setting up folder..."
  check_installed node python git

  pushd editor/monaco
  npm install .
  npx webpack
  popd

  ln -s editor/monaco/dist/ts.worker.bundle.js
  ln -s editor/monaco/dist/editor.worker.bundle.js
  
  echo "Setting up folder OK"
}

build_system_ace() {
  exit
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

}

grant_permissions() {
  # setting exec and write permissions
  chmod a+w tasks/tasks.tks    # apache server user has write access
  chmod a+w tasks/plans.tks    # apache server user has write access
  chmod a+w tasks/food.tks     # apache server user has write access
  chmod 655 script/save.py     # apache server user can execute
  chmod 655 script/backup.py   # apache server user can execute
  chmod 655 script/load.py     # apache server user can execute
}

case $1 in

"deploy")
  SERVER_APP_LOC=/var/www/html
  check_installed ssh

  sed -i -e "s/localhost/$HOST_ADDR/g" editor/client.js

  echo "Compressing the system.. ."
  # compress ignoring ignored by git files
  zip -r $RELEASE_ARTIFACT_NAME . -x@.gitignore --symlinks
  # add the dist folder
  zip -r $RELEASE_ARTIFACT_NAME . -i "editor/monaco/dist/*" -i "tasks/*"
  echo "OK"
  echo

  echo "Uploading the release artifact to the cloud instance.. ."
  scp -r -i "~/.ssh/$PRIVATE_KEY_NAME" $RELEASE_ARTIFACT_NAME "$HOST_USER@$HOST_ADDR:$SERVER_APP_LOC"
  echo "OK"
  echo

  echo "Unpacking artifactict in the cloud instance.. ."
  ssh -i "~/.ssh/$PRIVATE_KEY_NAME" "$HOST_USER@$HOST_ADDR" unzip -o $SERVER_APP_LOC/$RELEASE_ARTIFACT_NAME -d $SERVER_APP_LOC/taskseditor
  echo "OK"
  echo

  echo "Deploy Completed."
;;

"generate")
  build_system
  grant_permissions
;;

"setup-server")
  # TODO: NOT TESTED
  # Configure Apache2 error logs. Echo two times to preserver the original example from 
  # https://httpd.apache.org/docs/2.4/mod/core.html#errorlogformat
  # sudo echo ErrorLogFormat "[%t] [%l] [pid %P] %F: %E: [client %a] %M" >> /etc/apache2/apache2.conf
  # sudo echo ErrorLogFormat "[%t] [%l] [pid %P] [client %a] %M" >> /etc/apache2/apache2.conf
  sudo echo ErrorLogFormat "[%t] [pid %P] %M" >> /etc/apache2/apache2.conf

  
;;

*)
  echo "Please select and option: 'generate' or 'deploy'"
  exit

esac






