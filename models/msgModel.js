const connection = require('./connection');

const getAllMsg = async () =>
  connection()
    .then((db) => db.collection('messages').find({}).toArray());

const createMsg = async (chatMessage, nickname, timestamp) =>
  connection()
    .then((db) =>
      db.collection('messages').insertOne({ chatMessage, nickname, timestamp }));

const createPrivateMsg = async (chatMessage, nickname, timestamp, ReceiverNick) =>
  connection()
    .then((db) =>
      db.collection('privateMessages').insertOne({ chatMessage, nickname, timestamp, ReceiverNick }));

const getPrivateMessages = async () =>
  connection()
    .then((db) => db.collection('privateMessages').find({}).toArray());

module.exports = { getAllMsg, createMsg, getPrivateMessages, createPrivateMsg };
