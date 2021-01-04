const connection = require('./connection');

const saveMessage = async (chatMessage, nickname, timestamp) => {
  const db = await connection();
  const stmt = await db
    .collection('messages')
    .insertOne({ chatMessage, nickname, timestamp });
  const { insertedId } = stmt;
  return { _id: insertedId, chatMessage, nickname, timestamp };
};

const getMessages = async () => {
  const db = await connection();
  const stmt = await db.collection('messages').find({}).toArray();
  return stmt;
};

module.exports = { saveMessage, getMessages };
