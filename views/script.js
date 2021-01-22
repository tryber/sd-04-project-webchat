const socket = io('http://localhost:3000');

const listNameRandom = ['Bane', 'Bruce Wayne', 'Batman', 'Alfred', 'Robin', 'Coringa', 'Espantalho', 'Batgirl', 'Hera Venenosa', 'Mulher-Gato', 'Ras al Ghul', 'Asa Noturna', 'Lucius Fox'];

socket.on('connect', () => {
  socket.id = sessionStorage.getItem('nickname') || listNameRandom[Math.round(Math.random() * 13)];
  sessionStorage.setItem('nickname', socket.id);
});

function editNickname() {
  const nicknameSaveBtn = document.querySelector('.nicknameSaveBtn');
  const inputNickname = document.querySelector('.nickname');

  nicknameSaveBtn.addEventListener('click', () => {
    sessionStorage.setItem('nickname', inputNickname.value);
    socket.id = inputNickname.value;
    inputNickname.value = '';
  });
}

editNickname();

function emitMessage() {
  const inputChatMessage = document.querySelector('.chatMessage');
  const chatMessageBtn = document.querySelector('.chatMessageBtn');

  let data;

  chatMessageBtn.addEventListener('click', () => {
    data = {
      chatMessage: inputChatMessage.value,
      nickname: socket.id,
    };
    socket.emit('message', data);
    inputChatMessage.value = '';
  });
}

emitMessage();

socket.on('dataServer', (message) => {
  const li = document.createElement('li');
  const pMessage = document.createElement('p');
  pMessage.setAttribute('data-testid', 'message');
  pMessage.textContent = message;
  li.appendChild(pMessage);
  document.getElementById('list').appendChild(li);
});
