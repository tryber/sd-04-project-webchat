const connection = require('./connection');

const MESSAGES = 'messages';

const add = (data) =>
  connection().then((db) => db.collection(MESSAGES).insertOne({ data }));

const getAll = () =>
  connection().then((db) => db.collection(MESSAGES).find().toArray());

module.exports = {
  add,
  getAll,
};
