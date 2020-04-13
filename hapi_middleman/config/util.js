

module.exports.generateUUID = ( parts=8 ) => {

  let uuid;
  let numberOfParts = parts;
  let delimitersArr = ['-','_','!','#','$','='];
  
  const randomStr = () => {
    return Math.random().toString(36).substring(2,15);
  };

  const getRandomDelimiter = () => {
    let r = Math.floor(Math.random() * delimitersArr.length - 1);
    r = r >= 0? r : 0;
    return delimitersArr[r];
  };

  let outArr=[], outStr='';
  for(let i=0; i<numberOfParts-1; i++){
    outArr.push( randomStr() + getRandomDelimiter() )
  }
  outArr.push( randomStr() );
  outStr = outArr.join('');
  uuid = outStr;

  console.log('what is uuid');
  console.log(uuid);
  return uuid;

};