const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const generateTokens = require('../utils/generateTokens');
const validator = require('validator');
require('colors');

const cookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge,
  path: '/',
});

const sanitizeUser = (user) => {
  const userObj = user.toJSON ? user.toJSON() : user.toObject();
  return userObj;
};

// ─────────── Register ───────────
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: 'Please provide all required fields' });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Invalid email address' });
  }

  // Match the exact regex used in the frontend
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]{8,}$/;

  if (!strongPasswordRegex.test(password)) {
    return res.status(400).json({
      message:
        'Password must be at least 8 characters, include uppercase, lowercase, a number, and a special character.',
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const newUser = await User.create({ username, email, password });

    const { accessToken, refreshToken } = generateTokens(newUser._id);

    const accessTime = 7 * 24 * 60 * 60 * 1000;
    const refreshTime = 30 * 24 * 60 * 60 * 1000;

    res.cookie('accessToken', accessToken, cookieOptions(accessTime));
    res.cookie('refreshToken', refreshToken, cookieOptions(refreshTime));

    res.status(201).json({
      message: 'Registered successfully',
      user: sanitizeUser(newUser),
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error(`Register Error: ${err.message}`.red.bold);
    res.status(500).json({ message: 'Server error during registration' });
  }
};


// ─────────── Login ───────────
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ message: 'Please provide both email and password' });

  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    const { accessToken, refreshToken } = generateTokens(user._id);

    const accessTime = 7 * 24 * 60 * 60 * 1000;
    const refreshTime = 30 * 24 * 60 * 60 * 1000;

    res.cookie('accessToken', accessToken, cookieOptions(accessTime));
    res.cookie(
      'refreshToken',
      refreshToken,
      cookieOptions(refreshTime)
    );
    res.status(200).json({
      message: 'Logged in successfully',
      user: sanitizeUser(user),
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error(`Login Error: ${err.message}`.red.bold);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─────────── Logout ───────────
exports.logout = (req, res) => {
  try {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error(`❌ Logout Error: ${err.message}`.red.bold);
    res.status(500).json({ message: 'Server error during logout' });
  }
};

// ─────────── Refresh Token ───────────
exports.refreshToken = (req, res) => {
  const refreshTokenFromClient = req.cookies.refreshToken;

  if (!refreshTokenFromClient) {
    return res.status(403).json({ message: 'Refresh token required' });
  }

  try {
    const decoded = jwt.verify(
      refreshTokenFromClient,
      process.env.JWT_REFRESH_SECRET
    );
    const { accessToken, refreshToken } = generateTokens(decoded.userId);

    res.cookie('accessToken', accessToken, cookieOptions(15 * 60 * 1000));
    res.cookie(
      'refreshToken',
      refreshToken,
      cookieOptions(7 * 24 * 60 * 60 * 1000)
    );

    res.status(200).json({ message: 'Tokens refreshed successfully' });
  } catch (err) {
    console.error(`Refresh Token Error: ${err.message}`.red.bold);
    res.status(403).json({ message: 'Invalid refresh token' });
  }
};

// ─────────── Get Current User ───────────
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ user });
  } catch (err) {
    console.error(`Get User Error: ${err.message}`.red.bold);
    res.status(500).json({ message: 'Server error' });
  }
};
