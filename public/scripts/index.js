$(function () {
  var socket = io();
  socket.on('moves', function(moves){
    $('.movement-number').each(function(idx) {
      $(this).html(moves[idx]);
    })
  });
});