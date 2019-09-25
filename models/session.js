const mongoose = require('mongoose');

const sessionSchema = mongoose.Schema({
  sessionId: String,
});

module.exports = mongoose.model('Session', sessionSchema);