const mongoose = require('../../configs/mongoose');

const bundleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  descriptions: { type: String, required: true },
  price: { type: Number, required: true },
  duration_in_days: { type: Number, required: true },
  quantity: { type: Number, required: true },
  is_deleted: { type: Boolean, required: true },
  product: {type: mongoose.Schema.Types.ObjectId, ref: 'products'},
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
});

const BundleModel = mongoose.model('bundles', bundleSchema);

module.exports = BundleModel;