function divEscapedContentElement(message) {
  return $('<div></div>').text(message);
}

function divSystemContentElement(message) {
  return $('<div></div>').html('<i>' + message + '</i>');
}

function processUserInput(chatApp, socket) {
  var message = $('#send-message').val();
  var systemMessage;

  if(message.charAt(0) == '/') {
    systemMessage = chatApp.processCommand(message);
    if(systemMessage) {
      $('#messages').append(divSystemContentElement(systemMessage));
    }
  } else {
    chatApp.sendMessage($('#room').text(), message);
    $('#messages').append(divEscapedContentElement(message));
    $('#messages').scrollTop($('#messages').prop('scrollHeight'));
  }
  $('#send-message').val('');
}



$(document).ready(function() {
  var socket = io('/');
  var chatApp = new Chat(socket);
  socket.on('nameResult', function(result) {
    var message;
    if(result.success) {
      message = 'You are now known as ' + result.name + '.';
    } else {
      message = result.message;
    }
    $('#messages').append(divSystemContentElement(message));
  });

  socket.on('joinResult', function(result) {
    $('#room').text(result.room);
    $('#messages').append(divSystemContentElement('Room changed.'));
  });

  socket.on('message', function(message) {
    var newElement = $('<div></div>').text(message.text);
    $('#messages').append(newElement);
  });

  socket.on('rooms', function(rooms) {
    console.log(rooms);
    $('#room-list').empty();
    for(var idx in rooms) {
      console.log(rooms[idx]);
      if (rooms[idx] != '') {
        $('#room-list').append(divEscapedContentElement(rooms[idx]));
      }
    }

    $('#room-list div').click(function(){
      chatApp.processCommand('/join ' + $(this).text());
      $('#send-message').click();
    });
  });

  setInterval(function() {
    socket.emit('rooms');
  }, 2000);

  $('#send-message').focus();

  $('#send-button').click(function(){
    processUserInput(chatApp, socket);
    return false;
  });

  $('#send-form').on('submit', function(){
    processUserInput(chatApp, socket);
    return false;
  });
});
