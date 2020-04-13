
'use strict';

const config = require('../config/configProvider').config();
const log4js = require('log4js');
const oplogger = log4js.getLogger('default');
const internals = {};

exports = module.exports = function (options) {
  const authurl = config.SERVICE_BASE_URL+config.OIDC_AUTH_SERVICE_URL;
  oplogger.info("Using an authurl of: "+authurl);
  const tokenurl = config.SERVICE_BASE_URL+config.OIDC_TOKEN_SERVICE_URL;
  oplogger.info("Using a tokenurl of: "+tokenurl);
  const theurl = config.SERVICE_BASE_URL+config.OIDC_PROFILE_SERVICE_URL;
  
  oplogger.info("And the main url is: "+theurl);
    return {
        name: 'oidcProviderTheOG',
        protocol: 'oauth2',
        useParamsAuth: true,
        auth: authurl,
        token: tokenurl,
        scope: ['openid', 'profile', 'email'],
        profile: async function (credentials, params, get) {
          let url = theurl;
         oplogger.info("the userprofile url  "+url);
         oplogger.info("Now, about to get the userprofile from that url...");
          const userProfile = await get(url); 
          oplogger.info("Got a response back from "+url+" ....(userprofile)...");
          oplogger.info(JSON.stringify(userProfile));
          credentials.profile = userProfile;
        }
    };
};
