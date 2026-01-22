const express = require('express');
const session = require('express-session');
const path = require('path');

const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');
const userRoutes = require('./routes/user.routes')
const customizeRoutes = require('./routes/customize.routes');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// session middleware
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

// routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/user', userRoutes);
app.use('/customize', customizeRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
