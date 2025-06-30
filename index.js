// ✅ Combined Server Code with Socket.IO, Sessions, MongoDB and ChatMessage persistence

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const ChatMessage = require('./models/ChatMessage');
const User = require('./models/User');
const passport = require('passport');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// ✅ Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/manage_events', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

//  Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

// ✅ Session configuration (shared by Express and Socket.IO)
const sessionMiddleware = session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: 'mongodb://127.0.0.1:27017/manage_events',
    collectionName: 'sessions'
  })
});
app.use(sessionMiddleware);

// ✅ Share session with Socket.IO
io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

// ✅ Load user into views
app.use(async (req, res, next) => {
  if (req.session.userId) {
    try {
      const user = await User.findById(req.session.userId).lean();
      res.locals.user = user;
    } catch (err) {
      console.error('Error fetching user:', err);
    }
  } else {
    res.locals.user = null;
  }
  next();
});

// ✅ Socket.IO chat handler
io.on('connection', socket => {
  console.log('🟢 User connected to chat');

  socket.on('chatMessage', async (data) => {
    try {
      const newMessage = new ChatMessage({
        senderName: data.senderName,
        message: data.message
      });
      await newMessage.save();
      io.emit('newMessage', {
        senderName: data.senderName,
        message: data.message
      });
    } catch (err) {
      console.error('❌ Error saving chat message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('🔴 User disconnected');
  });
});

// ✅ Attach io to request object (optional)
app.use((req, res, next) => {
  res.io = io;
  next();
});

// ✅ Routes
app.use('/', require('./routes/authRoutes'));
app.use('/dashboard', require('./routes/dashboardRoutes'));
app.use('/events', require('./routes/eventRoutes'));
// app.use('/tickets', require('./routes/ticketRoutes'));

// ✅ Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});


// Load passport config
require('./config/passport')(passport); // if in config folder


// Middleware
app.use(passport.initialize());
app.use(passport.session());

// Load Routes
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);
app.use('/', authRoutes);
