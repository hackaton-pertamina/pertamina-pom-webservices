const express = require('express');
const router = express.Router();

const {
  getAll,
  getById,
  addNew,
  patchById,
  deleteById,
} = require('./functions');

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', addNew);
router.patch('/:id', patchById);
router.delete('/:id', deleteById);

module.exports = router;
