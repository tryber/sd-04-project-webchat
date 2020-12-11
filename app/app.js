const socket = window.io('ws://localhost:3000');
const nickInput = document.getElementById('nick-input');
const nickButton = document.getElementById('nick-btn');
const chatBox = document.getElementById('chatBox');
const messageInput = document.getElementById('msg-input');
const messageButton = document.getElementById('msg-btn');
const onlineUsersList = document.getElementById('onlineUsersList');

socket.on('message', (text) => {
  const el = document.createElement('li');
  el.innerHTML = text;
  document.querySelector('ul').appendChild(el);
});

document.querySelector('button').onclick = () => {
  const text = document.querySelector('input').value;
  socket.emit('message', text);
};
