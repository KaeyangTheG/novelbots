const mongoose = require('mongoose');

const sessionSchema = mongoose.Schema({
  sessionId: String,
  movieId: Number,
});

module.exports = mongoose.model('Session', sessionSchema);