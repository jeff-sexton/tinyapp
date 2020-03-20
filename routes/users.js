const express = require("express");
const router = express.Router();

const bcrypt = require('bcrypt');

const {
  getUserFromEmail,
  generateRandomString
} = require('../helpers');



const userRoutes = (userDb) => {

  router.get("/login", (req, res) => {
    const query = req.query; //error in query string will render an error message to the user

    if (req.user) {
      return res.redirect('/urls');
    }

    let templateVars = {
      user: req.user,
      loginError: query.error
    };
    res.render('usr_login', templateVars);
  });
  
  router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    
    const userId = getUserFromEmail(userDb, email);
    
    if (userId && bcrypt.compareSync(password, userDb[userId].password)) {
      
      // eslint-disable-next-line camelcase
      req.session.user_id = userId;
      res.redirect('/urls');
    } else {
      let templateVars = {
        user: req.user,
        errorMsg: 'User details incorrect or missing',
      };
      res.status(403).render('usr_login', templateVars);
    }
  });
  
  router.post("/logout", (req, res) => {
    req.session = null;

    // Project requirements ask for this to redirect to /urls but /urls should give an error to a logged out user. Chose to redirect to /login instead
    res.redirect('/login');
  });
  
  router.get('/register', (req, res) => {
    let templateVars = {
      user: req.user,
    };
    
    res.render('usr_new', templateVars);
  });
  
  router.post('/register', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    
    if (email && password) {
      if (getUserFromEmail(userDb, email)) {
        let templateVars = {
          user: req.user,
          errorMsg: 'This email address is already in use',
        };
        return res.status(400).render('usr_new', templateVars);
      }
      
      const newID = generateRandomString();
      const hashedPassword = bcrypt.hashSync(password, 10);
      userDb[newID] = {
        id: newID,
        email,
        password: hashedPassword,
      };
      // eslint-disable-next-line camelcase
      req.session.user_id = newID;
      res.redirect('/urls');
      
    } else {
      let templateVars = {
        user: req.user,
        errorMsg: 'Please enter both a username and password.',
      };
      res.status(400).render('usr_new', templateVars);
    }
    
  });

  return router;

};

module.exports = { userRoutes };


