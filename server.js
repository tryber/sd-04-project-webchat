// 1 - Crie um back-end para conexão simultaneamente de clientes e troca de mensagens em chat público
const app = require(`express`)();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connect', (socket) => {
  console.log('Conectado');
  
  socket.on('disconnect', () => {
    console.log('Desconectado');
    io.emit('adeus', { mensagem: 'Poxa, fica mais, vai ter bolo :)' });
  });

  socket.on('mensagem', (msg) => {
    console.log(`Mensagem ${msg}`);
    io.emit('mensagemServer', msg);
  });

  socket.broadcast.emit('mensagemServer');
});

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});


