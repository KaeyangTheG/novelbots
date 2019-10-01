const express = require('express');
const path = require('path');
const http = require('http');
const mongoose = require('mongoose');
const socketIO = require('socket.io');
const app = express();
const server = http.Server(app);
const io = socketIO(server);
const configDB = require(path.join(__dirname, 'config/database.js'))
const bodyParser = require('body-parser');
const dateUtil = require('./date.js');
const sessionUtil = require('./session.js');

app.set('port', 5000);
app.use(bodyParser());
mongoose.connect(configDB.url);
require(path.join(__dirname, 'routes.js'))(app);

server.listen(5000, function () {
  console.log('Starting server on port 5000');
});

const SOCKET_EVENTS = {
  PLAYER_JOINED: 'PLAYER_JOINED',
  PLAYER_VOTED: 'PLAYER_VOTED',
  SHOW_CHOICE: 'SHOW_CHOICE',
  REMOVE_CHOICE: 'REMOVE_CHOICE',

};

const SOCKET_BOOKMARK_EVENTS = {
  CREATE_ROOM: 'CREATE_ROOM',
  CLOSE_ROOM: 'CLOOSE_ROOM',
};

io.sockets.on('connection', socket => {
  socket.on(SOCKET_BOOKMARK_EVENTS.CREATE_ROOM, sessionId => {
    socket.join(sessionId);
    Object.keys(SOCKET_EVENTS)
      .forEach(eventName => {
        socket.on(eventName, data => {
          console.log('server received', eventName, sessionId);
          io.sockets.in(sessionId).emit(eventName, data);
        });
      });
    (function ping() {
      sessionUtil.exists(sessionId)
        .then(exists => {
          if (!exists) {
            io.sockets.in(sessionId).emit(SOCKET_BOOKMARK_EVENTS.CLOSE_ROOM);
            socket.disconnect();
          } else {
            setTimeout(ping, 15 * 60 * 1000); // check again in 15 minutes
          }
        })
    })();
  });
});

