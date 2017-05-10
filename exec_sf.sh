#!/bin/bash
# Courtesy of Paul Sears, Amazon Web Services
 
EMAIL="test@example.com"
PHONE="+15555555555"
NAME="TestUser"
STATEARN="arn:aws:states:us-west-2:ACCOUNT_ID:stateMachine:WhatsThisRestaurantAgain"
API="https://API_GATEWAY_PREFIX.execute-api.us-west-2.amazonaws.com/STAGE_NAME/execution"
STARTS=$1
CU=$2
ZIP=$3
 
EXECUTIONNAME=`uuidgen`
 
curl -X POST -d '{"input": "{ \"startsWith\": \"'$STARTS'\", \"cuisine\": \"'$CU'\", \"zipcode\": \"'$ZIP'\", \"phoneTo\": \"'$PHONE'\", \"firstnameTo\": \"'$NAME'\", \"emailTo\": \"'$EMAIL'\", \"subject\": \"List of restaurants for {{firstnameTo}}\" }","name": "'.$EXECUTIONNAME'","stateMachineArn": "'$STATEARN'"}' $API
 