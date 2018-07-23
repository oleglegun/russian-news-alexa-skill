#!/bin/bash

bash ./deploy.sh

aws lambda publish-version --function-name RussianNewsAlexaHandler
echo 'publish done'