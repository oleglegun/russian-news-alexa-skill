#!/bin/bash

# compile typescript
tsc
echo 'tsc done'

# copy files
cp -r node_modules dist
echo 'copy files done'

# remove aws-sdk
rm -rf dist/node_modules/aws-sdk
echo 'remove aws-sdk done'

# make zip
cd dist
zip -r ../lambda.zip * -q
cd - > /dev/null
echo 'make zip done'

# upload
aws lambda update-function-code --function-name RussianNewsAlexaHandler --zip-file fileb://lambda.zip

# clean
rm lambda.zip; rm -rf dist
echo 'clean done'