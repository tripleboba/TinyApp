const { getUserByEmail } = require('../helpers.js');

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

const assert = require('chai').assert.strictEqual;

describe('#getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    assert(user, expectedUserID);
  });
  it('#should return undefined if email is not in usersDB', function() {
    const user = getUserByEmail("notInUsers@example.com", testUsers);
    const expectedUserID = undefined;
    assert(user, expectedUserID);
  });
});