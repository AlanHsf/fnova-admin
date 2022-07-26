#!/bin/sh
git pull
ng build --prod

rm -r /var/www/ccg.think2009.com/ccg/dist/nglrrr/*

cp -rf dist /var/www/ccg.think2009.com/ccg/

chown -R www-data:www-data /var/www/ccg.think2009.com/
