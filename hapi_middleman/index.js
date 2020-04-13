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
const Boom = require('@hapi/boom');
// Some built-in modules
const fs = require('fs');
const Path = require('path');
const Good = require('@hapi/good');
const GoodConsole = require('good-console');
const log4js = require('log4js');
const Swagger = require('hapi-swaggered');
const Bell = require('bell');
const AuthCookie = require('hapi-auth-cookie');
const hash = require('object-hash');
const RedisProvider = require('./providers/RedisProvider');

// configuaration variable helper
const config = require('./config/configProvider').config();

// custom provider for Bell
Bell.providers['oidcOGProvider'] = require('./authProviders/oidcProvider');

// api providers (actually will most likely be embedded in various routes)
const { 
  getUserDetailsByEmailId
 } = require('./apiProviders/getUserDetailsByEmailId');

 //default value, may be replaced by env config value
const defaultLogsDirPath = './__logs/'; 
let logsDirPath = defaultLogsDirPath;




// SET STATIC CONTENT PATH FROM CONFIGURATION
const DEFAULT_STATIC_CONTENT_PATH = './build';
const DEFAULT_CONTEXT_PATH = '/';

// DEPLOYMENT-SPECIFIC OPTIONS
const static_content_path = config.STATIC_CONTENT_PATH || DEFAULT_STATIC_CONTENT_PATH;
const context_path = config.CONTEXT_PATH || DEFAULT_CONTEXT_PATH;

console.log("Now reading env config from environment...");
var envLoggingDir = config.middleman_logging_dir;
const REDIS_HOST = config.middleman_redis_host || '127.0.0.1';
const REDIS_PORT = config.middleman_redis_port || '6379';

if(envLoggingDir){
  console.log("There is an environment-specific logging dir configured: "+envLoggingDir);
  logsDirPath = envLoggingDir;//overwrite default value w. env-config value
}

let logFileName = 'middleman_hapi_log_'+(new Date().getTime())+'.log';
let fullLogfilePath = logsDirPath + logFileName;
log4js.configure({
  appenders: {
    out: { type: 'stdout' },
    app: { type: 'file', filename: fullLogfilePath }
  },
  categories: {
    default: { appenders: [ 'out', 'app' ], level: 'debug', enableCallStack: true }
  }
});
const logger = log4js.getLogger('default');

logger.info("Using a Redis-config of: { host: "+REDIS_HOST+", port: "+REDIS_PORT+" }");

// Basic server options
const serverOptions = {
  host: config.DEPLOYMENT_BASE,
  port: config.DEPLOYMENT_PORT,
  // required for Inert plugin static content
  routes: {
    files: {
      relativeTo: Path.join(__dirname, static_content_path)
    }
  }
};

// list of plugins
const pluginsList = [
  Inert,
  {
    plugin: AuthCookie
  },
  {
    plugin: Bell
  },
  {
    plugin: Good,
    options: {
      ops: {
        interval: 20000
      },
      reporters: {
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
  redisConfig = {
    host      : REDIS_HOST,
    port      : REDIS_PORT  // replace with the port of YOUR local Redis installation
  };
  RedisProvider.connect(redisConfig);
};

const getToken = (id, fieldname) => {
  return RedisProvider.read(id, fieldname);
};

// Start up the Hapi Server Machine
const startUpTheMachine = async () => {

  // register the final plugin list (routes) based on application access
await server.register(pluginsList);

  // oidc provider authorization settings
server.auth.strategy('oidcOGProvider', 'bell', {
  provider: 'oidcOGProvider',
    password: config.OIDC_SESSION_PASSWORD,
    isSecure: false,
    clientId  : config.OIDC_CLIENT_ID,
    clientSecret : config.OIDC_CLIENT_SECRET
  });

  // login route for OIDC!
  server.route({
    method: 'GET',
    path: '/login',
    handler: (request, h) => {
      logger.info('GET /login');
      let isAuthorized = request.auth.isAuthenticated;
      if(isAuthorized){
        logger.info('isAuthorized!!');
        let credentials = request.auth.credentials;
        let artifacts = request.auth.artifacts;
        let userProfile = request.auth.credentials.profile;
        logger.info(JSON.stringify(userProfile));
        const sessionStartDate = new Date().getTime();
        const profileToStore = {
          token: credentials.token,
          refreshToken: credentials.refreshToken,
          token_expires_in: credentials.expiresIn,
          access_token: artifacts.access_token,
          access_token_expires_in: artifacts.expires_in,
          id_token: artifacts.id_token,
          id_expires_in: artifacts.id_expires_in,
          token_type: artifacts.token_type,
          refresh_token: artifacts.refresh_token,
          refresh_expires_in: artifacts.refresh_expires_in,
          firstName: userProfile.firstName,
          lastName: userProfile.lastName,
          sub: userProfile.sub,
          email: userProfile.email,
          email_verified: userProfile.email_verified,
          updated_at: userProfile.updated_at,
          access_token: artifacts.access_token,
          access_token_expires_in: artifacts.expires_in,
          session_start_date: sessionStartDate
        };

        // items for cookie object proper
        const cookieObjectToSet = {
          firstName: userProfile.firstName,
          lastName: userProfile.lastName,
          sub: userProfile.sub,
          email: userProfile.email,
          email_verified: userProfile.email_verified,
          updated_at: userProfile.updated_at,
          session_start_date: sessionStartDate
        };

        const generatedHash = hash(cookieObjectToSet);
        cookieObjectToSet['hashId'] = generatedHash;

        request.cookieAuth.set({ ...cookieObjectToSet });

        // now store tokeny stuff in redis
        RedisProvider.storeObject(generatedHash, profileToStore);

        let next = request.auth.credentials.query && request.auth.credentials.query.next;
        if(next){
          return h.redirect(next);
        }

        logger.warn('No post-authorization route set, go to default.');
        return h.redirect('/');
      }

      return h.response('UNABLE TO AUTHENTICATE.\nBoo!\nSeriously.');
    },
    options:{
      auth: 'oidcOGProvider'
    }
  });

  // define static content handling (React SPA)
  /* turn this off for now
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
  */

  // cookie session configuration
  server.auth.strategy( 'session', 'cookie', { 
    cookie: {
      name: config.SESSION_COOKIE_NAME,
      // Don't forget to change it to your own secret password!
      password: config.SESSION_COOKIE_PASSWORD,
      // For working via HTTP in localhost
      isSecure: false, 
      isHttpOnly: true,
      isSameSite: 'Strict'
    },
    redirectTo: '/login',
    appendNext: true
  });
  

  // session is set as the default authorization method, all routes defined after this are subject to this
  server.auth.default('session');

  // routes protected by various authorization mechanisms
  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: (request, h) => {
      
      let { firstName='', lastName='', email='', hashId } = request.auth.credentials;

      return getToken(hashId, 'access_token')
        .then( access_token => {
          return getUserDetailsByEmailId({ access_token, email } )
          .then( responseData => {
            let stringifiedData = JSON.stringify(responseData, null, 1);
            return h.response(
              '<div>' + `Hooray ${firstName} ${lastName}!<br/>You made it.<br/>Here are the details for ${email}.<br/>` + '</div><br/><pre>' + stringifiedData + '</pre>'
            );
          })
          .catch(err => {
            return h.response('<div>' + `Boo ${firstName} ${lastName}!<br/><br/>Not able to obtain details for ${email}.<br/>` + '</div>');
          });
        });
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
        logger.error("Received an unauthorized request to saveoidctoken: missing required cookie!");
        return Boom.unauthorized('Error: Request is not authorized');
      }
      logger.info("Received this posted cookie Hashkey: "+cookieHashkey);
      let postedtoken = request.payload.oauth_access_token;
      if(postedtoken == null || postedtoken == ''){
        logger.error("There was no token posted in the request!");
        return Boom.badRequest('Error: there was no token posted in the request');
      }
      let storeResponse=null;
       //now, save this tuple to the Redis database 
      storeResponse = RedisProvider.store(cookieHashkey, "accesstoken", postedtoken);
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
        return Boom.unauthorized('Error: Unauthorized Request.');
      }
     let promiseResult=null;
     promiseResult = await RedisProvider.read(cookiePlaceholder, "accesstoken");  //The Promise lives inside redisService
     logger.info("Got a result from the new RedisService (promise): "+promiseResult);
     return '{ "accesstoken": "'+promiseResult+'" }'; 
    }
  });


  // necessary to reroute for 401 errr (as it happens internally)
  server.ext('onPreResponse', (req, h) => {
    const { response } = req;
    //logger.info('server >> onPreResponse >> hook for catching errrrs');
    logger.info("Middleman received a request. ");
    logger.info('headers are >> ');
    logger.info(req.headers);

    if (response.isBoom && response.output.statusCode === 401) {
      logger.info(response);
      logger.info('onPreResponse >> returning 401');
      return h.response('ERROR - 404');
    }

    if (response.isBoom && response.output.statusCode === 404) {
      logger.info(response);
      logger.info('onPreResponse >> returning 404');
      return h.response('ERROR - 404');
    }

    return h.continue;
  });

  await server.start();
  logger.info('The machine is running:', JSON.stringify(server.info, null, 1));

};


// start up the HapiJS server
startUpTheMachine()
  .then(() => {
    // list out all urls/methods available
    logger.info('\n>> routes available >>');
    server.table().forEach((route) => logger.info(`${route.method}\t${route.path}`));
    logger.info("Now trying to connect the Middleman to Redis")
    connectMiddlemanToRedis();
  })
  .catch(err => {
    logger.info('Error starting the machine! :^( ', err);
  });

