// require to read .env file
const mongoose = require('../configs/mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const productModel = mongoose.model('products', productSchema);

module.exports = productModel;