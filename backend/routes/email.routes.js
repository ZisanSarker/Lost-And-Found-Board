const express = require('express');
const router = express.Router();
const controller = require('../controllers/email.controller');

router.post('/send-email', controller.sendEmails);

module.exports = router;
