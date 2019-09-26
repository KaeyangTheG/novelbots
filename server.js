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
};

io.on('connection', socket => {
  Object.keys(SOCKET_EVENTS)
    .forEach(eventName => {
      socket.on(eventName, data => {
        console.log('server received', eventName);
        io.emit(eventName, data);
      });
    });
});

