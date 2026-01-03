#!/usr/bin/env bash

echo Taking latest pull ....
git pull

echo Doing the angular build ....
#sudo ng build --prod --base-href https://uat.inexchange.co.in/ --deployUrl=/
sudo ng build --prod --base-href http://uat.alwrite.in/ --deployUrl=/
