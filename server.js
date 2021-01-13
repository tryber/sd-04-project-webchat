require('dotenv/config');
const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const moment = require('moment');

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.json());

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

const formatMessage = (nickname, message, timestamp) => {
	return `${timestamp} - ${nickname}: ${message}`
}

let users = [];

// Conexão
io.on('connection', (socket) => {
	const user = {
		id: socket.id
	};
	// console.log('User Connected', user);

	socket.emit('onlineUsers', [...users, {...user}])
	users.push(user)

	socket.on('message', ({chatMessage, nickname}) => {
		nickname !== '' ? user.nickname = nickname : user.nickname = 'Anonymous';
		const date = Date.now();
		const time = moment(date).format('DD-MM-YYYY h:mm:ss a');
		users.push(user)
		socket.emit('onlineUsers', users)
		io.emit('message', formatMessage(nickname, chatMessage, time));
	})

	socket.on('disconnect', () => {
		users = users.filter(user => socket.id !== user.id);
		socket.emit('onlineUsers', users)
	})
});

server.listen(PORT, () => console.log(`Ouvindo na porta ${PORT}`));