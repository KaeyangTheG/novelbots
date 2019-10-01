const Session = require('../models/session');

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
  }  
};