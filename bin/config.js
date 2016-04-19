/**
 * Created by robjo on 01/04/2016.
 * 
 * holds the environment configs
 */
var config = {};
config.db={};
config.logger={};
config.gmaps={};

//database config
config.db.type = 'couch';
config.db.ip = '127.0.0.1';
config.db.port = '5984';
config.db.name = 'events';

//logger config
config.logger.level = '[:date] :remote-addr :method :url HTTP/:http-version :status :response-time ms :res[content-length] :referrer';
config.logger.rotationFrequency = 'daily';
config.logger.dateFormat = 'YYYYMMDD';
config.logger.verbose = false;
config.logger.sentrydsn = 'https://c6654bdfd4e94ba184b33552ee2ed21d:d0078df30b314e5b8aa3cfd78b88aec3@app.getsentry.com/74179';

//Google Maps
config.gmaps.key = 'AIzaSyANkUG9Q7YKNV_eTBTM0iBPjLOMbSU6JsY';
config.gmaps.version = '3';

module.exports = config;