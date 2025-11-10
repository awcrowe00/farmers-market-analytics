// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'vendor', 'market_manager', 'super_admin'],
    default: 'vendor',
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
  },
  company: {
    type: String,
    required: true,
    default: 'Default Company',
  },
  profilePicture: {
    data: {
      type: String, // Base64 encoded image data
      default: '',
    },
    contentType: {
      type: String, // e.g., 'image/jpeg', 'image/png'
      default: '',
    }
  },
  enabledGraphs: {
    type: {
      trafficChart: { type: Boolean, default: true },
      weatherChart: { type: Boolean, default: true },
      eventChart: { type: Boolean, default: true },
      heatMap: { type: Boolean, default: true },
    },
    default: {
      trafficChart: true,
      weatherChart: true,
      eventChart: true,
      heatMap: true,
    }
  }
}, {
  timestamps: true,
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);