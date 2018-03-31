'use strict'

var aws = require('aws-sdk');
var Mustache = require('mustache');

exports.handler = function (event, context, callback) {

    console.log("Event: " + JSON.stringify(event));
    var aws_region = process.env['AWS_DEFAULT_REGION'];
    if(aws_region == undefined) {
        aws_region = process.env['AWS_REGION_LOCAL'];
    }
    var s3_bucket = process.env['S3_BUCKET'];
    var from_address = process.env['FROM_ADDRESS'];
    
    aws.config.update({ region: aws_region });
    
    var config = require('./config.js');

    console.log('Loading template from ' + config.templateKey + ' in ' + s3_bucket);

    var s3 = new aws.S3();
    // Read the template file from S3
    s3.getObject({
        Bucket: s3_bucket,
        Key: config.templateKey
    }, function (err, data) {
        if (err) {
            // Error
            console.log(err, err.stack);
            context.fail('Internal Error: Failed to load template from s3.')
        } else {
            var templateBody = data.Body.toString();
            
            //generate dynamic content based on Mustache tags
            var subject = Mustache.render(event.subject, event);
            var message = Mustache.render(templateBody, event);


            var params = {
                Destination: {
                    ToAddresses: [
                        event.emailTo
                    ]
                },
                Message: {
                    Subject: {
                        Data: subject,
                        Charset: 'UTF-8'
                    }
                },
                Source: from_address,
                ReplyToAddresses: [
                    from_address
                ]
            };

            var fileExtension = config.templateKey.split(".").pop();
            if (fileExtension.toLowerCase() == 'html') {
                params.Message.Body = {
                    Html: {
                        Data: message,
                        Charset: 'UTF-8'
                    }
                };
            } else if (fileExtension.toLowerCase() == 'txt') {
                params.Message.Body = {
                    Text: {
                        Data: message,
                        Charset: 'UTF-8'
                    }
                };
            } else {
                context.fail('Internal Error: Unrecognized template file extension: ' + fileExtension);
                return;
            }

            var ses = new aws.SES();
               
            // Send the email           
            ses.sendEmail(params, function (err, data) {
                if (err) {
                    console.log(err, err.stack);
                    callback('Internal Error: The email could not be sent. ' + err.message);
                } else {
                    console.log(data);           // successful response
                    callback(null, 'The email was successfully sent to ' + event.emailTo);
                }
            });  
        }
    });
};