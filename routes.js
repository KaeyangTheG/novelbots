
module.exports = function (app) {
    app.post('/api/sessions', function(req, res) {
        res.send(200, {
            sessionId: 'abc123',
        });
    });

    app.get('/api/session/:sessionId/status', function(req, res) {
        res.send(200, {
            status: 'OK',
        });
    });

    app.get('/api/session/:sessionId/players', function(req, res) {
        
    });

    app.post('/api/session/:sessionId/players', function(req, res) {

    });
};