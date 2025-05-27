const express = require('express');
const router = express.Router();
const controller = require('../controllers/item.controller');

// Create
router.post('/', controller.createItem);

// Read
router.get('/:id', controller.getItemById);
router.get('/user/:userId', controller.getUserItems);
router.get('/type/:type', controller.getItemsByType);

// Update
router.patch('/:id', controller.updateItem);

// Delete
router.delete('/:id', controller.deleteItem);

module.exports = router;
