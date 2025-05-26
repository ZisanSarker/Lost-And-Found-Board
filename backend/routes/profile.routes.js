const express = require('express');
const controller = require('../controllers/profile.controller');

const router = express.Router();

// ──────── Protected Profile Routes ────────

router.get('/', controller.getProfile);
router.patch('/', controller.updateProfile);
router.delete('/', controller.deleteProfile);

module.exports = router;
