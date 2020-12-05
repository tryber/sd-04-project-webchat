const connection = require('./connection');

const getMessages = async () =>
  connection().then((db) => db.collection('messages').find({}).toArray());

module.exports = { getMessages };
