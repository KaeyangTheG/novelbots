const mongoose = require('mongoose');

const playerSchema = mongoose.Schema({
  sessionId: String,
  displayName: String,
});

module.exports = mongoose.model('Player', playerSchema);