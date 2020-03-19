// Get environment variables or set defaults
require('dotenv').config();
const PORT = process.env.PORT || 8080;
const KEYS = [process.env.KEYS] || ['key1'];

const express = require("express");
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const morgan = require('morgan');

const { urlRoutes } = require('./routes/urls');
const { userRoutes } = require('./routes/users');

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

const app = express();

app.set('view engine', 'ejs');
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieSession({
  name: 'session',
  keys: KEYS,

  //Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 Hours
}));

//Middle ware to get and pass user object
app.use((req, res, next) => {
  const user = req.session.user_id && users[req.session.user_id];
  
  req.user = user;
  console.log(user);
  next();
});

app.get("/", (req, res) => {
  res.redirect('/urls');
});

// Use / routes that deal with user data and inject users database dependency
app.use('/', userRoutes(users));

// Use /urls routes and inject urlDatabase dependency
app.use('/urls', urlRoutes(urlDatabase));

// Handle redirection for any user
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

