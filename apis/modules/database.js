/*
Module developed by:
  ______    _     _                     ______          _
 |  ____|  | |   (_)                   |  ____|        | |
 | |__ __ _| |__  _  __ _ _ __   ___   | |__ _   _ _ __| | __ _ _ __
 |  __/ _` | '_ \| |/ _` | '_ \ / _ \  |  __| | | | '__| |/ _` | '_ \
 | | | (_| | |_) | | (_| | | | | (_) | | |  | |_| | |  | | (_| | | | |
 |_|  \__,_|_.__/|_|\__,_|_| |_|\___/  |_|   \__,_|_|  |_|\__,_|_| |_|
 
 * Database module for DigitalWelcome project
*/

/* jshint esversion: 6 */

//##########Mongo Database ##########

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/digitalwelcome', { useNewUrlParser: true } )
   .then (() => console.log('Connected to MongoDB...'))
   .catch (err => console.error("Could not connect to MongoDB"));

//##########MongoDB Schemas##########

const ObjectId = mongoose.Schema.Types.ObjectId;

const contactSchema = new mongoose.Schema({
   name: {
      firstName: {type: String, required: true},
      lastName: {type: String, required: true},
   },
   email: { type: String, required: true },
   type: { type: Number, min: 1, max: 5, required: true }, //1: Cisco employee, 2: customer, 3: partner, 4: supplier, 5: future use
   phone: { type: String },
   photo: { type: Buffer },
   date: { type: Date, default: Date.now }
});

const roomSchema = new mongoose.Schema({
   name: { type: String, required: true },
   seats: { type: Number, required: true },
   table: { type: Boolean, required: true },
   whiteboard: { type: Boolean, required: true },
   video: { type: Boolean, required: true },
   videoType: { type: String },
   photo: { type: Buffer },
   location: { type: String },
   tags: [{ type: String }]
});

const meetingSchema = new mongoose.Schema({
   date: { type: Date, required: true },
   subject: { type: String, required: true },
   hostId: { type: ObjectId, required: true },
   visitorId: { type: ObjectId, required: true },
   roomId: { type: ObjectId, required: true },
   participants: [{ type: String }],
   tags: [{ type: String }]
});

const networkAccessSchema = new mongoose.Schema({
   //checkinId: { type: ObjectId },
   hostId: { type: ObjectId, required: true },
   visitorId: { type: ObjectId, required: true },
   username: { type: String, required: true },
   date: { type: Date, default: Date.now }
});

const checkinSchema = new mongoose.Schema({
   visitorId: { type: ObjectId, required: true },
   hostId: { type: ObjectId, required: true },
   meetingId: { type: ObjectId },
   networkAccessId: { type: ObjectId },
   date: { type: Date, default: Date.now }
});

const webexDeviceSchema = new mongoose.Schema({
   name: { type: String, required: true },
   model: { type: String, required: true },
   ip: { type: String, required: true },
   username: { type: String, required: true },
   password: { type: String, required: true },
   defaultContact: { type: String },
   date: { type: Date, default: Date.now }
});

const digitalSignageSchema = new mongoose.Schema({
   name: { type: String, required: true },
   model: { type: String, required: true },
   ip: { type: String, required: true },
   username: { type: String, required: true },
   password: { type: String, required: true },
   defaultContent: { type: String },
   date: { type: Date, default: Date.now }
});

const teamsStatisticsSchema = new mongoose.Schema({
   keyword: String,
   args: Array,
   message: {
      id: String,
      roomId: String,
      roomType: String,
      text: String,
      personId: String
   },
   date: { type: Date, default: Date.now }
});

//########## MongoDB Models ##########

const Contact = mongoose.model('Contact', contactSchema);
const Room = mongoose.model('Room', roomSchema);
const Meeting = mongoose.model('Meeting', meetingSchema);
const NetworkAccess = mongoose.model('NetworkAccess', networkAccessSchema);
const Checkin = mongoose.model('Checkin', checkinSchema);
const WebexDevice = mongoose.model('WebexDevice', webexDeviceSchema);
const Signage = mongoose.model('Signage', digitalSignageSchema);

//##########   Functions   ##########

//##########   Contacts    ##########

function createContact(params) {

   //Creates a new contact information

   return new Promise ((resolve, reject) => {
      
      const contact = new Contact({
         name: {
            firstName: params.firstName,
            lastName: params.lastName,
         },
         email: params.email,
         phone: params.phone,
         picture: params.picture || null,
         type: params.type
      });
   
      contact.save((err, data) => {
         if (err) reject(err);
         else resolve(data);
      });
   });
}

function readContact(params) {

   //Returns data information about a specific contract

   return new Promise ((resolve, reject) => {
      
      if (params._id) {
         Contact.findById({ '_id': params._id }, (err, data) => {
            if (err) reject(err);
            else resolve(data);
         });
      } else if (params.firstName && params.lastName && params.type) {
         Contact.find({ 'name.firstName': { '$regex': params.firstName, '$options': 'i' }, 'name.lastName': { '$regex': params.lastName, '$options': 'i' }, 'type': params.type }, (err, data) => {
            if (err) reject(err);
            else resolve(data);
         });
      } else if (params.firstName && params.type) {
         Contact.find({ 'name.firstName': { '$regex': params.firstName, '$options': 'i' }, 'type': params.type }, (err, data) => {
            if (err) reject(err);
            else resolve(data);
         });
      } else if (params.lastName && params.type) {
         Contact.find({ 'name.lastName': { '$regex': params.lastName, '$options': 'i' }, 'type': params.type }, (err, data) => {
            if (err) reject(err);
            else resolve(data);
         });
      } else if (params.email && params.type) {
         Contact.find({ 'email': params.email, 'type': params.type }, (err, data) => {
            if (err) reject(err);
            else resolve(data);
         });
      } else if (params.firstName && params.lastName) {
         Contact.find({ 'name.firstName': { '$regex': params.firstName, '$options': 'i' }, 'name.lastName': { '$regex': params.lastName, '$options': 'i' } }, (err, data) => {
            if (err) reject(err);
            else resolve(data);
         });
      } else if (params.type) {
         Contact.find({ 'type': params.type }, (err, data) => {
            if (err) reject(err);
            else resolve(data);
         });
      } else if (params.email) {
         Contact.findOne({ 'email': params.email }, (err, data) => {
            if (err) reject(err);
            else resolve(data);
         });
      } else reject(new Error('Insuficient number of parameters.'));
   });
}

//##########     Rooms     ##########

function createRoom(params) {

   //Creates a new room

   return new Promise ((resolve, reject) => {
      
      const room = new Room({
         name: params.name,
         seats: params.seats,
         table: params.table,
         whiteboard: params.whiteboard,
         video: params.video,
         videoType: params.videoType,
         picture: params.picture || null,
         location: params.location || null,
         tags: params.tags || null
      });

      room.save((err, data) => {
         if (err) reject(err);
         else resolve(data);
      });
   });
}

function readRoom(params) {

   //Returns all data from one specific room with _id or name params or all rooms

   return new Promise ((resolve, reject) => {

      if (params._id) {
         Room.findById({ '_id': params._id }, (err, data) => {
            if (err) reject(err);
            else resolve(data);
         });
      } else if (params.name) {
         Room.findOne({ 'name': params.name }, (err, data) => {
            if (err) reject(err);
            else resolve(data);
         });
      } else if (params.size) {
         Room.find({ 'size': { "$gte": params.size } }, (err, data) => {
            if (err) reject(err);
            else resolve(data);
         });
      } else {
         Room.find({ }, (err, data) => {
            if (err) reject(err);
            else resolve(data);
         });
      }
   });
}

//##########   Meetings    ##########

function createMeeting(params) {

   //Creates a new checkin a specific checkin information or all checkin's from current day

   return new Promise((resolve, reject) => {

      const meeting = new Meeting({
         date: params.date || Date.now(), //If no date is sent, use current date.
         subject: params.subject,
         hostId: params.hostId,
         visitorId: params.visitorId,
         roomId: params.roomId,
         participants: params.participants || null,
         tags: params.tags
      });

      meeting.save((err, data) => {
         if (err) reject(err);
         else resolve(data);
      });
   });
}

function readMeeting(params) {

   //Returns a specific meeting information or all meetings from current day

   return new Promise((resolve, reject) => {

      if (params._id) {
         Meeting.findById({ '_id': params._id }, (err, data) => { resolve(data); });
      } else if (params.date && params.hostId && params.visitorId) {
         Meeting.find({ 'hostId': params.hostId, 'visitorId': params.visitorId, 'date': params.date }, (err, data) => { resolve(data); });
      } else if (params.hostId && params.visitorId) {
         Meeting.find({ 'hostId': params.hostId, 'visitorId': params.visitorId, 'date': { "$gte": dToday(), "$lt": dTomorrow() } }, (err, data) => { resolve(data); });
      } else {
         Meeting.find({ 'date': { "$gte": dToday(), "$lt": dTomorrow() } }, (err, data) => { resolve(data); });
      }
   });
}

//##########Network Access ##########

function createNetworkAccess(params) {

   //Creates a new checkin a specific checkin information or all checkin's from current day

   return new Promise((resolve, reject) => {

      const networkAccess = new NetworkAccess({
         date: params.date || Date.now(), //If no date is sent, use current date.
         //checkinId: params.checkinId,
         hostId: params.hostId,
         visitorId: params.visitorId,
         username: params.username 
      });

      networkAccess.save((err, data) => {
         if (err) reject(err);
         else resolve(data);
      });
   });
}

function readNetworkAccess(params) {

   //Returns a specific meeting information or all meetings from current day

   return new Promise((resolve, reject) => {

      if (params._id) {
         NetworkAccess.findById({ '_id': params._id }, (err, data) => { resolve(data); });
      // } else if (params.checkinId) {
      //    NetworkAccess.find({ 'checkinId': params.checkinId }, (err, data) => { resolve(data); });
      } else if (params.date && params.username) {
         NetworkAccess.find({ 'username': params.username, 'date': params.date }, (err, data) => { resolve(data); });
      } else if (params.date && params.visitorId) {
         NetworkAccess.find({ 'visitorId': params.visitorId, 'date': params.date }, (err, data) => { resolve(data); });
      } else if (params.username) {
         NetworkAccess.find({ 'username': params.username }, (err, data) => { resolve(data); });
      } else if (params.visitorId) {
         NetworkAccess.find({ 'visitorId': params.visitorId }, (err, data) => { resolve(data); });
      } else if (params.date) {
         NetworkAccess.find({ 'date': params.date }, (err, data) => { resolve(data); });
      }
   });
}

//##########   Checkins    ##########

function createCheckin(params) {

   //Creates a new checkin a specific checkin information or all checkin's from current day

   return new Promise ((resolve, reject) => {
      
      const checkin = new Checkin({
         date: params.date || Date.now(), //If no date is sent, use current date.
         visitorId: params.visitorId,
         hostId: params.hostId,
         meetingId: params.meetingId || null,
         networkAccessId: params.networkAccessId || null
      });
   
      checkin.save((err, data) => {
         if (err) reject(err);
         else resolve(data);
      });
   });
}

function readCheckin(params) {

   //Returns a specific checkin information or all checkin's from current day

   return new Promise ((resolve, reject) => {

      if (params._id) {
         Checkin.findById({ '_id': params._id }, (err, data) => { resolve(data); });
      } else if (params.visitorId)  {
         Checkin.find({ 'visitorId': params.visitorId, 'date': { "$gte": dToday(), "$lt": dTomorrow() } }, (err, data) => { resolve(data); });
      } else {
         Checkin.find({ 'date': { "$gte": dToday(), "$lt": dTomorrow() } }, (err, data) => { resolve(data); });
      }
   });
}

//##########Video Endpoint ##########

function createWebexDevice(params) {

   //Creates a new video endpoint information

   return new Promise((resolve, reject) => {

      const webexDevice = new WebexDevice({
         name: params.name,
         model: params.model,
         ip: params.ip,
         username: params.username,
         password: params.password,
         defaultContact: params.defaultContact,
         date: params.date || Date.now() //If no date is sent, use current date.
      });

      webexDevice.save((err, data) => {
         if (err) reject(err);
         else resolve(data);
      });
   });
}

function readWebexDevice(params) {

   //Returns information about specific video endpoint or all of them

   return new Promise((resolve, reject) => {

      if (params._id) {
         WebexDevice.findById({ '_id': params._id }, (err, data) => {
            if (err) reject(err);
            else resolve(data);
         });
      } else if (params.name) {
         WebexDevice.findOne({ 'name': params.name }, (err, data) => {
            if (err) reject(err);
            else resolve(data);
         });
      } else {
         WebexDevice.find({}, (err, data) => {
            if (err) reject(err);
            else resolve(data);
         });
      }
   });
}

//##########  Dig Signage  ##########

function createDigitalSignage(params) {

   //Creates a new media player information

   return new Promise((resolve, reject) => {

      const signage = new Signage({
         name: params.name,
         model: params.model,
         ip: params.ip,
         username: params.username,
         password: params.password,
         defaultContent: params.defaultContent || null,
         date: params.date || Date.now() //If no date is sent, use current date.
      });

      signage.save((err, data) => {
         if (err) reject(err);
         else resolve(data);
      });
   });
}

function readDigitalSignage(params) {

   //Returns a specific checkin information or all checkin's from current day

   return new Promise((resolve, reject) => {

      if (params._id) {
         Signage.findById({ '_id': params._id }, (err, data) => {
            if (err) reject(err);
            else resolve(data);
         });
      } else if (params.name) {
         Signage.findOne({ 'name': params.name }, (err, data) => {
            if (err) reject(err);
            else resolve(data);
         });
      } else {
         Signage.find({}, (err, data) => {
            if (err) reject(err);
            else resolve(data);
         });
      }
   });
}

//##########   Messages    ##########

async function getAllCheckinInfo(params) {

   allCheckinInfo = {};

   allCheckinInfo.checkin = await readCheckin({ "_id": params });
   allCheckinInfo.visitor = await readContact({ "_id": allCheckinInfo.checkin.visitorId });
   allCheckinInfo.host = await readContact({ "_id": allCheckinInfo.checkin.hostId });
   if (allCheckinInfo.checkin.meetingId) allCheckinInfo.meeting = await readMeeting({ "_id": allCheckinInfo.checkin.meetingId });
   if (allCheckinInfo.checkin.networkAccessId) allCheckinInfo.networkAccess = await readNetworkAccess({ "_id": allCheckinInfo.checkin.networkAccessId });

   return (allCheckinInfo);
}

async function getAllContactInfo(params) {

   allContactInfo = {};

   allContactInfo.visitor = await readContact({ "_id": params.visitorId });
   allContactInfo.host = await readContact({ "_id": params.hostId });
   
   console.log("***** ALLCONTACTINFO *****\n", allContactInfo);
   return (allContactInfo);
}

//########## Aux Functions ##########

//Returns current date in the format YYYY-MM-DD 00:00:00

function dToday() {
   let today = new Date();
   dd = today.getDate();
   mm = today.getMonth();
   yyyy = today.getFullYear();
   return new Date(yyyy, mm, dd);
}

//Returns tomorrow date in the format YYYY-MM-DD 00:00:00

function dTomorrow() {
   let today = new Date();
   dd = today.getDate() + 1;
   mm = today.getMonth();
   yyyy = today.getFullYear();
   return new Date(yyyy, mm, dd);
}

//##########    Exports    ##########

module.exports.createContact = createContact;
module.exports.readContact = readContact;
module.exports.createRoom = createRoom;
module.exports.readRoom = readRoom;
module.exports.createMeeting = createMeeting;
module.exports.readMeeting = readMeeting;
module.exports.createNetworkAccess = createNetworkAccess;
module.exports.readNetworkAccess = readNetworkAccess;
module.exports.createCheckin = createCheckin;
module.exports.readCheckin = readCheckin;
module.exports.createWebexDevice = createWebexDevice;
module.exports.readWebexDevice = readWebexDevice;
module.exports.createDigitalSignage = createDigitalSignage;
module.exports.readDigitalSignage = readDigitalSignage;
module.exports.getAllCheckinInfo = getAllCheckinInfo;
module.exports.getAllContactInfo = getAllContactInfo;
