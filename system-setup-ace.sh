echo Setting up folder for Ace editor
# remove link if any
rm -rf src*
rm -f comm.js

# clone ace build's repository
cd editor
rm -rf ace*
git clone https://github.com/ajaxorg/ace-builds/ --depth 1

# make links to shorten urls
cd ..
ls -l
ln -s editor/ace-builds/src-noconflict/

# setting exec and write permissions
chmod a+w tasks/tasks.tks
chmod a+w tasks/plans.tks
chmod a+w tasks/food.tks
chmod 655 script/save.py