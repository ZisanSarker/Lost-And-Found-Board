const express = require('express');
const controller = require('../controllers/item.controller');
const router = express.Router();

router.post('/', controller.createItem);
router.get('/:type', controller.getItemsByType);

// router.get('/:id', getItemById);
// router.put('/:id', updateItem);

// router.delete('/:id', deleteItem);
// router.patch('/:id/status', updateItemStatus);

// router.get('/type/lost', (req, res, next) => {
//   req.query.type = 'lost';
//   getItems(req, res, next);
// });

// router.get('/type/found', (req, res, next) => {
//   req.query.type = 'found';
//   getItems(req, res, next);
// });

// router.get('/category/:category', (req, res, next) => {
//   req.query.category = req.params.category;
//   getItems(req, res, next);
// });

// router.get('/user/:userId', (req, res, next) => {
//   req.query.userId = req.params.userId;
//   getItems(req, res, next);
// });

module.exports = router;