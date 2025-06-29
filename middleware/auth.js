const ensureAuth = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  res.redirect('/login');
};

const isAdmin = (req, res, next) => {
  if (res.locals.user && res.locals.user.role === 'admin') {
    return next();
  }
  res.status(403).send('Access denied. Admins only.');
};

const isUser = (req, res, next) => {
  if (res.locals.user && res.locals.user.role === 'user') {
    return next();
  }
  res.status(403).send('Access denied. Users only.');
};

module.exports = ensureAuth;
module.exports.isAdmin = isAdmin;
module.exports.isUser = isUser;