// helper functions
const generateRandomString = function(uniqueLength) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for (let i = 0; i < uniqueLength; i++) {
    const randomIndex = (Math.floor(Math.random() * (letters.length - 1)));
    randomString += letters[randomIndex];
  }
  return randomString;
};

const userPass = function(inputEmail, database) {
  for (let user in database) {
    if (database[user].email === inputEmail) {
      return database[user].password;
    }
  }
};

const userLookUp = function(input, search, database) {
  for (let user of Object.keys(database)) {
    if (search === 'id') {
      if (input === database[user].email)
        return database[user].id;
    }
    if (input === database[user][search]) {
      return true;
    }
  }
  return false;
};

const urlsForUser = function(id, database) {
  let userUrl = {};
  for (let key in database) {
    if (database[key].userID === id) {
      userUrl[key] = database[key].longURL;
    }
  }
  return userUrl;
};

module.exports  = {
generateRandomString,
userPass,
userLookUp,
urlsForUser,
};