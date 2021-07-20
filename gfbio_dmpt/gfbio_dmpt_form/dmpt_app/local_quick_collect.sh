#!/bin/bash

npm run build
#cp build/js/main.*.js ../../static/js/gfbio_dmpt_form/main.dmp_app.js
#cp build/js/main.*.js.map ../../static/js/gfbio_dmpt_form/main.dmp_app.js.map
cp build/js/main.*.js ../../static/js/gfbio_dmpt_form/
cp build/js/main.*.js.map ../../static/js/gfbio_dmpt_form/
echo yes | docker-compose -f ../../../local.yml run --rm django python manage.py collectstatic
