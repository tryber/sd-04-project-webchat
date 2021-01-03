window.onload = () => {
  const socket = io();
  const messageInput = document.getElementById('message-input');
  const messages = document.getElementById('messages-div');
  const sendButton = document.getElementById('send-button');
  const nicknameElement = document.getElementById('nickname');
  const changeNickname = document.getElementById('change-nick-button');
  const usersList = document.getElementById('online-list');
  let chosenName = chance.name();

  socket.emit('user-login', { nickname: chosenName });

  sendButton.addEventListener('click', (e) => {
    e.preventDefault();

    socket.emit('message', { nickname: chosenName, chatMessage: messageInput.value });
    messageInput.value = '';
  });

  changeNickname.addEventListener('click', (e) => {
    e.preventDefault();

    if (nicknameElement.value !== '') {
      socket.emit('name-change', { newNickname: nicknameElement.value });
      chosenName = nicknameElement.value;
    }
  });

  const addMessageToChat = (message) => {
    const p = document.createElement('p');

    p.setAttribute('data-testid', 'message');
    p.innerText = message;

    messages.appendChild(p);
  };

  socket.on('history', (message) => {
    addMessageToChat(message);
  });

  socket.on('message', (message) => {
    addMessageToChat(message);
  });

  socket.on('update-users', (usersArray) => {
    usersList.innerHTML = '';
    usersArray.forEach((user) => {
      const li = document.createElement('li');

      li.setAttribute('data-testid', 'online-user');
      li.innerHTML = user.nickname;
      usersList.appendChild(li);
    });
  });
};
