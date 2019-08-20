const mongoose = require('../../configs/mongoose');

const stationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true
  },
  lat: {
    type: Number,
    required: true
  },
  lng: {
    type: Number,
    required: true
  },
  open_at: {
    type: String,
    required: true
  },
  closed_at: {
    type: String,
    required: true
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products'
  }],
  facilities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'facilities'
  }],
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
});

const BundleModel = mongoose.model('stations', stationSchema);

module.exports = BundleModel;