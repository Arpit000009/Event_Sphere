const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res) => {
  res.render('auth/login');
};

exports.getRegister = (req, res) => {
  res.render('auth/register');
};

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
  try {
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      req.session.userId = user._id;
      req.session.role = user.role;
      return res.redirect('/dashboard');
    }
    res.redirect('/login');
  } catch (err) {
    console.error('Login error:', err);
    res.redirect('/login');
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
};