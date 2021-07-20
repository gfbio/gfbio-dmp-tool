#!/bin/bash

npm run build
cp build/js/main.*.js ../../static/js/<APP_NAME>/main.<APP_NAME>.js
cp build/js/main.*.js.map ../../static/js/<APP_NAME>/main.<APP_NAME>.js.map
echo yes | docker-compose -f ../../../local.yml run --rm django python manage.py collectstatic
