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

const userLookUp = function(input, search, database) {
  for (let user in database) {
    if (input === database[user].email) {
      if (search === 'id') {
        return database[user].email;
      }
      if (search === 'password') {
        return database[user].password;
      }
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
  userLookUp,
  urlsForUser,
};