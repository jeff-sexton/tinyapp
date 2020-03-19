// Middle ware to redirect user if not authenticated
const checkAuthenticated = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

module.exports = { checkAuthenticated };