const express = require("express");
const router = express.Router();

const bcrypt = require('bcrypt');

const {
  getUserFromEmail,
  generateRandomString
} = require('../helpers');



const userRoutes = (userDb) => {

  router.get("/login", (req, res) => {
    let templateVars = {
      user: userDb[req.session.user_id],
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
      res.status(403).send('User details incorrect or missing');
    }
  });
  
  router.post("/logout", (req, res) => {
    req.session = null;
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
        res.status(400).send('This email address is already in use!');
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
      res.status(400).send('Please enter both a username and password!');
    }
    
  });

  return router;

};

module.exports = { userRoutes };


