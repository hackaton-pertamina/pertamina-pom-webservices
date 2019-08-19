const mongoose = require('../../configs/mongoose');

const facilitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String, required: true },
  is_deleted: { type: Boolean, required: true },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
});

const FacilityModel = mongoose.model('facilities', facilitySchema);

module.exports = FacilityModel;