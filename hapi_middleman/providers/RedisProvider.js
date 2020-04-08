const Redis = require('redis');


  class RedisProvider {

    static redisClient = null;

    static connect = (redisServerConfig) => {
        console.log("Provider now trying to connect to Redis at this config ..."+ JSON.stringify(redisServerConfig));
        RedisProvider.redisClient = Redis.createClient(redisServerConfig);
        RedisProvider.redisClient.on('ready', function() {
           console.log("RedisClient is ready");
         });
    
         RedisProvider.redisClient.on('connect', function() {
           console.log('RedisProvider successfully connected to Redis server');
         }); 
      
    }
  
    static read = (hashkey, field) => {
    return new Promise(function (resolve, reject) {
        console.log("RedisService.read() invoked...now doing an async REDIS hget operation");
        RedisProvider.redisClient.hget(hashkey, field, function(err,result){
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
   }


   static store = (hashkey, fieldname, fieldvalue) => {
    return new Promise(function (resolve, reject) {
        if(typeof fieldvalue == 'undefined') {
            return reject('  RedisService: The fieldvalue is empty/undefined');
        }
        RedisProvider.redisClient.hmset(hashkey, fieldname, fieldvalue, function(err, result){
            if (err) {
                return reject(err);
            }
            console.log("Inside the RedisService, redis returns on store success, this result: "+result);
            return resolve(result);
        });
    });
  }


  }
  
  module.exports = RedisProvider;


 