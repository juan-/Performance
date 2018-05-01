$(function () {
  if (!localStorage.getItem('user_id')) {
    localStorage.setItem('user_id', Math.floor(Math.random() * 1000000));
  }

  var user_id = localStorage.getItem('user_id');

  var socket = io();
  socket.on('moves', function(moves){
    $('.movement-number').each(function(idx) {
      $(this).html(moves[idx]);
    });
    $('.image img').each(function(idx) {
      $(this).attr('src', '/images/movements/image' + moves[idx] + '.png');
    });
    $('.entry').removeClass('disabled');
    $('.entry').removeClass('selected');
  });

  $('.entry').click(function() {
    if ($(this).hasClass('disabled')) {
      return;
    }
    socket.emit('vote', {
      user_id: user_id,
      number: parseInt($(this).find('.movement-number').html(), 10)
    });

    $(this).addClass('selected');
    $('.entry').addClass('disabled');
  });
});