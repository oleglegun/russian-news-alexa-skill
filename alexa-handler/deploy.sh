#!/bin/bash

# compile typescript
tsc

# copy files
cp -r node_modules dist
cp -r config dist

# make zip
cd dist
zip -r ../lambda.zip * -q
cd -

# upload
aws lambda update-function-code --function-name RussianNewsAlexaHandler --zip-file fileb://lambda.zip

# clean
rm lambda.zip; rm -rf dist