require('dotenv').config();
require('./utilities/passport');

const express = require('express');
const session = require('express-session');
const cors = require('cors');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');
const userRoutes = require('./routes/user.routes');
const customizeRoutes = require('./routes/customize.routes');

const emit = require('./utilities/socket');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
];

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  }
});

emit.init(io);
app.set('io', io);

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('join-board', (board_id) => {
    socket.join(`board_${board_id}`);
    console.log(`Joined board_${board_id}`);
  });

  socket.on('leave-board', (board_id) => {
    socket.leave(`board_${board_id}`);
    console.log(`Left board_${board_id}`);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

/* ---------- MIDDLEWARE ---------- */
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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

/* ---------- PASSPORT ---------- */
app.use(require('passport').initialize());
app.use(require('passport').session());

/* ---------- STATIC ---------- */
app.use(express.static(path.join(__dirname, 'public')));

/* ---------- ROUTES ---------- */
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/user', userRoutes);
app.use('/customize', customizeRoutes);

/* ---------- ERROR HANDLER ---------- */
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

/* ---------- SERVER ---------- */
server.listen(PORT, () => {
  console.log(`Server + Socket.IO running at http://localhost:${PORT}`);
});
