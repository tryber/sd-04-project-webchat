const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

const socket = io();

const outputMessage = (message) => {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message}</p>`;
  document.querySelector('.chat-messages').appendChild(div);
};

socket.on('message', (message) => {
  outputMessage(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const chatMessage = event.target.elements.message.value;
  socket.emit('message', { chatMessage, nickname: 'Daniel' });

  event.target.elements.message.value = '';
  event.target.elements.message.focus();
});
