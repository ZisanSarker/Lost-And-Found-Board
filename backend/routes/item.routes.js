const express = require('express');
const controller = require('../controllers/item.controller');
const router = express.Router();

router.post('/', controller.createItem);
router.get('/:type', controller.getItemsByType);
router.get('/user/:userId', controller.getUserItems);
router.put('/:id', controller.updateItem);
router.delete('/:id', controller.deleteItem);

module.exports = router;