module.exports = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  res.redirect('/login');
};

module.exports.isAdmin = (req, res, next) => {
  if (req.session.role === 'admin') {
    return next();
  }
  res.status(403).send('Access denied. Admins only.');
};
