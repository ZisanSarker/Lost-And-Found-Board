const express = require('express');
const controller = require('../controllers/profile.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// ──────── Protected Profile Routes ────────

router.get('/', authMiddleware, controller.getProfile);
router.patch('/', authMiddleware, controller.updateProfile);
router.delete('/', authMiddleware, controller.deleteProfile);

module.exports = router;
