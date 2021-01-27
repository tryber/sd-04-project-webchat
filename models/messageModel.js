const connection = require('./connection');

const findAllMessages = async (collection) =>
  connection()
    .then((db) => db.collection(collection).find().toArray())
    .catch((err) => {
      console.error(err);
      return process.exit();
    });

const insertMessage = async (chatMessage, collection) =>
  connection()
    .then(async (db) => {
      const document = await db.collection(collection).insertOne(chatMessage);
      return document.ops[0];
    })
    .catch((err) => {
      console.error(err);
      return process.exit(1);
    });

module.exports = { findAllMessages, insertMessage };
