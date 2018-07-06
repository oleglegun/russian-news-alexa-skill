#!/bin/bash

# compile typescript
tsc

# copy files
cp -r node_modules dist
cp -r config dist

# remove aws-sdk
# rm -rf dist/node_modules/aws-sdk

# make zip
cd dist
zip -r ../lambda.zip *
cd -

# upload
aws lambda update-function-code --function-name RussianNewsAlexaHandler --zip-file fileb://lambda.zip

# clean
rm lambda.zip; rm -rf dist