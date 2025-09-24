#this is a draft

mkdir cgi-bin

#giving execution permissions to apache
chmod 655 cgi-bin/xxx.py
touch main.tks
chmod 666 cgi-bin/main.tks

cd /etc/apache2/conf-enable
sudo ln -s ~/repo.m/taskseditor/serve-cgi-bin.conf serve-cgi-bin.conf

