const Session = require('./models/session');
const Player = require('./models/player');
const shortid = require('shortid');
const data = require('./db.json');

module.exports = function (app) {
    app.post('/api/sessions', function(req, res) {
        const session = new Session();
        const sessionId = shortid.generate();
        const secret = shortid.generate();
        
        // set session expiry to an hour from now
        const expiry = new Date();
        expiry.setTime(expiry.getTime() + (60 * 60 * 1000));

        Object.assign(session, {
            sessionId,
            secret,
            expiry,
            open: true,
        });
        
        return new Promise(resolve => {
            session.save(err => {
                if (err) {
                    res.send(500, err);
                } else {
                    res.send(200, {sessionId, secret})
                }
            });
        });
    });

    app.get('/api/sessions/:sessionId', function(req, res) {
        const {sessionId} = req.params;
        Session.findOne({sessionId}, (err, session) => {
            if (err) {
                res.send(500, err);
            } else if (!session) {
                res.send(400, 'Session does not exist');
            } else {
                res.send(200, session);
            }
        });
    });

    app.get('/api/movies', function(req, res) {
        res.send(200, data);
    });

    app.get('/api/movies/:id', function(req, res) {
        const { id } = req.params;

        const movie = data.movies.find(movie => movie.id == id);
        if (!movie) {
            res.send(404, 'Movie not found');
            return;
        }
        res.send(200, movie);
    });

    app.post('/api/sessions/:sessionId/players', function(req, res) {
        const player = new Player();
        const { displayName } = req.body;
        const { sessionId } = req.params;
        
        if (!sessionId) {
            res.send(400, 'Must have a session id');
            return;
        }

        if (!displayName) {
            res.send(400, 'Must have a display name');
            return;
        }

        Object.assign(player, {
            displayName,
            sessionId,
        });
        
        Session.findOne({sessionId}, (err, session) => {
            if (err) {
                res.send(500, err);
            } else if (!session) {
                res.send(400, 'Session does not exist');
            } else {
                player.save(err => {
                    if (err) {
                        res.send(500, err);
                    } else {
                        res.send(200, player)
                    }
                });
            }
        });

    });
};