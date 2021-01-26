const connection = require('./connection');

const findAllMessages = async (collection) =>
  connection()
    .then((db) => db.collection(collection).find().toArray())
    .catch((err) => {
      console.error(err);
      return process.exit();
    });

const insertMessage = async (chatMessage, collection) => {
  connection()
    .then((db) => {
      db.collection(collection).insertOne(chatMessage);
    })
    .catch((err) => {
      console.error(err);
      return process.exit(1);
    });

  module.exports = { findAllMessages, insertMessage };
