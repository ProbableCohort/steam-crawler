var KEYS = require('../private/keys');

var url = 'mongodb://' + KEYS.DB_V1.DB_USER + ':' + KEYS.DB_V1.DB_PASSWORD + '@' + KEYS.DB_V1.DB_URI;
var url_v2 = 'mongodb://' + KEYS.DB_V2.DB_USER + ':' + KEYS.DB_V2.DB_PASSWORD + '@' + KEYS.DB_V2.DB_URI;

module.exports = {
  'url' : url
}
