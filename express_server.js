const { generateRandomID, checkEmail,
        authorizedUser, urlsForUser, longURLinput} = require("./helpers");
const express = require("express");
const app = express();
const PORT = 8000;

const bcrypt = require('bcryptjs');
const bodyParser = require("body-parser");
// const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");

// set view engine to ejs
app.set("view engine", "ejs");
// add middleware to translate POST request body (Buffer -> string)
app.use(bodyParser.urlencoded({extended: true}));
// app.use(cookieParser()); // middleware for cookie
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

// const urlDatabase = {
//   "b2xVn2": "http://www.youtube.com",
//   "9sm5xK": "http://www.google.com"
// };
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

// a handler on the root path localhost:8080/
app.get("/", (req, res) => {
  res.send("root page");
});
app.get("/Welcome", (req, res) => {
  const templateVars = {greeting: "Hi~"};
  res.render("pages/welcome", templateVars);
});
app.get("/urls", (req, res) => {
  if (!req.session.user_id) res.redirect('/login');
  else {
    const user_id = req.session.user_id;
    const templateVars = {
      urls: urlsForUser(user_id, urlDatabase),
      user: users[user_id] // user_id already a string
    };
    res.render("pages/urls_index", templateVars);
  }
});
/**
 * form to take in long url not display until add 2 routes:
 *  - GET to render the urls_new and present the form to browser
 *  - POST to handle the form submission when click Submit button
 * Need to be above /urls/:shortURL otherwise will show /new the way /:shortURL page setup
 */
app.get("/urls/new", (req, res) => {
  if (!req.session.user_id) res.redirect('/login');
  else {
    const user_id = req.session.user_id;
    const templateVars = {
      user: users[user_id]
    };
    res.render("pages/urls_new", templateVars);
  }
});
app.post("/urls", (req, res) => {
  // console.log(req.body);  // see what data goes into longURL key - from input form
  // ^ return an obj {longURL: *input data*}
  // res.send("Submitted!"); // send str "Submitted" back to /urls the browser when hit submit
  // take input from submitted form and store in urlDatabase{}
  if (!req.session.user_id) res.redirect('/login');
  else {
    const longURL = longURLinput(req.body.longURL);
    const shortURL = generateRandomID(); // generate bitly
    const user_id = req.session.user_id;
    // update according to different user_id
    urlDatabase[shortURL] = {
      'longURL': longURL,
      'userID': user_id
    };
    console.log(urlDatabase);
    const templateVars = {
      shortURL,
      longURL: urlDatabase[shortURL]['longURL'],
      user: users[user_id]
    };
    // redirect to new shortURL show page when receivers a POST request
    res.render("pages/urls_show", templateVars);
  }
});

app.get("/urls/:shortURL", (req, res) => {
  if (!req.session.user_id) res.redirect('/login');
  else {
    const shortURL = req.params.shortURL;
    const user_id = req.session.user_id;
    const templateVars = {
      shortURL,
      // longURL: urlDatabase[shortURL]['longURL'],
      longURL: urlsForUser(user_id, urlDatabase)[shortURL],
      user: users[user_id]
    };
    res.render("pages/urls_show", templateVars);
  }
});

// delete url - delete button - POST form from urls_index
app.post("/urls/:shortURL/delete", (req, res) => {
  if (!req.session.user_id) res.redirect('/login');
  else {
    const user_id = req.session.user_id;
    const shortURL = req.params.shortURL;
    const userID = urlDatabase[shortURL]['userID'];
    if (user_id === userID) {
      delete urlDatabase[shortURL];
      // redirect back to /urls page after delete from database
      res.redirect("/urls");
    }
  }
});

// handle "edit button" @ homepage >>> url info page for "edit form"
app.post("/urls/:shortURL", (req, res) => {
  if (!req.session.user_id) res.redirect('/login');
  else {
    const user_id = req.session.user_id;
    const shortURL = req.params.shortURL;
    const userID = urlDatabase[shortURL]['userID'];
    if (user_id === userID) {
      const templateVars = {
        shortURL,
        longURL: urlDatabase[shortURL]['longURL'],
        user: users[user_id]
      };
      res.render("pages/urls_show", templateVars);
    }
  }
});
// update the new long url - update button handler
app.post("/urls/:shortURL/update", (req, res) => {
  if (!req.session.user_id) res.redirect('/login');
  else {
    const user_id = req.session.user_id;
    const shortURL = req.params.shortURL;
    const userID = urlDatabase[shortURL]['userID'];
    if (user_id === userID) {
      const longURL = longURLinput(req.body.longURL);
      urlDatabase[shortURL]['longURL'] = longURL;  // update change to the database
      
      const templateVars = {
        shortURL,
        longURL: urlDatabase[shortURL]['longURL'],
        user: users[user_id]
      };
      res.render("pages/urls_show", templateVars);
    }
  }
});

//display login page
app.get('/login', (req, res) => {
  if (req.session.user_id) res.redirect('/urls');
  res.render('pages/account');
});
// handle user login form in partial header.ejs
app.post("/login", (req, res) => {
  // const username = req.body.username;
  // console.log(username);
  if (!req.body.email || !req.body.password) {
    res.status(400).send('Email / Password is empty!');
  } else if (!checkEmail(req.body.email, users)) {
    res.status(403).send('Please register to use the app.');
  } else if (!authorizedUser(req.body.email, req.body.password, users)) {
    res.status(403).send('Email / Password does not match!');
  } else if (authorizedUser(req.body.email, req.body.password, users)) {
    const email = req.body.email;
    const password = req.body.password;
    // const hashedPwd = bcrypt.hashSync(password, 10);
    const user_id = authorizedUser(email, password, users);
    // res.cookie("user_id", user_id);
    req.session.user_id = user_id;
    res.redirect("/urls");
  }
  // const user_id = req.body.user_id;
  // set the cookie for username when user login
  // res.cookie("username", username);

});
// handle user logout
app.post("/logout", (req, res) => {
  // res.clearCookie("user_id");
  res.clearCookie("session");
  res.redirect("/urls");
});

// display new user register page
app.get("/register", (req, res) => {
  if (req.session.user_id) res.redirect('/urls');
  res.render('pages/account');
});
// handle register form - add new user to users_database{}
app.post("/register", (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).send('Email / Password is empty!');
  } else if (checkEmail(req.body.email, users)) {
    res.status(400).send('Email is already used! Please login instead.');
  } 
  else {
    const id = generateRandomID();
    const email = req.body.email;
    const password = req.body.password;
    const hashedPwd = bcrypt.hashSync(password, 10);
    users[id] = {id, email, hashedPwd};
    // console.log(id);
    // console.log(email);
    // console.log(password);
    // console.log(users);
    // res.cookie("user_id", id);
    req.session.user_id = id;
    res.redirect("/urls");
  }
});

app.listen(PORT, () => {
  console.log(`App is on air @ localhost:${PORT}`);
});