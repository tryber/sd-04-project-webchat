const connection = require('./connection');

const createData = (nickname, chatMessage, date) => {
  connection().then((db) => {
    db.collection('messages').insertOne({
      nickname,
      chatMessage,
      date,
    });
  });
};

const takeData = async () => {
  return await connection().then((db) => db.collection('messages').find().toArray());
};

module.exports = { createData, takeData };
