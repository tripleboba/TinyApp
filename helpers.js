const bcrypt = require('bcryptjs');

/* Generate Random shortURL (return a string of 6 random alphanumeric char)
  - using cypto module
  - randomBytes of 3 bytes but to hex 1 byte = 2 chars */
const generateRandomID = () => {
  const crypto = require("crypto");
  const id = crypto.randomBytes(3).toString("hex");
  return id;
};

// const users = {
//   "userRandomID": {
//     id: "userRandomID",
//     email: "user@example.com",
//     password: "purple-monkey-dinosaur"
//   }
// }

// check if email is in database
const checkEmail = (email, users) => {
  for (const user in users) {
    const user_email = users[user]['email'];
    if (email === user_email) return true;
  }
  return false;
};
// similar to checkEmail: taking in email but return user's id
const getUserIDByEmail = (email, users) => {
  for (const user in users) {
    if (checkEmail(email, users)) return user;
  }
  return false;
};

// check if pwd is correct
// const checkPassword = (password, users) => {
//   for (const id in users) {
//     const user_password = users[id]['password'];
//     if (password === user_password) return true;
//   }
//   return false;
// };

// get user_id if email and pwd pass else return false
const authorizedUser = (email, password, users) => {
  for (let id in users) {
    const user_email = users[id]['email'];
    const user_password = users[id]['hashedPwd'];
    if (email === user_email && bcrypt.compareSync(password, user_password)) {
      return users[id]['id'];
    }
  }
  return false;
};

// b6UTxQ: {
//   longURL: "https://www.tsn.ca",
//   userID: "aJ48lW"
// }

// return urls that created by userID in urlDB that is  === current login user_id
const urlsForUser = (id, urlDatabase) => {
  const userURLs = {};
  for (let url in urlDatabase) {
    const userID = urlDatabase[url]['userID'];
    if (userID === id) {
      userURLs[url] = urlDatabase[url]['longURL'];
    }
  }
  return userURLs;
};

// handle longURL input
const longURLinput = (input) => {
  let longURL = '';
  if (input.includes('https://www.')) {
    longURL = input;
  } else if (input.includes('www.')) {
    longURL = `https://${input}`;
  } else {
    longURL = `https://www.${input}`;
  }
  return longURL;
};

module.exports = {
  generateRandomID,
  checkEmail,
  getUserIDByEmail,
  authorizedUser,
  urlsForUser,
  longURLinput,
  bcrypt
};