require('dotenv').config();
require('./utilities/passport');

const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');
const userRoutes = require('./routes/user.routes');
const customizeRoutes = require('./routes/customize.routes');

const app = express();
const PORT = 3000;

/* ---------- MIDDLEWARE ---------- */
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false,
    sameSite: 'lax'
  }
}));

/* ---------- PASSPORT SETUP ---------- */
app.use(require('passport').initialize());
app.use(require('passport').session());

/* ---------- STATIC FILES ---------- */
app.use(express.static(path.join(__dirname, 'public')));

/* ---------- ROUTES ---------- */
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/user', userRoutes);
app.use('/customize', customizeRoutes);

app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    res.status(status).json({
      success: false,
      message: err.isOperational ? err.message : 'Something went wrong'
    });
  } else {
    res.status(status).json({
      success: false,
      message: err.message,
      stack: err.stack
    });
  }
});

/* ---------- SERVER ---------- */
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});