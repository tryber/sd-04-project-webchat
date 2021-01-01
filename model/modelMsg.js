const connection = require('./db');

const db = connection();

const newMessage = async (chatMessage, nickname, timestamp) => {
  const msg = await db
    .connection('message')
    .insertOne({ chatMessage, nickname, timestamp });
  return msg.ops[0];
};

const saveAllMessages = async () => {
  const msg = await db.connection('message').find({}).toArray();
  return msg;
};

module.exports = { newMessage, saveAllMessages };
