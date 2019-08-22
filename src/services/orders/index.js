const express = require('express');
const router = express.Router();

const { checkToken } = require('../../middlewares/auth');

const {
  getAll,
  getById,
  getAllByType,
  addNew,
  patchById,
  deleteById,
} = require('./functions');

router.get('/', checkToken, getAll);
router.get('/:id', checkToken, getById);
router.get('/type/:type', checkToken, getAllByType);
router.post('/', checkToken, addNew);
router.put('/:id', checkToken, patchById);
router.delete('/:id', checkToken, deleteById);

module.exports = router;
