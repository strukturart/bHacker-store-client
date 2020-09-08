#!/bin/bash
set -e #fail on error

mkdir -p ./build/tmp

rm ./build/tmp/application.zip || true
rm ./build/bhacker-store.zip || true

echo "{\"version\": 1,\"manifestURL\":\"app://bHacker-Store.org/manifest.webapp\"}" > ./build/tmp/metadata.json

cd build/tmp

zip -jqr application.zip ../app

cd ..

zip -jqr bhacker-store.zip tmp

echo "Created bhacker-store.zip"