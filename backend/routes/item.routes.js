const express = require('express');
const router = express.Router();
const {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
  updateItemStatus
} = require('../controllers/itemController');
router.post('/', createItem);
router.get('/', getItems);

router.get('/:id', getItemById);
router.put('/:id', updateItem);

router.delete('/:id', deleteItem);
router.patch('/:id/status', updateItemStatus);

router.get('/type/lost', (req, res, next) => {
  req.query.type = 'lost';
  getItems(req, res, next);
});

router.get('/type/found', (req, res, next) => {
  req.query.type = 'found';
  getItems(req, res, next);
});

// @desc    Get items by category
// @route   GET /api/items/category/:category
// @access  Public
router.get('/category/:category', (req, res, next) => {
  req.query.category = req.params.category;
  getItems(req, res, next);
});

router.get('/user/:userId', (req, res, next) => {
  req.query.userId = req.params.userId;
  getItems(req, res, next);
});

module.exports = router;