const express = require('express');
const {
  getAllItems,
  createItem,
  updateItem
} = require('../controllers/itemController');

const router = express.Router();

router.get('/', getAllItems);
router.post('/', createItem);
router.put('/:page/:section', updateItem);

module.exports = router;
