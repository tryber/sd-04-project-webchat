const connection = require('./connection');

const MESSAGES = 'messages';
const PRIVATE_MESSAGE = 'privateMessages';

const add = (data) =>
  connection().then((db) => db.collection(MESSAGES).insertOne({ data }));

const getAll = () =>
  connection().then((db) => db.collection(MESSAGES).find().toArray());

const getPrivateMessages = async () =>
  connection().then((db) => db.collection(PRIVATE_MESSAGE).find().toArray());
  
// chatMessage, nickname, timestamp, ReceiverNick
const addPrivateMsg = async (data) =>
  connection().then((db) => db.collection(PRIVATE_MESSAGE).insertOne({ data }));

module.exports = {
  add,
  getAll,
  addPrivateMsg,
  getPrivateMessages,
};
