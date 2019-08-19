const mongoose = require('../../configs/mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  is_deleted: { type: Boolean, required: true },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
});

const ProductModel = mongoose.model('products', productSchema);

module.exports = ProductModel;