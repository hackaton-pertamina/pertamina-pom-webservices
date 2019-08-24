const mongoose = require('../../configs/mongoose');

const bookingSchema = new mongoose.Schema({
  stations: {type: mongoose.Schema.Types.ObjectId, ref: 'stations'},
  products: {type: mongoose.Schema.Types.ObjectId, ref: 'products'},
  type: { type: String, require: true },
  slots: {
    type: [
      { 
        time: { type: String },
        order: { type: mongoose.Schema.Types.ObjectId, ref: 'orders' }
      }
    ],
    required: true,
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
});

const BookingModel = mongoose.model('bookings', bookingSchema);

module.exports = BookingModel;