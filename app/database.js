var KEYS = require('./keys')

var url = 'mongodb://' + KEYS.DB_USER + ':' + KEYS.DB_PASSWORD + '@' + KEYS.DB_URI;

module.exports = {
  'url' : url
}
