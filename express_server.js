const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 8080; // default port 8080

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  'userRandomID': {
    id: 'userRandomID',
    email: 'user@example.com',
    password: 'purple-monkey-dog',
  },
  'user2RandomID': {
    id: 'user2RandomID',
    email: 'user@example.com',
    password: 'dishwasher-funk',
  }

};

const checkForUserEmail = (emailAddress) => {
  for (const user in users) {
    if (users[user].email === emailAddress) {
      return true;
    }

  }

  return false;

};


const generateRandomString = () => {
  const possibleLetters = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
    'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'y', 'x', 'z' ];

  let stringLength = 6;
  let newString = '';
  for (let i = 0; i < stringLength; i++) {
    newString += possibleLetters[ Math.floor(Math.random() * possibleLetters.length) ];
    
  }

  return newString;

};

app.get("/", (req, res) => {
  res.send("Hello!");
  console.log('Cookies:', req.cookies);
});

app.post("/login", (req, res) => {
  // const user = req.body.username;
  // res.cookie('username', user);
  res.redirect('/urls');
});

app.post("/logout", (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
});

app.get('/register', (req, res) => {
  let templateVars = {
    user: users[req.cookies['user_id']],
  };

  res.render('usr_new', templateVars);
});

app.post('/register', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const newID = generateRandomString();

  if (email && password) {
    if (checkForUserEmail(email)) {
      res.statusCode = 400;
      res.send('This email address is already in use!');
    }

    users[newID] = {
      id: newID,
      email,
      password,
    };
    res.cookie('user_id', newID);
    res.redirect('/urls');

  } else {
    res.statusCode = 400;
    res.send('Please enter both a username and password!');
  }

});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/urls', (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    user: users[req.cookies['user_id']],
  };

  res.render('urls_index', templateVars);
});

app.post('/urls', (req, res) => {
  const shortURL = generateRandomString();

  urlDatabase[shortURL] = req.body.longURL;

  res.redirect(`/urls/${shortURL}`);
});

app.get('/urls/new', (req, res) => {
  let templateVars = {
    user: users[req.cookies['user_id']],
  };

  res.render('urls_new', templateVars);
});

app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

app.get('/urls/:shortURL', (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: users[req.cookies['user_id']],
  };

  res.render('urls_show', templateVars);
});

app.post('/urls/:shortURL', (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  console.log(req.body);
  res.redirect('/urls');
});

app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];

  if (longURL) {
    res.redirect(longURL);
  } else {
    res.send('TinyURL Specified not found. Try again with a differnet short URL or create a new one.');

  }
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

