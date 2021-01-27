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
}

function OutputUsers(users) {
  userList.innerHTML = '';
  const usersKeys = Object.keys(users);
  usersKeys.forEach((userKey) => {
    console.log(users[userKey].nickname);
    const li = document.createElement('li');
    const div = document.createElement('div');
    div.innerText = `${users[userKey].nickname}`
    div.setAttribute('class', 'text');
    div.setAttribute('data-testid', 'online-user');
    li.appendChild(div);
    if (users[userKey].nickname !== nickname) {
      const privateBtn = document.createElement('button');
      privateBtn.innerText = 'private';
      privateBtn.id = userKey;
      privateBtn.setAttribute('data-testid', 'private');
      privateBtn.setAttribute('class', 'text');
      privateBtn.addEventListener('click', (event) => {
        //clearChat();
        publicBtn.disabled = false;
        chatType = 'private';
        //receiver = event.target.id;
        //localMessageHistory.private.map(message => addMessage(message));
      });
      li.appendChild(privateBtn);
    }
    userList.appendChild(li);
  });
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
