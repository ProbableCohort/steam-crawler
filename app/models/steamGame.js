var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

// import schemas

var schema = {
  "type": String,
  "name": String,
  "steam_appid": Number,
  "required_age": Number,
  "is_free": Boolean,
  "dlc": [Number],
  "detailed_description": String,
  "about_the_game": String,
  "short_description": String,
  "supported_languages": String,
  "header_image": String,
  "website": String,
  "pc_requirements": Schema.Types.Mixed,
  "mac_requirements": Schema.Types.Mixed,
  "linux_requirements": Schema.Types.Mixed,
  "developers": [String],
  "publishers": [String],
  "price_overview": Schema.Types.Mixed,
  "packages": [String],
  "package_groups": [Schema.Types.Mixed],
  "platforms": Schema.Types.Mixed,
  "metacritic": Schema.Types.Mixed,
  "categories": [Schema.Types.Mixed],
  "genres": [Schema.Types.Mixed],
  "screenshots": [Schema.Types.Mixed],
  "movies": [Schema.Types.Mixed],
  "recommendations": Schema.Types.Mixed,
  "release_date": Schema.Types.Mixed,
  "support_info": Schema.Types.Mixed,
  "background": String
}

// {
//   type: Schema.Types.Mixed
// }, {
//   strict: false
// }

// define the schema for our event model
var steamGameSchema = mongoose.Schema(schema, {
  timestamps: true
});

steamGameSchema.set('autoIndex', false);

// create the model for venues and expose it to our app
module.exports = mongoose.model('steamGame', steamGameSchema);
