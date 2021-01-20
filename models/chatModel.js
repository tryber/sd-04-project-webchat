const connection = require('./connection');

const saveMessage = async (chatMessage, nickname, timestamp) => {
  const db = await connection();
  const stmt = await db
    .collection('messages')
    .insertOne({ chatMessage, nickname, timestamp });
  const { insertedId } = stmt;
  return { _id: insertedId, chatMessage, nickname, timestamp };
};

const savePrivateMessage = async (chatMessage, nickname, timestamp, receiver) => {
  const db = await connection();
  const stmt = await db
    .collection('private')
    .insertOne({ chatMessage, nickname, timestamp, receiver });
  const { insertedId } = stmt;
  return { _id: insertedId, chatMessage, nickname, timestamp, receiver };
};

const getMessages = async () => {
  const db = await connection();
  const stmt = await db.collection('messages').find({}).toArray();
  return stmt;
};

const getPrivateMessages = async () => {
  const db = await connection();
  const stmt = await db.collection('privates').find({}).toArray();
  return stmt;
};

module.exports = { saveMessage, savePrivateMessage, getMessages, getPrivateMessages };
