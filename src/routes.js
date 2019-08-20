const express = require('express');
const router = express.Router();

// services
const products = require('./services/products');
const facilities = require('./services/facilities');
const bundles = require('./services/bundles');
const stations = require('./services/stations');
const users = require('./services/users');

router.use('/products', products);
router.use('/facilities', facilities);
router.use('/bundles', bundles);
router.use('/stations', stations);
router.use('/users', users);

module.exports = router;
