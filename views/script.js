const socket = io('http://localhost:4555');

socket.on('message', (message) => {
  const li = document.createElement('li');
  const pMessage = document.createElement('p');
  pMessage.setAttribute('data-testid', 'message');
  pMessage.textContent = message;
  li.appendChild(pMessage);
  document.getElementById('list').appendChild(li);
});

