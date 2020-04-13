

const axios = require("axios");
const config = require('../config/configProvider').config();

module.exports.getUserDetailsByEmailId = ( profile={} ) => {
  
  let { email, access_token } = profile;

  let url = `${config.SERVICE_BASE_URL}${config.CDS_GET_CUSTOMER_EMAIL_URL}${email}`;

  console.log(url);

  return axios({
    url,
    method: 'GET',
    headers: {
      "x-user-id" : email,
      "Authorization" : `Bearer ${access_token}`
    }
  })
  .then( response => {
    return response && response.data && response.data.data || response && response.data || response;
  })
  .catch(err => {
    return Promise.reject( 'NOT_ABLE_TO_GET_DETAILS_FOR_EMAIL' );
  });

};