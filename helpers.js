const urlsForUser = (database, user) => {
  let userUrlObject = {};
  for (const url in database) {
    if (database[url].userID === user) {
      userUrlObject[url] = database[url].longURL;
    }

  }
  return userUrlObject;
};

const getUserFromEmail = (userDatabase, emailAddress) => {
  for (const user in userDatabase) {
    if (userDatabase[user].email === emailAddress) {
      return userDatabase[user].id;
    }

  }
};


const generateRandomString = () => {
  const possibleLetters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  //uuid or guid -- research

  let stringLength = 6;
  let newString = '';
  for (let i = 0; i < stringLength; i++) {
    newString += possibleLetters[ Math.floor(Math.random() * possibleLetters.length) ];
    
  }

  return newString;

};

module.exports = {
  urlsForUser,
  getUserFromEmail,
  generateRandomString
};