const express = require('express');
const controller = require('../controllers/item.controller');
const router = express.Router();

router.post('/', controller.createItem);
router.get('/user/:userId', controller.getUserItems);
router.get('/:id', controller.getItemById);
router.get('/type/:type', controller.getItemsByType);
router.patch('/:id', controller.updateItem);
router.delete('/:id', controller.deleteItem);

module.exports = router;