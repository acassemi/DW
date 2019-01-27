/*
Module developed by:
  ______    _     _                     ______          _
 |  ____|  | |   (_)                   |  ____|        | |
 | |__ __ _| |__  _  __ _ _ __   ___   | |__ _   _ _ __| | __ _ _ __
 |  __/ _` | '_ \| |/ _` | '_ \ / _ \  |  __| | | | '__| |/ _` | '_ \
 | | | (_| | |_) | | (_| | | | | (_) | | |  | |_| | |  | | (_| | | | |
 |_|  \__,_|_.__/|_|\__,_|_| |_|\___/  |_|   \__,_|_|  |_|\__,_|_| |_|
 
 * SMS module for DigitalWelcome project 
*/

/* jshint esversion: 6 */

//##########  Ext Modules  ##########

// Your Account Sid and Auth Token from twilio.com/console

const config = require('config');
const accountSid = config.get('sms.TWILIO_ACCOUNT');
const authToken = config.get('sms.TWILIO_TOKEN');
const phoneNumber = config.get('sms.TWILIO_PHONE');

//##########   Functions   ##########

function sendMessage(params) {

   const client = require('twilio')(accountSid, authToken);

   return new Promise((resolve, reject) => {

      let smsOptions = {
         from: phoneNumber,
         to: "+55" + params.phone,
         body: params.message
      };

      client.messages.create(smsOptions)
         .then(message => resolve(message.status)) //resolve(message))
         .catch(error => reject(new Error(error))) //reject(message))
         .done()
   });
}

//##########    Exports    ##########

module.exports.sendMessage = sendMessage;