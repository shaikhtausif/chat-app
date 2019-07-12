var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var path = require('path')
var port = 4000;
users = [];
connections = [];

server.listen(port, () => {
  console.log("server running on portn no " + port);
});


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/home.html'));
});


app.use(express.static(path.join(__dirname, '/')));
io.sockets.on('connection', function (socket) {
  connections.push(socket);
  console.log(' connected %s socket connection ', connections.length);

  //Disconnect
  socket.on('disconnect', function (socket) {
    //if(!socket.username) return;
    users.splice(users.indexOf(socket.username), 1);
    updatUserNames();
    connections.splice(connections.indexOf(socket), 1);
    console.log(' connected %s socket connection ', connections.length);
  });
  //send meaasge
  socket.on('send message', function (data) {
    io.sockets.emit('new message', {
      msg: data,
      user: socket.username
    });
  });
  //new user
  socket.on('new user', function (data, callback) {
    callback(true);
    socket.username = data;
    users.push(socket.username);
    updatUserNames();
  });

  function updatUserNames() {
    io.sockets.emit('get user', users);
  }
});