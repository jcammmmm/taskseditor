echo Setting up folder for Ace editor
# remove link if any
rm index.html
rm -rf src*

# clone ace build's repository
cd editor
rm -rf ace*
git clone https://github.com/ajaxorg/ace-builds/ --depth 1

# make links to shorten urls
cd ..
ls -l
ln -s editor/ace-builds/editor.html index.html
ln -s editor/ace-builds/src-noconflict/

