const connection = require('./connection');

const save = ({ nickname, chatMessage }) =>
  connection().then((db) =>
    db
      .collection('messages')
      .insertOne({ nickname, chatMessage, timestamp: new Date().toLocaleString() }),
  );

const getAll = async () => {
  const db = await connection();
  return db.collection('messages').find({}).toArray();
};

const msgSendTo = ({ nickname, chatMessage, to }) =>
  connection().then((db) =>
    db
      .collection('private')
      .insertOne({ nickname, chatMessage, timestamp: new Date().toLocaleString(), to }),
  );

const getPrivate = async (nickname, to) => {
  const db = await connection();
  return db.collection('private').find({ nickname, to }).toArray();
};

module.exports = {
  save,
  getAll,
  msgSendTo,
  getPrivate,
};
