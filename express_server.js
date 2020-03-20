// Get environment variables or set defaults
require('dotenv').config();
const PORT = process.env.PORT || 8080;
const KEYS = [process.env.KEYS] || ['key1'];

const express = require("express");
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const morgan = require('morgan');

const { generateRandomString } = require('./helpers');


const { urlRoutes } = require('./routes/urls');
const { userRoutes } = require('./routes/users');

// example form:  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: 'userRandomID', visits: [{visitorId: 'sddxds', timeStamp: 'Fri Mar 20 2020 05:15:18 GMT+0000 (UTC)',}], },

const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: 'userRandomID', visits: [
    {visitorId: 'userRandomID', timeStamp: new Date(Date.UTC(2012, 11, 20, 3, 0, 0))}
  ], },
  "eAicpF": { longURL: "http://www.github.com", userID: 'userRandomID', visits: [
    { visitorId: 'userRandomID', timeStamp: new Date(Date.UTC(2012, 11, 20, 3, 0, 0)) },
    { visitorId: 'vwOVfr', timeStamp: new Date(Date.UTC(2012, 11, 20, 3, 0, 0)) },
    { visitorId: 'vwOVfr', timeStamp: new Date(Date.UTC(2012, 11, 20, 3, 0, 0)) }
  ], },
  "9sm5xK": { longURL: "http://www.google.com", userID: 'user2RandomID', visits: [], },
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

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

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
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL] && urlDatabase[shortURL].longURL;

 
  
  if (longURL) {

    const userId = req.session.user_id;
    let visitorId = '';

    if (userId) {
      visitorId = userId;
    } else {
      visitorId = generateRandomString();
      // eslint-disable-next-line camelcase
      req.session.user_id = visitorId;
    }

    const timeStamp = new Date();

    urlDatabase[shortURL].visits.push({
      visitorId,
      timeStamp,
    });

    res.redirect(longURL);
  } else {
    let templateVars = {
      user: req.user,
      errorMsg: 'TinyURL Specified not found!',
    };
    res.status(404).render('error', templateVars);
    
  }
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

