// O PROJETO É MEU E EU COMENTO DO JEITO QUE QUISER.
const app = require('express')();
const http = require('http').createServer(app);
const path = require('path');
const io = require('socket.io')(http);


// ter arq html para conectar o socketIo
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// app.use('/', app.static(path.join(__dirname + '/index.html')) );

io.on("connection", (socket) => {
  console.log('Cliente desconectado' );
});

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});

