
'use strict';

const config = require('../config/configProvider').config();
const log4js = require('log4js');
const oplogger = log4js.getLogger('default');
const internals = {};

const serviceBaseUrl = config.SERVICE_BASE_URL,
      oidcAuthServiceUrl = config.OIDC_AUTH_SERVICE_URL,
      tokenServiceUrl = config.OIDC_TOKEN_SERVICE_URL,
      profileServiceUrl = config.OIDC_PROFILE_SERVICE_URL,
      authUrl = serviceBaseUrl + oidcAuthServiceUrl,
      tokenUrl = serviceBaseUrl + tokenServiceUrl,
      profileUrl = serviceBaseUrl + profileServiceUrl;

exports = module.exports = function (options) {  
    oplogger.info("authUrl: " + authUrl);
    oplogger.info("tokenUrl: " + tokenUrl);
    oplogger.info("profileUrl: " + profileUrl);
    return {
        name: 'oidcProviderTheOG',
        protocol: 'oauth2',
        useParamsAuth: true,
        auth: authUrl,
        token: tokenUrl,
        scope: ['openid', 'profile', 'email'],
        profile: async function (credentials, params, get) {
          const userProfile = await get(profileUrl); 
          oplogger.info(JSON.stringify(userProfile));
          credentials.profile = userProfile;
        }
    };
};
