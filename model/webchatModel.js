const connection = require("./connection");

const add = (data) =>
  connection().then((db) => db.collection("messages").insertOne({ data }));

const getAll = () =>
  connection().then((db) => db.collection("messages").find().toArray());

module.exports = {
  add,
  getAll,
};
