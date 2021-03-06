var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var api = require('./converse');

var conn = function () {
  //  server.listen(process.env.SOCKET_PORT);
  server.listen(5000);
  // app.get('/', function (req, res) {
  //   res.sendfile(__dirname + '/index.html');
  // });
};

var fromClient = function () {
  io.on('connection', function (socket) {
    socket.on('fromClient', function (data) {
      console.log('User : ', data.client);
      api.getRes(data.client).then(function (res) {
        console.log('Chatbot : ', res);
        socket.emit('fromServer', { server: res });
      });
    });
  });
};
module.exports = { conn, fromClient };
