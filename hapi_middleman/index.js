
// Happy things
const Hapi   = require('@hapi/hapi');
const Inert  = require('@hapi/inert');
const Joi    = require('@hapi/joi');
// Some built-in modules
const fs     = require('fs');
const Path   = require('path');

// PLUGINS (ROUTES)
//const ChuckNorris = require('./plugins/chuckNorrisPlugin');


// SET STATIC CONTENT PATH FROM CONFIGURATION
const DEFAULT_STATIC_CONTENT_PATH = './build';
const DEFAULT_CONTEXT_PATH = '/';
const env = process.env;

// DEPLOYMENT-SPECIFIC OPTIONS
const static_content_path = env.STATIC_CONTENT_PATH || DEFAULT_STATIC_CONTENT_PATH;
const context_path = env.CONTEXT_PATH || DEFAULT_CONTEXT_PATH;
 
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

const pluginsList = [ Inert ];

// Hapi Server Instance
const server = new Hapi.Server(serverOptions);

// Start up the Hapi Server Machine
const startUpTheMachine = async () => {

  // register the final plugin list (routes) based on application access
  await server.register( pluginsList );


  //static content (ReactJS SPA client) route handling
  server.route({
    method: 'GET',
    path: `${context_path}{param*}`,
    config:{
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
    handler: (request, h) =>  {
      return '                           Hapi Wednesday From Our Hapi Middleman Server!';
    }
  });


  // necessary to reroute for 401 errr (as it happens internally)
  server.ext('onPreResponse', (req, h) => {
    const { response } = req;
    console.log('server >> onPreResponse >> hook for catching errrrs');
    // let protoPath = ( req & req.connection && req.connection.info && req.connection.info.protocol ) || '';
    // let hostPath = ( req && req.info && req.info.host ) || '';
    // let urlPath = ( req && req.url && req.url.path ) || '';
    // let loggedpath = `${protoPath}://${hostPath}${urlPath}`;
    // console.log(loggedpath);
    // console.log('headers are >> ');
    // console.log(req.headers);

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
  console.log('The machine is running:', JSON.stringify(server.info,null,1));

};


// start up the HapiJS server
startUpTheMachine()
  .then(() => {
    // list out all urls/methods available
    console.log('\n>> routes available >>');
    server.table().forEach((route) => console.log(`${route.method}\t${route.path}`));
  })
  .catch(err => {
    console.log('Error starting the machine! :^( ', err);
  });

