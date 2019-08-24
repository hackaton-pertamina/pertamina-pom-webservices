const mongoose = require('../../configs/mongoose');

const orderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  type: {
    type: String,
    required: true
  },
  
  status: {
    type: String,
    required: true
  },
  
  is_deleted: {
    type: Boolean,
    required: true,
    default: false,
  },
  
  amount: {
    type: Number,
    required: true
  },
  
  administrative_cost: {
    type: Number,
    required: true
  },
  
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  
  station: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'stations'
  },

  subscriptions: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'bundles'
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products',
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
});

const OrderModel = mongoose.model('orders', orderSchema);

module.exports = OrderModel;