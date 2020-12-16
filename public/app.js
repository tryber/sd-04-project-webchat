const socket = io('http://localhost:4555');

const form = document.querySelector('#chat-form');

const sendMessage = (e) => {
  console.log(e.target);
  e.preventDefault();
  const chatMessage = document.querySelector('#message-input').value;
  const nickname = document.querySelector('#name-input').value;
  socket.emit('message', { chatMessage, nickname });
  document.querySelector('#message-input').value = '';
};

socket.on('message', (msg) => {
  const li = document.createElement('li');
  const message = document.createTextNode(msg);
  li.appendChild(message);
  document.querySelector('#messages').appendChild(li);
});

form.addEventListener('submit', sendMessage);
