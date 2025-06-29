const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();

// ✅ Connect to local MongoDB directly
mongoose.connect('mongodb://127.0.0.1:27017/manage_events', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);const express = require('express');
  const session = require('express-session');
  const methodOverride = require('method-override');
  const connectDB = require('./config/db');
  const User = require('./models/User');
  
  const app = express();
  
  // Connect to database
  connectDB();
  
  // Middleware
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(methodOverride('_method'));
  
  // Session configuration
  app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  }));
  
  // Set view engine
  app.set('view engine', 'ejs');
  
  // User middleware - make user available in all views
  app.use(async (req, res, next) => {
    if (req.session.userId) {
      try {
        const user = await User.findById(req.session.userId);
        res.locals.user = user;
        req.session.user = user;
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    }
    next();
  });
  
  // Routes
  app.use('/', require('./routes/authRoutes'));
  app.use('/dashboard', require('./routes/dashboardRoutes'));
  app.use('/events', require('./routes/eventRoutes'));
  
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

});

// ✅ Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

// ✅ Session middleware using connect-mongo
app.use(session({
  secret: 'secretkey', // Replace with strong secret in production
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: 'mongodb://127.0.0.1:27017/event-management',
    collectionName: 'sessions'
  })
}));

app.use(async (req, res, next) => {
  res.locals.user = null;

  if (req.session.userId) {
    try {
      const User = require('./models/User'); // adjust if path differs
      const user = await User.findById(req.session.userId).lean();
      res.locals.user = user;
    } catch (err) {
      console.error('Error loading user into locals:', err);
    }
  }

  next();
});


// ✅ Routes
app.use('/', require('./routes/authRoutes'));
app.use('/events', require('./routes/eventRoutes'));
app.use('/dashboard', require('./routes/dashboardRoutes'));
// app.use('/tickets', require('./routes/ticketRoutes'));

// ✅ Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));