const chatInput = document.getElementById('chat-form');
const nameInput = document.getElementById('name-form');
const nameP = document.getElementById('user-name');
const userList = document.getElementById('users');

const socket = io();
let nickname = 'Zelda';

function OutputMessage(message) {
  const div = document.createElement('div');
  div.innerHTML = `
  <p class="text" data-testid="message">
    ${message}
  </p>`;

  document.querySelector('.chat-container').appendChild(div);
}

function OutputUsers(users) {
  userList.innerHTML = `
    ${users.map((user) => `<li class="text">${user.nickname}</li>`).join('')}
  `;
}

socket.emit('start');

socket.on('message', (message) => {
  //console.log(message);
  OutputMessage(message);
});

socket.on('roomUsers', ({ users }) => {
  OutputUsers(users);
});

socket.on('history', (hist) => {
  hist.forEach((message) => {
    OutputMessage(`${message.date} - ${message.nickname}: ${message.chatMessage}`);
  });
});

chatInput.addEventListener('submit', (e) => {
  e.preventDefault();

  const msg = e.target.elements.msg.value;

  socket.emit('message', { chatMessage: msg, nickname });

  e.target.elements.msg.value = '';
});

nameInput.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = e.target.elements.name.value;
  nameP.innerHTML = name;
  nickname = name;

  socket.emit('nameChange', name);

  e.target.elements.name.value = '';
});
