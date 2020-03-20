// Middle ware to redirect user if not authenticated
const checkAuthenticated = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/login?error=1'); //Passing error query string to provide error feedback to user.
  }
};

module.exports = { checkAuthenticated };