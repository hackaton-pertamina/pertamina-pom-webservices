const mongoose = require('../../configs/mongoose');

const subscriptionSchema = new mongoose.Schema({
  bundle: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'bundles'
  },
  
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'users'
  },

  type: {
    type: String,
    required: true,
  },

  expiry: {
    type: String,
    required: true,
  },

  balance: {
    type: Number,
    required: true,
  },

  is_deleted: {
    type: Boolean,
    required: true
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
});

const SubscriptionModel = mongoose.model('subscriptions', subscriptionSchema);

module.exports = SubscriptionModel;