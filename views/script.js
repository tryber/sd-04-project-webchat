const socket = io('http://localhost:3000');

socket.on('connect', () => {
  
  console.log(socket.id);

});


const nicknameSaveBtn = document.querySelector('.nicknameSaveBtn');

function emitMessage() {
  const inputChatMessage = document.querySelector('.chatMessage');
  const inputNickname = document.querySelector('.nickname');
  const chatMessageBtn = document.querySelector('.chatMessageBtn');

  chatMessageBtn.addEventListener('click', () => {
    console.log(inputChatMessage.value)
    socket.emit('messageClient', inputChatMessage.value);
  })

  
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




