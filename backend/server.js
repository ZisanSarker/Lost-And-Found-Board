const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const connectDB = require('./config/db');
const profileRoutes = require('./routes/profile.routes');
const authRoutes = require('./routes/auth.routes');
const itemRoutes = require('./routes/item.routes');
const authMiddleware = require('./middlewares/auth.middleware');
require('colors');

// Load environment variables
dotenv.config();

// Connect to DB
connectDB();

const app = express();

// ───────────── Middleware ─────────────
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(helmet());

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

// ───────────── Rate Limiting on Auth Only ─────────────
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.',
});
app.use('/api/auth', authRateLimiter);

// ───────────── Session & Passport ─────────────
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false, // better for security
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    },
  })
);

// ───────────── Routes ─────────────
app.use('/api/auth', authRoutes);
app.use('/api/profile', authMiddleware , profileRoutes);
app.use('/api/item', authMiddleware, itemRoutes);
app.use('/api/email', require('./routes/email.routes'));

app.get('/', (req, res) => {
  res.send("Hello Beautiful People! 👋");
});


// ───────────── Global Error Handler ─────────────
app.use((err, req, res, next) => {
  console.error(`Server Error: ${err.message}`.red.bold);
  res.status(500).json({
    message: 'Server error',
    error: process.env.NODE_ENV === 'development' ? err.message : null,
  });
});

// ───────────── Server ─────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`.bgGreen.black);
});
