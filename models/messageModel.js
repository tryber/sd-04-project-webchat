const moment = require('moment');
const connection = require('./connection');

const findAllMessages = async () =>
  connection()
    .then((db) => db.collection('messages').find({}, { _id: 0 }).toArray())
    .catch((err) => {
      console.error(err);
      return process.exit();
    });

const insertMessage = async (chatMessage, nickname) => {
  const messageDate = moment(new Date()).format('DD-MM-yyyy HH-mm:ss')
  connection()
    .then((db) => {
      db.collection('messages').insertOne({ chatMessage, nickname, messageDate })
    })
    .catch((err) => {
      console.error(err);
      return process.exit(1);
    });
  return `${messageDate} ${nickname}: ${chatMessage}`
}

module.exports = { findAllMessages, insertMessage };
