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

const userPass = function(inputEmail) {
  for (let user in users) {
    if (users[user].email === inputEmail) {
      return users[user].password;
    }
  }
};

const userLookUp = function(input, search) {
  for (let user of Object.keys(users)) {
    if (search === 'id') {
      if (input === users[user].email)
        return users[user].id;
    }
    if (input === users[user][search]) {
      return true;
    }
  }
  return false;
};

const urlsForUser = function(id) {
  let userUrl = {};
  for (let key in urlDatabase) {
    if (urlDatabase[key].userID === id) {
      userUrl[key] = urlDatabase[key].longURL;
    }
  }
  return userUrl;
};

module.exports  = generateRandomString;
module.exports = userPass;
module.exports = userLookUp;
module.exports = urlsForUser;