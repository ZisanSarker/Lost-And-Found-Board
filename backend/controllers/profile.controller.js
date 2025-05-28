const User = require('../models/user.model');
const validator = require('validator');
require('colors');

const sanitizeUser = (user) => {
  const userObj = user.toJSON ? user.toJSON() : user.toObject();
  return userObj;
};

// ─────────── Get Profile ───────────
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      message: 'Profile retrieved successfully',
      user: sanitizeUser(user)
    });
  } catch (err) {
    console.error(`Get Profile Error: ${err.message}`.red.bold);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
};

// ─────────── Update Profile ───────────
exports.updateProfile = async (req, res) => {
  try {
    const { password, passwordChangedAt, passwordResetToken, passwordResetExpires, ...allowedUpdates } = req.body;
    const filteredBody = {};
    const allowedFields = ['username', 'email', 'phone', 'location', 'bio', 'avatar'];
    
    allowedFields.forEach(field => {
      if (allowedUpdates[field] !== undefined) {
        filteredBody[field] = allowedUpdates[field];
      }
    });

    if (filteredBody.email && !validator.isEmail(filteredBody.email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    if (filteredBody.email) {
      const existingUser = await User.findOne({ 
        email: filteredBody.email, 
        _id: { $ne: req.userId } 
      });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      filteredBody,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      user: sanitizeUser(updatedUser)
    });
  } catch (err) {
    console.error(`Update Profile Error: ${err.message}`.red.bold);

    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: errors.join(', ') });
    }

    res.status(500).json({ message: 'Server error while updating profile' });
  }
};

// ─────────── Delete Profile ───────────
exports.deleteProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(req.userId);

    res.status(200).json({
      message: 'Profile deleted successfully'
    });
  } catch (err) {
    console.error(`Delete Profile Error: ${err.message}`.red.bold);
    res.status(500).json({ message: 'Server error while deleting profile' });
  }
};