const express = require('express');
const router = express.Router();

// services
const products = require('./services/products');
const facilities = require('./services/facilities');

router.use('/products', products);
router.use('/facilities', facilities);

module.exports = router;
