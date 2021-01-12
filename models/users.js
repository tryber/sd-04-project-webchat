const connection = require('./connection');

const getAll = async () => connection().then((db) => db.collection('messages').find().toArray());

const onlineUsers = async (user) => {
  await connection().then((db) =>
    db.collection('onlineUsers').insertOne({ user }));
};

const addMessages = async (data) => {
  await connection().then((db) =>
    db.collection('messages').insertOne({ data }));
};

module.exports = {
  onlineUsers,
  getAll,
  addMessages,
};
