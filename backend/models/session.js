const mongoose = require('mongoose');

const sessionSchema = mongoose.Schema({
  sessionId: String,
  expiry: Date,
  open: Boolean,
  secret: String,
});

module.exports = mongoose.model('Session', sessionSchema);