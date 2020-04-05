
// Happy things
const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Joi = require('@hapi/joi');
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


// SET STATIC CONTENT PATH FROM CONFIGURATION
const DEFAULT_STATIC_CONTENT_PATH = './build';
const DEFAULT_CONTEXT_PATH = '/';
const env = process.env;

// DEPLOYMENT-SPECIFIC OPTIONS
const static_content_path = env.STATIC_CONTENT_PATH || DEFAULT_STATIC_CONTENT_PATH;
const context_path = env.CONTEXT_PATH || DEFAULT_CONTEXT_PATH;

//Hardcoded Logging dir now, but we should change this later to be configurable
//and passed-in. Same with logfile name
let logFileName = 'middleman_hapi_log.log';
const logsDirPath = './__logs/';
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
  })
  .catch(err => {
    console.log('Error starting the machine! :^( ', err);
  });

