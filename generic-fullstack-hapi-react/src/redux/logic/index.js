
// import "Logic" (API connections)
import dadJokeSearchLogic from './silly/dadJokeLogic';
import getUserInfoLogic from './user/userInfoLogic';

export default [ 
  
  ...dadJokeSearchLogic,
  ...getUserInfoLogic
  
];