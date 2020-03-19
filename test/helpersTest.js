const { assert } = require('chai');

const { getUserFromEmail } = require('../helpers.js');

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

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserFromEmail(testUsers, "user@example.com");
    const expectedOutput = "userRandomID";
    
    assert.equal(user, expectedOutput);
  });

  it('should return undefined for a user with an invalid email', function() {
    const user = getUserFromEmail(testUsers, "test@example.com");
    const expectedOutput = undefined;
    
    assert.equal(user, expectedOutput);
  });


});
