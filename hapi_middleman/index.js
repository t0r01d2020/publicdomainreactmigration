//THESE ENVIRONMENT VARS MUST BE DEFINED ON THE HOST WHICH RUNS THIS SERVER:
//   middleman_logging_dir  : THE DIRECTORY WHERE IT SHOULD WRITE ITS LOG FILES
//   client_id  : Its OAuth2 ClientID
//   client_secret:  Its OAuth2 ClientSecret


// Happy things
const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Joi = require('@hapi/joi');
const Hoek = require('@hapi/hoek');
// Some built-in modules
const fs = require('fs');
const Path = require('path');

const Good = require('@hapi/good');
const GoodConsole = require('good-console');
const Swagger = require('hapi-swaggered');
const Bell = require('bell');
const AuthCookie = require('hapi-auth-cookie');
const Redis = require('redis');
let redisClient=null;
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


console.log("Now reading env config from environment...");
    var envLoggingDir = env.middleman_logging_dir;
    oauthClientId = env.client_id;
    oauthClientSecret = env.client_secret;

    if(envLoggingDir != null && envLoggingDir != ""){
      console.log("There is an environment-specific logging dir configured: "+envLoggingDir);
      logsDirPath = envLoggingDir;//overwrite default value w. env-config value
    }
    console.log("The configured oauth client_id is: "+oauthClientId);


//Hardcoded Logging dir now, but we should change this later to be configurable
//and passed-in. Same with logfile name
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
        ],
        file: [{
          module: 'good-squeeze',
          name: 'Squeeze',
          args: [{
            log: '*',
            response: '*'
          }]
        }, {
          module: 'good-squeeze',
          name: 'SafeJson'
        }, {
          module: 'good-file',
          args: [fullLogfilePath]
        }]
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
  console.log("Now trying to connect to Redis...");
  redisClient = Redis.createClient(
    {
      port      : 6379,               // replace with the port of YOUR local Redis installation
      host      : '127.0.0.1'
    });
  redisClient.on('ready', function() {
  console.log("RedisClient is ready");
   });


   redisClient.on('connect', function() {
    console.log('Connected to Redis server');
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
      let username = request.payload.username;
      if(username == null || username == ""){
        console.error("Received a bad request to saveoidctoken: username param was missing!");
        return 'Error: the username parameter is required.';
      }
      console.log("Received this posted username: "+username);
      let postedtoken = request.payload.oidc_token;
      if(postedtoken == null || postedtoken == ''){
        console.error("There was no token posted in the request!");
        return 'Error: there was no oidc token posted in the request';
      }
     
      //now, save this tuple to the Redis database
      let storeResponse=null;
      redisClient.hmset(username, "username", username, "accesstoken",postedtoken, function(err, response){
        if(err != null){
          console.error(err);
          return ('Error: '+err);
        }
        storeResponse =  {status: "success"};
      });

      return h.response(storeResponse).code(200);
    }
  });

  server.route({
    path: '/user/details',
    method: 'GET',
    handler: (request, h) => {
      const accessToken = request.headers['fake-cookieplaceholder'];
      if(accessToken == null || accessToken === ""){
        return 'Required security header missing';
      }

      let uprofile= "";
      redisClient.hgetall(accessToken.toString('utf8'), function(err, userObject){
        if (err) {
          console.error('Unable to retrieve User details from Redis: ' + err);
          return 'Unable to retrieve User details from Redis: '+err;
         }
         console.log("Seemed to have gotten the User details: ");
         console.log(userObject);
         uprofile = ""+ userObject
        
      })

      return h.response(uprofile);
    }
  });


  // necessary to reroute for 401 errr (as it happens internally)
  server.ext('onPreResponse', (req, h) => {
    const { response } = req;
    //console.log('server >> onPreResponse >> hook for catching errrrs');
    console.log("Middleman received a request. ");
    console.log('headers are >> ');
    console.log(req.headers);

    if (response.isBoom && response.output.statusCode === 401) {
      console.log(response);
      console.log('onPreResponse >> returning 401');
      return h.response('ERROR - 404');
    }

    if (response.isBoom && response.output.statusCode === 404) {
      console.log(response);
      console.log('onPreResponse >> returning 404');
      return h.response('ERROR - 404');
    }

    return h.continue;
  });

  await server.start();
  console.log('The machine is running:', JSON.stringify(server.info, null, 1));

};


// start up the HapiJS server
startUpTheMachine()
  .then(() => {
    // list out all urls/methods available
    console.log('\n>> routes available >>');
    server.table().forEach((route) => console.log(`${route.method}\t${route.path}`));
    console.log("Now trying to connect the Middleman to Redis")
    connectMiddlemanToRedis();

    if(oauthClientId == null || oauthClientId == ""){
      const err = "The client_id is not configured in the environment variables! This is needed";
      console.log(err);
      throw(err);
    }

    if(oauthClientSecret == null || oauthClientSecret == ""){
      const err = "the client_secret is not configured in the environment variables. It must be!";
      console.log(err);
      throw(err);
    }

  })
  .catch(err => {
    console.log('Error starting the machine! :^( ', err);
  });

