const express = require('express');
const router = express.Router();
const controller = require('../controllers/profile.controller');

// ──────── Protected Profile Routes ────────

// Get the current user's profile
router.get('/', controller.getProfile);

// Update the current user's profile
router.patch('/', controller.updateProfile);

// Delete the current user's profile
router.delete('/', controller.deleteProfile);

module.exports = router;
