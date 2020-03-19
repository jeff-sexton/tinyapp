const express = require("express");
const router = express.Router();

const { checkAuthenticated } = require('../middleWares');
const {
  urlsForUser,
  generateRandomString
} = require('../helpers');





const urlRoutes = (urlDb) => {

  router.get('/', checkAuthenticated, (req, res) => {
    const userID = req.user.id;
  
    const userUrls = urlsForUser(urlDb, userID);
  
    if (Object.keys(userUrls).length === 0) {
      res.redirect('/urls/new');
    }
  
    let templateVars = {
      urls: userUrls,
      user: req.user,
    };
  
    res.render('urls_index', templateVars);
  });
  
  router.post('/', checkAuthenticated, (req, res) => {
    const longURL = req.body.longURL;
  
    if (!longURL) {
      res.status(400).send('URL entered is not formatted correctly');
    }
  
    const shortURL = generateRandomString();
    urlDb[shortURL] = { longURL, userID: req.session.user_id,};
  
    res.redirect(`/urls/${shortURL}`);
  });
  
  
  router.get('/new', checkAuthenticated, (req, res) => {
    let templateVars = {
      user: req.user,
    };
  
    res.render('urls_new', templateVars);
  });
  
  router.post('/:shortURL/delete', checkAuthenticated, (req, res) => {
    const userID = req.user.id;
  
    const urlUserID = urlDb[req.params.shortURL] && urlDb[req.params.shortURL].userID;
  
    if (urlUserID === userID) {
      delete urlDb[req.params.shortURL];
      res.redirect('/urls');
    } else {
      res.status(401).send('You are not authorized to make that request');
    }
  });
  
  router.get('/:shortURL', checkAuthenticated, (req, res) => {
  
    const userID = req.user.id;
  
    const urlUserID = urlDb[req.params.shortURL] && urlDb[req.params.shortURL].userID;
  
    if (urlUserID === userID) {
      let templateVars = {
        shortURL: req.params.shortURL,
        longURL: urlDb[req.params.shortURL].longURL,
        user: req.user,
      };
    
      res.render('urls_show', templateVars);
    } else {
      res.status(401).send('You do not have access to this TinyURL. Please log in as the correct user.');
    }
  });
  
  router.post('/:shortURL', checkAuthenticated, (req, res) => {
  
    const userID = req.user.id;
    const urlObj = urlDb[req.params.shortURL];
  
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

  return router;

};


module.exports = { urlRoutes };