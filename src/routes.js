const express = require('express');
const router = express.Router();

// services
const products = require('./services/products');
const bundles = require('./services/bundles');

router.use('/products', products);
router.use('/bundles', bundles);

module.exports = router;
