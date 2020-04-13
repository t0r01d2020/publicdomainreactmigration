
// ALLOWS NODE TO READ .ENV FILES
const dotenv = require('dotenv');
dotenv.config();

// util functions
const { generateUUID } = require('./util');
const env = process.env;

const sessionVars = { 
  ...env, 
  OIDC_SESSION_PASSWORD: generateUUID(), 
  SESSION_COOKIE_PASSWORD: generateUUID()
};

module.exports.config = () => {
  return sessionVars;
};