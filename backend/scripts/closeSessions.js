const path = require('path');
const mongoose = require('mongoose');
const configDB = require('../config/database.js');
const Session = require('../models/session.js');
const dateUtil = require('../util/date.js');

const now = new Date();

let EXIT_CONDITION = false;

mongoose.connect(configDB.url);

Session.find({}, function(err, sessions) {
    if (err) {
        EXIT_CONDITION = true;
        return;
    }
    try {
        sessions.forEach(async function(session) {
            const validDate = dateUtil.validate(session.expiry);
            if (!validDate || session.expiry < now) {
                await Session.deleteOne({_id: session._id});
            }    
        });
    } finally {
        EXIT_CONDITION = true;
    }
});

(function wait () {
    if (!EXIT_CONDITION) {
        setTimeout(wait, 1000);
    } else {
        process.exit(0);
    }
})();

