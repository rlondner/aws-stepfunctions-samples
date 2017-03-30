'use strict'

var cfg = require("./config.js")
var Mustache = require('mustache');

exports.handler = (event, context, callback) => {

  var twilioAccoundSid = process.env.TWILIO_ACCOUNT_SID;
  var twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
  var twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

  var client = require('twilio')(
    twilioAccoundSid,
    twilioAuthToken
  );

var message = Mustache.render(cfg.smsTemplate, event);
console.log(message);

  client.messages.create({
    from: twilioPhoneNumber,
    to: event.phoneTo,
    body: message
  }, function (err, message) {
    if (err) {
      console.error(err.message);
      callback(err);
    }
    else {
      callback(null, "An SMS was properly sent to " + event.phoneTo);
    }
  });
  
};