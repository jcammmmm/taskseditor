cd monacoeditor
npm install .
cd example
npm install .
npm run build
cd ..
cd ..
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

