const express = require('express');
const router = express.Router();

// services
const products = require('./services/products');
const facilities = require('./services/facilities');
const bundles = require('./services/bundles');

router.use('/products', products);
router.use('/facilities', facilities);
router.use('/bundles', bundles);

module.exports = router;
