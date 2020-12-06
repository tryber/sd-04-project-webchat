const socket = io('http://127.0.0.1:3000');

console.log('socket conectado: ', socket);

const inputNick = document.getElementById('nick-name');

const inputMessage = document.getElementById('message-box');

const formSendMessage = document.getElementById('message-form');

const sendButton = document.getElementById('send-button');

const nickNameButton = document.getElementById('nickname-button');

const ulMessages = document.getElementById('ul-messages');

const createMessage = (e) => {
  e.preventDefault();
  const timeNow2 = new Date();
  const timeFormated = moment(timeNow2).format('DD/MM/YYYY HH:mm:ss');

  // const msgDiv = document.createElement('div');
  // msgDiv.classList.add('box');

  // const liMessage = document.createElement('li');
  // liMessage.innerText = `${inputNick.value}: ${inputMessage.value}`;

  // const spanTime = document.createElement('span');
  // spanTime.classList.add('is-italic');
  // spanTime.classList.add('is-size-7');
  // spanTime.innerText = `at ${timeFormated}`;

  // msgDiv.appendChild(liMessage);
  // msgDiv.appendChild(spanTime);

  // ulMessages.appendChild(msgDiv);
  // `${inputNick.value}: ${inputMessage.value} ${timeFormated}`;

  const messageChatObject = {
    nickname: inputNick.value,
    chatMessage: `${timeFormated} - ${inputNick.value}: ${inputMessage.value}`,
  };

  socket.on('message', (msg) => {
    const li = document.createElement('li');
    ulMessages.appendChild(li);
    li.textContent = msg.chatMessage;
    window.scrollTo(0, document.body.scrollHeight);
  });

  socket.emit('message', messageChatObject);
  // socket.emit('message', { nickname: inputNick.value, chatMessage: inputMessage.value });

  inputMessage.value = '';

  // ROLA A TELA PRA BAIXO JUNTO COM AS MSGS
};

formSendMessage.addEventListener('submit', createMessage);
