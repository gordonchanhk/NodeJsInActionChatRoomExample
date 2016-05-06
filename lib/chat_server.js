var socketio = require('socket.io');
var io;
var guestNumber = 1;
var nickNames = {};
var namesUsed = [];
var currentRoom = {};
var roomsUsed = [];

exports.listen = function(server){
  io = socketio.listen(server);

  io.on('connection', function(socket) {
    guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);
    joinRoom(socket, 'Lobby');
    roomsUsed['Lobby'] = true;
    handleMessageBroadcasting(socket, nickNames);
    handleNameChangeAttempts(socket, nickNames, namesUsed);
    handleRoomJoining(socket);

    socket.on('rooms', function() {
      var roomList = [];
      for(var room in roomsUsed) {
        if(typeof io.sockets.adapter.rooms[room] !== 'undefined') {
            roomList.push(room);
        }
      }
      socket.emit('rooms', roomList);
    });
    handleClientDisconnection(socket, nickNames, namesUsed);
  });
};

function assignGuestName(socket, guestnumber, nickNames, namesUsed) {
	var name = 'Guest ' + guestNumber;
	nickNames[socket.id] = name;
	socket.emit('nameResult', {
		success: true,
		name: name
	});
	namesUsed.push(name);
	return guestNumber + 1;
}

function joinRoom(socket, room) {
  console.log('joinRoom:');
  socket.join(room);
  roomsUsed[room] = true;
	currentRoom[socket.id] = room;
	socket.emit('joinResult', {room: room});
	socket.broadcast.to(room).emit('message', {
		text: nickNames[socket.id] + ' has joined ' + room + '.'
	});
  console.log('look for room info:');
  console.log(room);
	var usersInRoom = io.sockets.adapter.rooms[room];
  console.log('Users in room:');
  console.log(usersInRoom);
	if (usersInRoom.length > 1) {
		var usersInRoomSummary = 'Users currently in ' + room + ': ';
		for (var index in usersInRoom.sockets) {
			var userSocketId = index;
			if(userSocketId != socket.id) {
				if(index > 0) {
					usersInRoomSummary += ', ';
				}
				usersInRoomSummary += nickNames[userSocketId];
			}
		}
		usersInRoomSummary += '.';
		socket.emit('message', {text: usersInRoomSummary});
	}
};


function handleNameChangeAttempts(socket, nickNames, nameUsed) {
	socket.on('nameAttempt', function(name) {
		if (name.indexOf('Guest') == 0) {
			socket.emit('nameResulr', {
				success: false,
				message: 'Names cannot begin with "Guest".'
			});
		} else {
			if (nameUsed.indexOf(name) == -1) {
				var previousName = nickNames[socket.id];
        var previousNameIndex = nameUsed.indexOf(previousName);
        namesUsed.push(name);
        nickNames[socket.id] = name;
        delete namesUsed[previousNameIndex];

        socket.emit('nameResult', {
          success: true,
          name: name
        });

        socket.broadcast.to(currentRoom[socket.id]).emit('message', {
          text: previousName + ' is now known as ' + name + '.'
        });
			} else {
        socket.emit('nameResult', {
          success: false,
          message: 'That name is already in use.'
        });
      }
		}
	});
}

function handleMessageBroadcasting(socket) {
  socket.on('message', function (message) {
    socket.broadcast.to(message.room).emit('message', {
      text: nickNames[socket.id] + ': ' + message.text
    });
  });
}

function handleRoomJoining(socket) {
  socket.on('join', function(room) {
    socket.leave(currentRoom[socket.id]);
    joinRoom(socket, room.newRoom);
  });
}

function handleClientDisconnection(socket) {
  socket.on('disconnect', function() {
    var nameIndex = namesUsed.indexOf(nickNames[socket.id]);
    socket.broadcast.to(currentRoom[socket.id]).emit('message', {
      text: nickNames[socket.id] + ' left '
    });
    delete namesUsed[nameIndex];
    delete nickNames[socket.id];
  });
}
