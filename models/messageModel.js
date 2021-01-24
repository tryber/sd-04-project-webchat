const connection = require('./connection');

const findAllMessages = async (collection) =>
  connection()
    .then((db) => db.collection(collection).findAll())
    .catch((err) => {
      console.error(err);
      return process.exit();
    });

const insertMessage = async (collection, message) =>
  connection()
    .then((db) => db.collection(collection).insertOne({ message }))
    .catch((err) => {
      console.error(err);
      return process.exit(1);
    });

module.exports = { findAllMessages, insertMessage };
