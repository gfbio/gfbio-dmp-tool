#!/bin/bash

# NOTE: You need to run this script every time you update the react app this
# can get tedious quickly. However you can use a file wather like inotify or
# entr. Entry is quite easy you just need to install it on your machine. Then
# you pipe it paths to all files you want it to watch for changes with any tool
# you like e.g. find. Then you call the -r switch with a path to a script or
# pass a program that you want to run on changes.

# find ./src -iname "*.js" | entr -r ./local_quick_collect.sh

# This will build the project for you on any changes in the source folder.

npm run build
#cp build/js/main.*.js ../../static/js/gfbio_dmpt_form/main.dmp_app.js
#cp build/js/main.*.js.map ../../static/js/gfbio_dmpt_form/main.dmp_app.js.map


# cp build/js/main.*.js ../../static/js/gfbio_dmpt_form/
# cp build/js/main.*.js.map ../../static/js/gfbio_dmpt_form/

# TODO: for local development, let's use a simple name to allow hardcoding in
#   django template
cp build/js/main.*.js ../../static/js/gfbio_dmpt_form/main.js
cp build/js/main.*.js.map ../../static/js/gfbio_dmpt_form/main.js.map

echo yes | docker-compose -f ../../../local.yml run --rm django python manage.py collectstatic
