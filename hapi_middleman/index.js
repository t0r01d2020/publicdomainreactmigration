//THESE ENVIRONMENT VARS MUST BE DEFINED ON THE HOST WHICH RUNS THIS SERVER:
//   client_id  : Its OAuth2 ClientID
//   client_secret:  Its OAuth2 ClientSecret

//AND, THESE ENVIRONMENT VARS ARE OPTIONAL: THEY CAN BE SET TO OVERRIDE DEFAULT, HARDCODED VALUES:
//    middleman_logging_dir  : THE DIRECTORY WHERE IT SHOULD WRITE ITS LOG FILES
//    middleman_redis_host   : IP address or Hostname of the Redis Server
//    middleman_redis_port   : Port number of the Redis Server


// Happy things
const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Joi = require('@hapi/joi');
const Hoek = require('@hapi/hoek');
// Some built-in modules
const fs = require('fs');
const Path = require('path');
const Log4js = require('log4js');
const Good = require('@hapi/good');
const GoodConsole = require('good-console');
const Swagger = require('hapi-swaggered');
const Bell = require('bell');
const AuthCookie = require('hapi-auth-cookie');
const Redis = require('redis');
let redisClient=null;
let redisService= {};
let logsDirPath = './__logs/';  //default value, may be replaced by env config value
let oauthClientId=null;
let oauthClientSecret=null;


// SET STATIC CONTENT PATH FROM CONFIGURATION
const DEFAULT_STATIC_CONTENT_PATH = './build';
const DEFAULT_CONTEXT_PATH = '/';
const env = process.env;

// DEPLOYMENT-SPECIFIC OPTIONS
const static_content_path = env.STATIC_CONTENT_PATH || DEFAULT_STATIC_CONTENT_PATH;
const context_path = env.CONTEXT_PATH || DEFAULT_CONTEXT_PATH;

const LOGGER = Log4js.getLogger();
LOGGER.level = 'debug';

redisService.read = function(hashkey, field){
  return new Promise(function (resolve, reject) {
      LOGGER.info("RedisService.read() invoked...now doing an async REDIS hget operation");
      redisClient.hget(hashkey, field, function(err,result){
          if (err) {
              return reject(err);
          }
          return resolve(result);
      });
  });

};

redisService.store = function(hashkey, fieldname, fieldvalue){
  return new Promise(function (resolve, reject) {
      if(typeof fieldvalue == 'undefined') {
          return reject('  RedisService: The fieldvalue is empty/undefined');
      }
      redisClient.hmset(hashkey, fieldname, fieldvalue, function(err, result){
          if (err) {
              return reject(err);
          }
          LOGGER.info("Inside the RedisService, redis returns on store success, this result: "+result);
          return resolve(result);
      });
  });
};


LOGGER.info("Now reading env config from environment...");
    var envLoggingDir = env.middleman_logging_dir;
    oauthClientId = env.client_id;
    oauthClientSecret = env.client_secret;
    const REDIS_HOST = env.middleman_redis_host || '127.0.0.1';
    const REDIS_PORT = env.middleman_redis_port || '6379';

    if(envLoggingDir != null && envLoggingDir != ""){
      LOGGER.info("There is an environment-specific logging dir configured: "+envLoggingDir);
      logsDirPath = envLoggingDir;//overwrite default value w. env-config value
    }
    LOGGER.info("The configured oauth client_id is: "+oauthClientId);
    LOGGER.info("Using a Redis-config of: { host: "+REDIS_HOST+", port: "+REDIS_PORT+" }");


let logFileName = 'middleman_hapi_log.log';
let fullLogfilePath = logsDirPath + logFileName;


// Basic server options
const serverOptions = {
  host: '0.0.0.0',
  port: 3210,
  routes: {
    files: {
      relativeTo: Path.join(__dirname, static_content_path)
    }
  }
};

const pluginsList = [
  Inert,
  {
    plugin: AuthCookie,
    options: {
      password: 'fake-placeholder-temp', //Password used for encryption
      cookie: 'sitepoint-auth', // Name of cookie to set
      isSecure: false
  }
  },
  {
    plugin: Bell,
    options: {
      provider: 'unknown-placeholder-our-oidc-server',
      password: 'fake-placeholder-temp', //Password used for encryption
      clientId: 'placeholder-for-client-id',// eventually will pass this in through config
      clientSecret: 'placeholder-for-secret',//eventually will store this elsewhere, and load it
      isSecure: false
    }
  },
  {
    plugin: Good,
    options: {
      ops: {
        interval: 20000
      },
      reporters: {
        console: [{
          module: 'good-squeeze',
          name: 'Squeeze',
          args: [{
            log: '*',
            response: '*'
          }]
        },
        {
          module: 'good-console'
        }, 'stdout'
        ]
      }
    }
  },
  {
    plugin: Swagger,
    options: {
      tags: {
        'foobar/test': 'Example foobar description'
      },
      info: {
        title: 'CWP Middleman',
        description: 'Powered by Swagger',
        version: '1.0'
      }
    }
  }
];

// Hapi Server Instance
const server = new Hapi.Server(serverOptions);

const connectMiddlemanToRedis = () => {
  LOGGER.info("Now trying to connect to Redis...");
  redisClient = Redis.createClient(
    {
      host      : REDIS_HOST,
      port      : REDIS_PORT  // replace with the port of YOUR local Redis installation
    });
  redisClient.on('ready', function() {
  LOGGER.info("RedisClient is ready");
   });


   redisClient.on('connect', function() {
    LOGGER.info('Connected to Redis server');
   }); 


};

// Start up the Hapi Server Machine
const startUpTheMachine = async () => {

  // register the final plugin list (routes) based on application access
  await server.register(pluginsList);


  //static content (ReactJS SPA client) route handling
  server.route({
    method: 'GET',
    path: `${context_path}{param*}`,
    config: {
      handler: {
        directory: {
          path: `.`,
          redirectToSlash: true
        }
      }
    }
  });

  server.route({
    path: '/',
    method: 'GET',
    handler: (request, h) => {
      return '                           Hapi Wednesday From Our Hapi Middleman Server!';
    }
  });

  /**
   * OAuth callback can POST a new access token here, to save it to Redis, associate it to a username
   */
  server.route({
    path: '/user/auth/saveoidctoken',
    method: 'POST',
    handler: (request, h) => {
      let cookieHashkey = request.payload.cookie_hashkey;
      if(cookieHashkey == null || cookieHashkey == ""){
        console.error("Received a bad request to saveoidctoken: username param was missing!");
        return 'Error: the username parameter is required.';
      }
      LOGGER.info("Received this posted cookie Hashkey: "+cookieHashkey);
      let postedtoken = request.payload.oauth_access_token;
      if(postedtoken == null || postedtoken == ''){
        console.error("There was no token posted in the request!");
        return 'Error: there was no oidc token posted in the request';
      }
      let storeResponse=null;
       //now, save this tuple to the Redis database 
      storeResponse = redisService.store(cookieHashkey, "accesstoken", postedtoken);
      return storeResponse;
    }
  });

  /**
   * Use the hashkey from the Session cookie to retrieve the stored OAuth2 access token
   * This route presumes you have a Redis Server running that has an access token Hashmap indexed by 
   * the values contained in fake-cookie-placeholder.
   * It also assumes the Request bears a session-scoped hashkey from the cookie.
   */
  server.route({
    path: '/user/auth/get_user_accesstoken',
    method: 'GET',
    handler: async (request, h) => {
      const cookiePlaceholder = request.headers['fake-cookie-placeholder'];
      if(cookiePlaceholder == null || cookiePlaceholder == ""){
        return 'Required cookie missing';
      }
     let promiseResult=null;
     promiseResult = redisService.read(cookiePlaceholder, "accesstoken");  //The Promise lives inside redisService
     LOGGER.info("Got a result from the new RedisService (promise): "+promiseResult);
     return promiseResult; 
    }
  });


  // necessary to reroute for 401 errr (as it happens internally)
  server.ext('onPreResponse', (req, h) => {
    const { response } = req;
    //LOGGER.info('server >> onPreResponse >> hook for catching errrrs');
    LOGGER.info("Middleman received a request. ");
    LOGGER.info('headers are >> ');
    LOGGER.info(req.headers);

    if (response.isBoom && response.output.statusCode === 401) {
      LOGGER.warn(response);
      LOGGER.warn('onPreResponse >> returning 401');
      return h.response('ERROR - 404');
    }

    if (response.isBoom && response.output.statusCode === 404) {
      LOGGER.warn(response);
      LOGGER.warn('onPreResponse >> returning 404');
      return h.response('ERROR - 404');
    }

    return h.continue;
  });

  await server.start();
  LOGGER.info('The machine is running:', JSON.stringify(server.info, null, 1));

};


// start up the HapiJS server
startUpTheMachine()
  .then(() => {
    // list out all urls/methods available
    LOGGER.info('\n>> routes available >>');
    server.table().forEach((route) => LOGGER.info(`${route.method}\t${route.path}`));
    LOGGER.info("Now trying to connect the Middleman to Redis")
    connectMiddlemanToRedis();

    if(oauthClientId == null || oauthClientId == ""){
      const err = "The client_id is not configured in the environment variables! This is needed";
     LOGGER.error(err);
      throw(err);
    }

    if(oauthClientSecret == null || oauthClientSecret == ""){
      const err = "the client_secret is not configured in the environment variables. It must be!";
      LOGGER.error(err);
      throw(err);
    }

  })
  .catch(err => {
    LOGGER.error('Error starting the machine! :^( ', err);
  });

