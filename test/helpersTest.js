const { url } = require("inspector");
const { generateRandomID,
  checkEmail,
  getUserIDByEmail,
  authorizedUser,
  urlsForUser,
  longURLinput,
  bcrypt } = require("../helpers.js");

const users = {
  "aJ48lW": {
    id: "aJ48lW",
    email: "a@gmail.com",
    // password: "a"
    hashedPwd: bcrypt.hashSync("a", 10)
  },
  "1A2b3C": {
    id: "1A2b3C",
    email: "b@gmail.com",
    // password: "b"
    hashedPwd: bcrypt.hashSync("b",10)
  }
};
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW"
  },
  rAnd0m: {
    longURL: "https://www.amazon.ca",
    userID: "1A2b3C"
  }
};

const assert = require("chai").assert;

describe("#generateRandomID", () => {
  it("return a string with 6 chars", () => {
    const result = generateRandomID();
    assert.isString(result);
    assert.strictEqual(result.length, 6);
  });
});
describe("#checkEmail", () => {
  it("return true if the email is in the usersDB", () => {
    const result = checkEmail("b@gmail.com", users);
    assert.isTrue(result);
  });
  it("return false if the email is not in the usersDB", () => {
    const result = checkEmail("newUser@gmail.com",users);
    assert.isFalse = result;
  });
});
describe("#getUserIDByEmail", () => {
  it("return a userID associated with the email", () => {
    const result = getUserIDByEmail("a@gmail.com", users);
    const expect = "aJ48lW";
    assert.strictEqual(result, expect);
  });
  it("return false if no user with the email", () => {
    const result = getUserIDByEmail("notUser@gmail.com", users);
    assert.isFalse = result;
  });
});
describe("#authorizedUser", () => {
  it("return userID if associated email and password match", () => {
    const result = authorizedUser("b@gmail.com", "b", users);
    const expect = "1A2b3C";
    assert.strictEqual(result, expect);
  });
  it("return false if email is not found", () => {
    const result = authorizedUser("notUser@gmail.com", "random", users);
    assert.isFalse = result;
  });
  it("return false if associated email and pwd not match", () => {
    const result = authorizedUser("a@gmail.com", "b", users);
    assert.isFalse = result;
  });
});

describe("#urlsForUser", () => {
  it("return {shortURL: longURL} obj associated with the user", ()  => {
    const result = urlsForUser("aJ48lW", urlDatabase);
    const expect = {  "b6UTxQ": "https://www.tsn.ca",
                      "i3BoGr": "https://www.google.ca"
                    };
    assert.deepEqual(result, expect);

    const result2 = urlsForUser("1A2b3C", urlDatabase);
    const expect2 = {"rAnd0m" : "https://www.amazon.ca"};
    assert.deepEqual(result2, expect2);
  });
  it("return empty {} if user is not in usersDB", ()  => {
    const result = urlsForUser("notUser", urlDatabase);
    const expect = {};
    assert.deepEqual(result, expect);
  });
});

describe("#longURLinput", () => {
  it("return full url input if input is already a full url", ()  => {
    const result = longURLinput("http://www.example.com");
    const expect = "http://www.example.com";
    assert.strictEqual(result, expect);
  });
  it("return full url http://www... if input started with www.", () => {
    const result = longURLinput("www.example.com");
    const expect = "http://www.example.com";
    assert.strictEqual(result, expect);
  });
  it("return full url http://www... if input started with domain.com", () => {
    const result = longURLinput("example.com");
    const expect = "http://www.example.com";
    assert.strictEqual(result, expect);
  });
});