// Get environment variables or set defaults
require('dotenv').config();
const PORT = process.env.PORT || 8080;
const KEYS = [process.env.KEYS] || ['key1'];

const {
  urlsForUser,
  getUserFromEmail,
  generateRandomString
} = require('./helpers');

const { checkAuthenticated } = require('./middleWares');

const express = require("express");
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const morgan = require('morgan');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieSession({
  name: 'session',
  keys: KEYS,

  //Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 Hours
}));

app.use(morgan('combined'));

//Middle ware to get and pass user object
app.use((req, res, next) => {
  const user = req.session.user_id && users[req.session.user_id];

  req.user = user;
  next();
});



const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: 'userRandomID' },
  "9sm5xK": { longURL: "http://www.google.com", userID: 'user2RandomID'},
};

const users = {
  'userRandomID': {
    id: 'userRandomID',
    email: 'user@example.com',
    password: bcrypt.hashSync('1234', 10),
  },
  'user2RandomID': {
    id: 'user2RandomID',
    email: 'user2@example.com',
    password: bcrypt.hashSync('4321', 10),
  }

};

app.get("/", checkAuthenticated, (req, res) => {
  res.redirect('/urls');
});

app.get("/login", (req, res) => {
  let templateVars = {
    user: users[req.session.user_id],
  };
  res.render('usr_login', templateVars);
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const userId = getUserFromEmail(users, email);

  if (userId && bcrypt.compareSync(password, users[userId].password)) {

    req.session.user_id = userId;
    res.redirect('/urls');
  } else {
    res.statusCode = 403;
    res.send('User details incorrect or missing');
  }
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect('/login');
});

app.get('/register', (req, res) => {
  let templateVars = {
    user: users[req.session.user_id],
  };

  res.render('usr_new', templateVars);
});

app.post('/register', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  
  if (email && password) {
    if (getUserFromEmail(users, email)) {
      res.status(400).send('This email address is already in use!');
    }
    
    const newID = generateRandomString();
    const hashedPassword = bcrypt.hashSync(password, 10);
    users[newID] = {
      id: newID,
      email,
      password: hashedPassword,
    };
    req.session.user_id = newID;
    res.redirect('/urls');

  } else {
    res.statusCode = 400;
    res.send('Please enter both a username and password!');
  }

});

app.get('/urls', checkAuthenticated, (req, res) => {
  const userID = req.session.user_id;

  const userUrls = urlsForUser(urlDatabase, userID);

  if (Object.keys(userUrls).length === 0) {
    res.redirect('/urls/new');
  }

  const userObj = users[userID];

  let templateVars = {
    urls: userUrls,
    user: userObj,
  };

  res.render('urls_index', templateVars);
});

app.post('/urls', checkAuthenticated, (req, res) => {
  const longURL = req.body.longURL;

  if (!longURL) {
    res.status(400).send('URL entered is not formatted correctly');
  }

  const shortURL = generateRandomString();
  urlDatabase[shortURL] = { longURL, userID: req.session.user_id,};

  res.redirect(`/urls/${shortURL}`);
});


app.get('/urls/new', checkAuthenticated, (req, res) => {
  let templateVars = {
    user: users[req.session.user_id],
  };

  res.render('urls_new', templateVars);
});

app.post('/urls/:shortURL/delete', checkAuthenticated, (req, res) => {
  const userID = req.session.user_id;

  const urlUserID = urlDatabase[req.params.shortURL] && urlDatabase[req.params.shortURL].userID;

  if (urlUserID === userID) {
    delete urlDatabase[req.params.shortURL];
    res.redirect('/urls');
  } else {
    res.status(401).send('You are not authorized to make that request');
  }
});

app.get('/urls/:shortURL', checkAuthenticated, (req, res) => {

  const userID = req.session.user_id;
  const userObj = users[userID];

  const urlUserID = urlDatabase[req.params.shortURL] && urlDatabase[req.params.shortURL].userID;

  if (urlUserID === userID) {
    let templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL].longURL,
      user: userObj,
    };
  
    res.render('urls_show', templateVars);
  } else {
    res.status(401).send('You do not have access to this TinyURL. Please log in as the correct user.');
  }
});

app.post('/urls/:shortURL', checkAuthenticated, (req, res) => {

  const userID = req.session.user_id;
  const urlObj = urlDatabase[req.params.shortURL];

  if (!urlObj) {
    res.status(404).send('The TinyUrl specified does not exist.');
  }
  
  const longUrl = req.body.longURL;

  if (!longUrl) {
    res.status(400).send('URL entered is not formatted correctly');
  }

  if (urlObj.userID === userID) {
    urlObj.longURL = longUrl;
    res.redirect('/urls');

  } else {
    res.status(401).send('You are not authorized to make this request');
  }
});

app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL] && urlDatabase[req.params.shortURL].longURL;

  if (longURL) {
    res.redirect(longURL);
  } else {
    res.status(404).send('TinyURL Specified not found. Try again with a differnet short URL or create a new one.');

  }
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

