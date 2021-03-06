var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

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
  "gameid": Number,
  "gameextrainfo": String,
  "personaname": String,
  "personastate": Number,
  "personastateflags": Number,
  "primaryclanid": String,
  "profilestate": Number,
  "profileurl": String,
  "realname": String,
  "steamid": String,
  "playerlevel": Number,
  "viewedAt": Date,
  "timecreated": Number,
  "gamescount": Number,
  "games": [{
    "_id": false,
    "appid": Number,
    "playtime_forever": Number
  }],
  "friendsList": [String]
}, {
  timestamps: true
});

steamUserSchema.set('autoIndex', false);

// create the model for venues and expose it to our app
module.exports = mongoose.model('steamUser', steamUserSchema);
