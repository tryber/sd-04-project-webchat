const socket = window.io('ws://localhost:3000');
const nickInput = document.getElementById('nick-input');
const nickButton = document.getElementById('nick-btn');
const chatBox = document.getElementById('chatBox');
const messageInput = document.getElementById('msg-input');
const messageButton = document.getElementById('msg-btn');
const onlineUsersList = document.getElementById('onlineUsersList');

let defaultName = 'atvSigilo c/LOCAL';

socket.emit('usersOnline,', { nickname: defaultName });

// No click do msg-btn, Pega o valor do messageInput e defaultName emit para todos os usários.
messageButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  socket.emit('message', {
    nickname: defaultName,
    chatMessage: messageInput.value,
  });
  console.log('msgbtn');
  messageInput.value = '';
});

// Altera nick default, caso usuário preencha com outro valor e emite no evento UpdateNickname.
nickButton.addEventListener('click', (e) => {
  e.preventDefault();
  if (nickInput.value !== '') {
    socket.emit('updateNickname', { newName: nickInput.value });
    defaultName = nickInput.value;
  }
});

// Cria elemento <p> e insere as mensagens dentro dele dinamicamente.
const createMessage = (message) => {
  const newMessage = document.createElement('p');
  newMessage.setAttribute('data-testid', 'message');
  newMessage.innerText = message;

  chatBox.appendChild(newMessage);
};

// executa funcao createMessage no evento history, que será salvo no bd.
socket.on('history', (message) => {
  createMessage(message);
});

// Executa funcao createMessage no evento message
socket.on('message', (message) => {
  createMessage(message);
});

// Escuta evento UsersOnlineUpdte e coloca todos os usuarios online na lista.
socket.on('usersOnlineUpdate', (vetor) => {
  onlineUsersList.innerHTML = '';
  vetor.forEach((user) => {
    const li = document.createElement('li');
    li.setAttribute('data-testid', 'online-user');
    li.innerHTML = user.nickname;
    onlineUsersList.appendChild(li);
  });
});
