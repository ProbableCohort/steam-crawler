var KEYS = require('./keys')

var url = 'mongodb://' + KEYS.DB_USER + ':' + KEYS.DB_PASSWORD + '@ds049651.mlab.com:49651/steam-crawler';

module.exports = {
  'url' : url
}
