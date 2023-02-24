const { assert } = require('chai');

const { userLookUp } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('userLookUp', function() {
  it('should return a user with valid email', function() {
    const user = userLookUp("user@example.com", 'id', testUsers);
    const expectedUserID = "user@example.com";
    assert.equal(user, expectedUserID);
  });

  
  it('should return false with non-existent email', function() {
    const user = userLookUp("invalid@example.com", 'email', testUsers);
    const expectedUserID = false;
    assert.equal(user, expectedUserID);
  });

  it('should return a password with a valid email', function() {
    const user = userLookUp("user2@example.com", 'password', testUsers);
    const expectedUserID = 'dishwasher-funk';
    assert.equal(user, expectedUserID);
  });
});

