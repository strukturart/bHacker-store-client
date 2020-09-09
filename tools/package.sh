#!/bin/bash
set -e #fail on error

mkdir -p ./build/tmp

rm ./build/tmp/application.zip || true
rm ./build/bhacker-store.zip || true

echo "{\"version\": 1,\"manifestURL\":\"app://bHacker-Store.org/manifest.webapp\"}" > ./build/tmp/metadata.json


cd build/app
zip -qr ../tmp/application.zip .

cd ../tmp
zip -qr ../bhacker-store.zip .

echo "Created bhacker-store.zip"