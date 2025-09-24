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
exit

#this is a draft

mkdir cgi-bin

#giving execution permissions to apache
chmod 655 cgi-bin/xxx.py
touch main.tks
chmod 666 cgi-bin/main.tks

cd /etc/apache2/conf-enable
sudo ln -s ~/repo.m/taskseditor/serve-cgi-bin.conf serve-cgi-bin.conf

