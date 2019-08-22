const express = require('express');
const router = express.Router();

const {
  getAll,
  getAllByType,
  getById,
  addNew,
  patchById,
  deleteById,
} = require('./functions');

router.get('/', getAll);
router.get('/type/:type', getAllByType);
router.get('/:id', getById);
router.post('/', addNew);
router.put('/:id', patchById);
router.delete('/:id', deleteById);

module.exports = router;
