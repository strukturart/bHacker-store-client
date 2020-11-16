#!/bin/sh 
npm run formatting:test || npm run formatting:fix 
echo "OK"
sleep 2
npm run package
echo "Done"
sleep 2
exit;