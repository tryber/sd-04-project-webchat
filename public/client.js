const chatInput = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-container');
const nameInput = document.getElementById('name-form');
const nameP = document.getElementById('user-name');
const userList = document.getElementById('users');
const publicBtn = document.getElementById('public-btn');

const socket = io();
let nickname = 'Zelda';
let state = 'global';

function OutputMessage(message) {
  const div = document.createElement('div');
  div.innerHTML = `
  <p class="text" data-testid="message">
    ${message}
  </p>`;

  chatMessages.appendChild(div);
}

const stateChange = (newState) => {
  console.log(newState);
  state = newState;
  socket.emit('stateJoin', state);
};

function OutputUsers(users) {
  userList.innerHTML = `
    ${users.map((user) => `<li class="text">${user.nickname}</li>`).join('')}
  `;
}

socket.emit('start');

socket.on('message', (message) => {
  //  console.log(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  OutputMessage(message);
});

socket.on('roomUsers', ({ users }) => {
  //  console.log(users);
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

  socket.emit('message', { chatMessage: msg, nickname, state });

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

publicBtn.addEventListener('click', () => stateChange('global'));
