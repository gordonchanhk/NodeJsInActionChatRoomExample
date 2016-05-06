var Chat = function(socket) {
  this.socket = socket;
  this.currentRoom = 'Lobby';
};

Chat.prototype.sendMessage = function(room, text) {
  var message = {
    room: room,
    text: text
  };
  this.socket.emit('message', message);
};

Chat.prototype.changeRoom = function(room) {
  this.socket.emit('join', {
    newRoom: room
  });
  this.setCurrentRoom(room);
};

Chat.prototype.setCurrentRoom = function(room) {
  this.currentRoom = room;
};

Chat.prototype.processCommand = function(command) {
  var words = command.split(' ');
  console.log('words:');
  console.log(words);
  var command = words[0].substring(1, words[0].length).toLowerCase();
  var message = false;
  switch(command){
    case 'join':
      words.shift();
      var room = words.join(' ');
      if( this.currentRoom != room ){
        this.changeRoom(room);
      }
      break;
    case 'nick':
      words.shift();
      var name = words.join(' ');
      this.socket.emit('nameAttempt', name);
      break;
    default:
      message = 'Unrecognized command.';
      break;
  };
  return message;
};
