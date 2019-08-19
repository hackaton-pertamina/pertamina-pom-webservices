const express = require('express');
const router = express.Router();

// services
const products = require('./services/products');

router.use('/products', products);

module.exports = router;
