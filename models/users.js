const connection = require('./connection');

const getAll = async () => connection().then((db) => db.collection('chats').find().toArray());

const onlineUsers = async (user) => {
  await connection().then((db) =>
    db.collection('onlineUsers').insertOne({ user }));
};

const addMessages = async (nickname, message, timestamp) => {
  await connection().then((db) =>
    db.collection('messages').insertOne({ nickname, message, timestamp }));
};

module.exports = {
  onlineUsers,
  getAll,
  addMessages,
};
