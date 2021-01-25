const socket = window.io('http://localhost:3000');

const listNameRandom = ['Bane', 'Bruce Wayne', 'Batman', 'Alfred', 'Robin', 'Coringa', 'Espantalho', 'Batgirl', 'Hera Venenosa', 'Mulher-Gato', 'Ras al Ghul', 'Asa Noturna', 'Lucius Fox'];

socket.on('connect', () => {
  const sessionStorageNickname = sessionStorage.getItem('nickname');
  const nameRandom = listNameRandom[Math.round(Math.random() * 13)];
  console.log(sessionStorageNickname)
  socket.id = {
    idRandom: socket.id,
    nickname: sessionStorageNickname || nameRandom,
  };
   
  sessionStorage.setItem('nickname', socket.id.nickname);
  
  socket.emit('dateUser', socket.id);

  
});



function editNickname() {
  const nicknameSaveBtn = document.querySelector('.nicknameSaveBtn');
  const inputNickname = document.querySelector('.nickname');

  nicknameSaveBtn.addEventListener('click', () => {
    sessionStorage.setItem('nickname', inputNickname.value);
    socket.id.nickname = inputNickname.value;
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
      nickname: socket.id.nickname,
    };
    socket.emit('message', data);
    inputChatMessage.value = '';
  });
}

emitMessage();


function createItensList(data, list, dataTestid) {
  const li = document.createElement('li');
  const pMessage = document.createElement('p');
  pMessage.setAttribute('data-testid', dataTestid);
  pMessage.textContent = data;
  li.appendChild(pMessage);
  list.appendChild(li);
}

const listMessages = document.getElementById('listMessages');

socket.on('dataServer', (message) => {
  createItensList(message, listMessages, 'message');
});


const listUsers = document.getElementById('listUsers');

socket.on('listNamesConverted', (listNamesConverted) => {
  const userSession = listNamesConverted.filter((user) => user.id === socket.id.idRandom);
  const othersUsers = listNamesConverted.filter((user) => user.id !== socket.id.idRandom);
    listUsers.innerText = '';
    createItensList(userSession[0].nickname, listUsers, 'online-user');
    othersUsers.forEach((user) => {
    createItensList(user.nickname, listUsers, 'online-user');
  });
});
