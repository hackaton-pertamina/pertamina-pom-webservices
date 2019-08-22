const express = require('express');
const router = express.Router();

// services
const products = require('./services/products');
const facilities = require('./services/facilities');
const bundles = require('./services/bundles');
const stations = require('./services/stations');
const users = require('./services/users');
const orders = require('./services/orders');

router.use('/products', products);
router.use('/facilities', facilities);
router.use('/bundles', bundles);
router.use('/stations', stations);
router.use('/users', users);
router.use('/orders', orders);

module.exports = router;
