const mongoose = require('../../configs/mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },

  name: {
    type: String,
    required: true,
  },

  avatar: {
    type: String,
    required: true,
  },
  
  link_aja_balance: {
    type: Number,
    required: true,
  },
  
  password: {
    type: String,
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

const UserModel = mongoose.model('users', userSchema);

module.exports = UserModel;