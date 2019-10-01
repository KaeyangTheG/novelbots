const Session = require('../models/session');
const dateUtil = require('./date.js');

module.exports = {
  exists: function(sessionId) {
    return new Promise(function(resolve) {
        Session.findOne({sessionId: sessionId}, function(err, session) {
            if (err || !session) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    }); 
  },
  updateExpiry: function(sessionId) {
      Session.findOneAndUpdate({sessionId: sessionId}, function(err, session) {
          if (!err && session) {
            // add 10 minutes to the expiry
            session.expiry = dateUtil.add(session.expiry, 10, 'm');
            session.save();
          }
      })
  },
};
