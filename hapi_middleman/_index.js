


const Hapi   = require('@hapi/hapi');
const cookie = require('hapi-auth-cookie');
const Bell   = require('bell');
// custom provider for Bell
Bell.providers['oidcOGProvider'] = require('./authProviders/oidcProvider');

// config convenience for getting all env variables
const config = require('./config/configProvider').config();
console.log('server main >> what is config >> ');
console.log(config);

// api providers (actually will most likely be embedded in various routes)
const { getUserDetailsByEmailId } = require('./apiProviders/getUserDetailsByEmailId');

let serverOptions = {
  host: config.DEPLOYMENT_BASE,
  port: config.DEPLOYMENT_PORT
}

const server = Hapi.server( serverOptions );

const init = async () => {

  // register authentication & session plugins
  await server.register( Bell );
  await server.register( cookie );

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

      console.log('GET /login');
      let isAuthorized = request.auth.isAuthenticated;

      if(isAuthorized){

        console.log('isAuthorized!!');

        let credentials = request.auth.credentials;
        let artifacts = request.auth.artifacts;
        let userProfile = request.auth.credentials.profile;

        console.log(JSON.stringify(userProfile));

        // probably what to store in redis??
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
          updated_at: userProfile.updated_at
        };

        // items for cookie object proper
        const cookieObjectToSet = {
          access_token: artifacts.access_token,
          access_token_expires_in: artifacts.expires_in,
          firstName: userProfile.firstName,
          lastName: userProfile.lastName,
          sub: userProfile.sub,
          email: userProfile.email,
          email_verified: userProfile.email_verified,
          updated_at: userProfile.updated_at
        };

        request.cookieAuth.set({ ...cookieObjectToSet });

        let next = request.auth.credentials.query && request.auth.credentials.query.next;
        if(next){
          return h.redirect(next);
        }

        console.log('No post-authorization route set, go to default.');
        return h.redirect('/');
      }

      return h.response('UNABLE TO AUTHENTICATE.\nBoo!\nSeriously.');
    },
    options:{
      auth: 'oidcOGProvider'
    }
  });

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
      
      let { firstName='', lastName='', email='' } = request.auth.credentials;

      return getUserDetailsByEmailId( request.auth.credentials )
        .then( responseData => {
          let stringifiedData = JSON.stringify(responseData, null, 1);
          return h.response(
            '<div>' + `Hooray ${firstName} ${lastName}!<br/>You made it.<br/>Here are the details for ${email}.<br/>` + '</div><br/><pre>' + stringifiedData + '</pre>'
          );
        })
        .catch(err => {
          return h.response('<div>' + `Boo ${firstName} ${lastName}!<br/><br/>Not able to obtain details for ${email}.<br/>` + '</div>');
        });

    }
  });

  await server.start();
  server.log(['info'], `Server running at: ${server.info.uri}`);

};



init()
  .then(() => {
    // list out all urls/methods available
    console.log('\n>> routes available >>');
    server.table().forEach((route) => console.log(`${route.method}\t${route.path}`));
  })
  .catch(err => {
    console.log('Error on starting Hapi server!! :^( ', err);
  });