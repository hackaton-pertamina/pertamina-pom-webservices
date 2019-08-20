const express = require('express');
const router = express.Router();

const {
  getAll,
  getById,
  getByType,
  addNew,
  patchById,
  deleteById,
} = require('./functions');

router.get('/type/:type', getByType);
router.get('/', getAll);
router.post('/', addNew);
router.get('/:id', getById);
router.put('/:id', patchById);
router.delete('/:id', deleteById);

module.exports = router;
