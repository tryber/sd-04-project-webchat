const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');
const path = require('path');
const faker = require('faker'); // Gera dados fakes no browser, Ex.: nome, cidade
const modelChat = require('./model/modelChat');
const saveMessage = require('./service/saveMessagePrivate');
const createOn = require('./service/timeNow');

const app = express();

// Criando servidor
const socketIoServer = http.createServer(app);
const io = socketio(socketIoServer);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

const allUsers = [];

io.on('connect', async (socket) => {
  // define o idioma dos dados fake
  faker.locale = 'pt_BR';
  // id da sessão
  const userId = socket.id;
  const userName = faker.name.findName();
  // users.reverse();

  const users = { userName, userId };
  allUsers.unshift(users);
  console.log('array', allUsers);

  if (allUsers.length >= 2) {
    console.log('array size', allUsers.length);
    socket.emit('allUserConected', allUsers);
    socket.broadcast.emit('userConected', users);
  } else {
    socket.emit('userConected', users);
  }

  socket.on('userConected', (upDateUser) => {
    // console.log('id upadte', upDateUser.indice);
    // Verifica se o nome do usuário já existe
    const vUser = allUsers.map((e) => e.userName).includes(upDateUser.userName);
    console.log('user exists', vUser);

    // Caso não exista o nome do usuário no array,
    // atualizamos o nome.
    if (vUser === false) {
      const id = upDateUser.indice;
      const index = allUsers.findIndex((e) => e.userId === id);
      console.log('indice array update', index);
      allUsers[index].userName = upDateUser.userName;
      console.log('update', allUsers);
      const newName = upDateUser.userName;
      const update = { newName, id };
      io.emit('userUpdate', update);
    } else {
      // Se o nome já existe mostra mensagem
      const userExist = 'Usuário já existe!';
      socket.emit('userExist', userExist);
    }
  });

  /**
   *  Quando o cliente conecta no chat,
   *  carrega todas as mensagens que estão salvas no banco.
   */
  const Messages = await modelChat.getAllMessages();
  console.log(Messages);
  socket.emit('previousMessage', Messages);

  /**
   * Salva todas as mensagens do cliente no banco
   * variável data = {dateTime, nickname, chatMessage}
   */

  // Obten data e hora da mensagem
  const dateTime = createOn();
  socket.on('message', (data) => {
    try {
      modelChat.saveMessage(dateTime, data.nickname, data.chatMessage);
      // console.log(result);
    } catch (error) {
      console.log(error);
    }
    const message = `${dateTime} - ${data.nickname}: ${data.chatMessage}`;
    // users.add(name);
    console.log('vamos ver', message);
    /**
     * Envia a mensagem digitada para todos clientes,
     * utilizando a variável message.
     */
    socket.broadcast.emit('message', message);
    socket.emit('message', message);
  });

  // mensagem privada
  socket.on('privateMessage', (messagePrivate) => {
    const fromPrivateId = socket.id;
    console.log('id send', fromPrivateId);
    const indexPrivate = allUsers
      .map((idName) => idName.userId)
      .indexOf(fromPrivateId);
    console.log('enviando', indexPrivate);
    console.log('hora', dateTime);

    socket.emit(
      'privateMessage',
      `${dateTime} (private) - ${allUsers[indexPrivate].userName}:  ${messagePrivate.message}`,
    );

    io.to(messagePrivate.idPrivate).emit(
      'privateMessage',
      `${dateTime} (private) - ${allUsers[indexPrivate].userName}:  ${messagePrivate.message}`,
    );

    // Salva mensagem privada
    try {
      saveMessage(
        fromPrivateId,
        messagePrivate.idPrivate,
        `${dateTime} (private) - ${allUsers[indexPrivate].userName}:  ${messagePrivate.message}`,
      );

      saveMessage(
        messagePrivate.idPrivate,
        fromPrivateId,
        `${dateTime} (private) - ${allUsers[indexPrivate].userName}:  ${messagePrivate.message}`,
      );
    } catch (error) {
      console.log(error);
    }
  });

  // Carrega as mensagens privadas
  socket.on('findMessagePrivate', async (idMessage) => {
    const userFrom = socket.id;
    // console.log('Atual', userFrom);
    const userTo = idMessage;
    // console.log('Para', userTo);
    // Recupera todas as mensagens salvas no private por Id
    const message = await modelChat.getPrivateMessage(userFrom, userTo);
    const allMessages = message.map((e) => e.message);
    console.log('todas msn', allMessages);
    socket.emit('findMessagePrivate', allMessages);
    // console.log('Todas as msn ', allMessagesPrivate);
  });

  socket.on('disconnect', () => {
    console.log('user disconnect', allUsers);
    const disconnect = socket.id;
    console.log('disconnect', disconnect);
    io.emit('disconnect', disconnect);
    // Encontra a posição do elmento no array
    const userIndex = allUsers.map((e) => e.userId).indexOf(socket.id);
    console.log('indice', userIndex);
    // Remove elemento do array
    allUsers.splice(userIndex, 1);
    console.log('novo array disconnect', allUsers);
  });
});

// Ouvindo a porta 3000
socketIoServer.listen(3000);
console.log('Express na porta 3000');
