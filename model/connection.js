const { MongoClient } = require('mongodb');
require('dotenv').config();

const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/webchat';
const DB_NAME = process.env.DB_NAME || 'webchat';
const BD_CONFIG = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
let schema = null;

async function connection() {
  if (schema) return Promise.resolve(schema);
  return MongoClient.connect(DB_URL, BD_CONFIG)
    .then((conn) => conn.db(DB_NAME))
    .then((dbSchema) => {
      schema = dbSchema;
      return schema;
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
module.exports = connection;
