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
  CREATE_ROOM: 'CREATE_ROOM',
};

io.sockets.on('connection', socket => {
  socket.on(SOCKET_EVENTS.CREATE_ROOM, sessionId => {
    console.log('room created', sessionId);
    socket.join(sessionId);
    // socket.on(SOCKET_EVENTS.PLAYER_JOINED, data => {
    //   console.log('server received', data);
    //   io.sockets.in(sessionId).emit(SOCKET_EVENTS.PLAYER_JOINED, data);
    // })
    Object.keys(SOCKET_EVENTS)
      .filter(key => key !== SOCKET_EVENTS.CREATE_ROOM)
      .forEach(eventName => {
        socket.on(eventName, data => {
          console.log('server received', eventName, sessionId);
          io.sockets.in(sessionId).emit(eventName, data);
        });
      });
  });
});

