# AWS Step Function Sample State Machine with MongoDB Atlas

This repository provides the source code of 3 [AWS Lambda](https://aws.amazon.com/lambda/) functions written in Node.js and combined into one AWS Step Function State Machine to illustrate the workflow and orchestration capabilities of [AWS Step Functions](https://aws.amazon.com/step-functions).

![AWS Step Functions Visual Workflow](https://webassets.mongodb.com/_com_assets/cms/Step_Functions_Management_Console-wymgq6t8yf.png)

## Software Requirements

In order to use this repository, you will need:

1. A local computer with [Node.js](https://nodejs.org)
2. An [Amazon Web Services](https://aws.amazon.com/) account
3. A [MongoDB Atlas](https://www.mongodb.com/atlas?jmp=adref) cluster (see this [video](https://youtu.be/_d8CBOtadRA) to get started with a free M0 cluster)
4. A [Twilio](https://www.twilio.com/) account. A trial account is fine, but you will need to add the phone numbers you'd like to send text messages to on the [Verified Called IDs page](https://www.twilio.com/console/phone-numbers/verified).

__Note__: this repository was built and tested on Mac OS X Sierra and Node.js 6.9.4

## Setup

### MongoDB Atlas

Since this Step Function relies on an existing dataset of restaurants, you must first import a sample dataset to your MongoDB Atlas cluster:

1. Customize the [import.sh](/dataset/import.sh) script to import the [restaurants.json](/dataset/restaurants.json) file.
1. Alternatively, you can download [this dataset](https://raw.githubusercontent.com/mongodb/docs-assets/primer-dataset/primer-dataset.json) (also used in the [MongoDB Shell Tutorial](https://docs.mongodb.com/getting-started/shell/import-data)) and follow the next steps below.
1. Edit the following command line by replacing the ``$`` parameters with your own values: 
``mongoimport --host $ATLAS_CLUSTER_URI --ssl -u $ATLAS_ADMIN -p $ATLAS_PWD --authenticationDatabase admin --db travel --collection restaurants --drop --file primer-dataset.json``
1. Run your customized ``mongoimport`` command above to import the dataset to your Atlas cluster.
1. (Optional) verify with [MongoDB Compass](https://www.mongodb.com/download-center?jmp=adref#compass) that your ``restaurants`` collection was properly imported. The [MongoDB Compass with Atlas](https://www.mongodb.com/blog/post/your-mongodb-atlas-toolkit-logging-into-mongodb-atlas-with-compass?jmp=adref) blog post might help you configure Compass with MongoDB Atlas.

### Amazon Web Services
This repository is made of the following Lambda functions:

- A **[GetRestaurants](https://github.com/raphaellondner-mongodb/aws-stepfunctions-samples/tree/master/restaurants)** function that queries a collection of restaurants stored in a [MongoDB Atlas](https://www.mongodb.com/atlas?jmp=adref) database.
- A **[CountItems](https://github.com/raphaellondner-mongodb/aws-stepfunctions-samples/tree/master/countitems)** helper function whose role is solely to count the number of items in an array.
- A **[SendBySMS](https://github.com/raphaellondner-mongodb/aws-stepfunctions-samples/tree/master/sms)** function that sends a text message using [SMS by Twilio](https://www.twilio.com/sms).
- A **[SendByEmail](https://github.com/raphaellondner-mongodb/aws-stepfunctions-samples/tree/master/email)** function that sends an email using [AWS Simple Email Service](https://aws.amazon.com/ses).

The __Common setup tasks__ below lists the tasks that you must perform for each of the 3 Lambda functions.

The __Function-specific configuration tasks__ section below lists the tasks that are specific to each Lambda function.

#### Common setup tasks

For __each__ of the 4 Lambda functions listed above (except the CountItems function), please perform the following tasks:

1. Navigate to the root folder of the Lambda function (i.e. _restaurants_, _email_ and _sms_) and run ``npm install`` from a Terminal console to restore the required Node.js dependencies.
1. Run the ``zip.sh``  script to zip all the files required by AWS Lambda (you might have to run ``chmod 744 zip.sh`` first to allow the ``zip.sh`` file to run). This will generate an ``archive.zip`` file in every function folder.
1. Create a new AWS Lambda function and use the ``archive.zip`` file as the *Upload a .ZIP file* **Code entry type**. Refer to [this AWS Lambda tutorial](https://www.mongodb.com/blog/post/serverless-development-with-nodejs-aws-lambda-mongodb-atlas) for additional help on AWS Lambda development and deployment.
4. Increase the timeout to 5 or 6s (optional but strongly recommended)

#### Function-specific configuration tasks

Here are the specific configuration tasks you must make for each Lambda function:

- **GetRestaurants** function:
  - Add a ``MONGODB_ATLAS_CLUSTER_URI`` environment variable with the value of your MongoDB Atlas connection string (see [this blog post](https://www.mongodb.com/blog/post/serverless-development-with-nodejs-aws-lambda-mongodb-atlas) for further details).
  - Copy/paste the contents of the [``event.json``](https://github.com/rlondner/aws-stepfunctions-samples/blob/master/restaurants/event.json) file in the Lambda *Input test event* window.
  - Note how the Node.js code is using [performance optimization enhancements](http://bit.ly/lambdaperf) to speed up queries after the first call to the Lambda function.
- **CountItems** function:
  - Create a blank Lambda function and copy/paste the content of the [``index.js``](https://github.com/rlondner/aws-stepfunctions-samples/blob/master/countitems/index.js) file into the AWS Lambda code editor.
  - Copy/paste the contents of the [``event.json``](https://github.com/rlondner/aws-stepfunctions-samples/blob/master/countitems/index.js) file in the Lambda *Input test event* window.
- **SendBySMS** function:
  - Add a ``TWILIO_ACCOUNT_SID`` environment variable with the value of your Twilio account ID.
  - Add a ``TWILIO_AUTH_TOKEN`` environment variable with the value of your Twilio Auth Token.
  - Add a ``TWILIO_PHONE_NUMBER`` environment variable with the value of your Twilio Phone Number.
  - Copy/paste the contents of the [``event.json``](https://github.com/rlondner/aws-stepfunctions-samples/blob/master/sms/event.json) file in the Lambda *Input test event* window.
- **SendByEmail** function:
  - You must first set up [AWS Simple Email Service](https://aws.amazon.com/ses/) in order for it to accept your sender email address as well as the recipient adress(es) you are planning to use.
  - Create an S3 bucket and in that S3 bucket, create a *Templates* folder. Upload the [__*Templates/Restaurants.html*__](https://github.com/rlondner/aws-stepfunctions-samples/blob/master/email/Templates/Restaurants.html) file into this *Templates* bucket.
  - Add an ``S3_BUCKET`` environment variable with the value of the S3 bucket you created in the previous step.
  - Add an ``FROM_ADDRESS`` environment variable with the value of SES-verified email address you want to use as your sender email address.
  - Copy/paste the [``event.json``](https://github.com/rlondner/aws-stepfunctions-samples/blob/master/email/event.json) file as your test event input and at least update the ``emailTo`` attribute with an SES-verified email address (and potentially the ``firstnameTo`` attribute too).
  - Make sure the IAM role you use to run your Lambda function includes the following permissions (created as an inline or managed policy):

  ```json
  {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ses:SendEmail"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject"
            ],
            "Resource": "*"
        }
    ]
  }
  ```

### AWS Step Functions

Once you have successfully created and tested the 4 Lambda functions above, head over (or go back) to the [AWS Step Functions setup and code walkthrough](http://bit.ly/mdbawssf) for the last mile!
