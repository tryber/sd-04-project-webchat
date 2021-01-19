const socket = io('http://localhost:3000');


socket.on('message', (message) => {
  const li = document.createElement('li');
  const pMessage = document.createElement('p');
  pMessage.setAttribute('data-testid', 'message');
  pMessage.textContent = message;
  li.appendChild(pMessage);
  document.getElementById('list').appendChild(li);
});

/* io.on('connection', (socket) => {
  socket.broadcast.emit('mensagemServer');
  console.log('Conectado');
  
  socket.on('message', (message) => {
    const li = document.createElement('li');
    const pMessage = document.createElement('p');
    pMessage.setAttribute('data-testid', 'message');
    pMessage.textContent = message;
    li.appendChild(pMessage);
    document.getElementById('list').appendChild(li);
  });
  
}); */
