var mongoose  = require('mongoose'),
    Schema    = mongoose.Schema;

// import schemas

// define the schema for our event model
var steamUserSchema = mongoose.Schema({
  "avatar": String,
  "avatarfull": String,
  "avatarmedium": String,
  "communityvisibilitystate": Number,
  "lastlogoff": Number,
  "loccityid": Number,
  "loccountrycode": String,
  "locstatecode": String,
  "personaname": String,
  "personastate": Number,
  "personastateflags": Number,
  "primaryclanid": String,
  "profilestate": Number,
  "profileurl": String,
  "realname": String,
  "steamid": String,
  "timecreated": Number,
  "personahistory": [{
    "personaname" : String,
    "lastseen" : Date,
    "avatarfull" : String
  }]
}, {
  timestamps : true
});

// create the model for venues and expose it to our app
module.exports = mongoose.model('steamUser', steamUserSchema);
