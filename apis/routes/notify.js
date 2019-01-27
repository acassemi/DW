/*
Module developed by:
  ______    _     _                     ______          _
 |  ____|  | |   (_)                   |  ____|        | |
 | |__ __ _| |__  _  __ _ _ __   ___   | |__ _   _ _ __| | __ _ _ __
 |  __/ _` | '_ \| |/ _` | '_ \ / _ \  |  __| | | | '__| |/ _` | '_ \
 | | | (_| | |_) | | (_| | | | | (_) | | |  | |_| | |  | | (_| | | | |
 |_|  \__,_|_.__/|_|\__,_|_| |_|\___/  |_|   \__,_|_|  |_|\__,_|_| |_|

 * RESTfull API's for Digital Welcome Project
*/

/* jshint esversion: 6 */

//##########  Ext Modules  ##########

const validation = require('../modules/validation');
const database = require('../modules/database');
const notify = require('../modules/notify');
const message = require('../modules/messages');
const webexTeams = require('../modules/webexTeams');
const email = require('../modules/email');
const sms = require('../modules/sms');
const express = require('express');
const router = express.Router();

//########## Error Descr H ##########

const errDescHeader = '--- Error(s) Description ---  \n';

//########## Teams, Email, ##########
//########## SMS Messaging ##########

router.post('/checkin/:id', (req, res) => {

   validation.notifyCheckinParams(req.body)
      .then(() => database.getAllCheckinInfo(req.params.id))
      .then((allCheckinInfo) => notify.notifyAllTypes(allCheckinInfo))
      .then((data) => res.status(200).send(data))
      .catch((err) => res.status(400).send(errDescHeader + err));
})

router.post('/teams', (req, res) => {

   validation.webexTeamsParams(req.body)
      .then(val1 => webexTeams.sendMessage(req.body))
      .then(data => res.status(200).send(data))
      .catch(err => res.status(400).send(errDescHeader + err));
});

router.post('/email', (req, res) => {

   validation.emailParams(req.body)
      .then(val1 => email.sendMessage(req.body))
      .then(data => res.status(200).send(data))
      .catch(err => res.status(400).send(errDescHeader + err));
});

router.post('/sms', (req, res) => {

   validation.smsParams(req.body)
      .then(val1 => sms.sendMessage(req.body))
      .then(data => res.status(200).send(data))
      .catch(err => res.status(400).send(errDescHeader + err));
});

module.exports = router;