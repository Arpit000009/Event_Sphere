const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res) => res.render('auth/login');
exports.getRegister = (req, res) => res.render('auth/register');

exports.postRegister = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    await User.create({ name, email, password, role });
    res.redirect('/login');
  } catch (err) {
    console.error('Registration error:', err);
    res.redirect('/register');
  }
};


exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.userId = user._id;
    req.session.role = user.role; // store role in session
    return res.redirect('/dashboard');
  }
  res.redirect('/login');
};


exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
};
