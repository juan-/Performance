$(function () {
  var socket = io();
  socket.on('moves', function(msg){
    console.log(msg);
  });
});