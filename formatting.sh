#!/bin/sh 
npm run formatting:test || npm run formatting:fix || npm run package
