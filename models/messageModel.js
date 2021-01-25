const connection = require('./connection');

const findAllMessages = async () =>
  connection()
    .then((db) => db.collection('messages').findAll())
    .catch((err) => {
      console.error(err);
      return process.exit();
    });

const insertMessage = async (message) =>
  connection()
    .then((db) => db.collection('messages').insertOne({ message }))
    .catch((err) => {
      console.error(err);
      return process.exit(1);
    });

module.exports = { findAllMessages, insertMessage };
