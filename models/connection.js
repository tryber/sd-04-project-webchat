const { MongoClient } = require('mongodb');
require('dotenv').config();

const { DB_NAME } = process.env;
const DB_URL = process.env.DB_URL || 'mongodb://mongodb:27017/webchat';

let schema;

const connection = async () => {
  if (schema) return Promise.resolve(schema);
  try {
    const conn = await MongoClient.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    schema = conn.db(DB_NAME);
    return schema;
  } catch (_e) {
    console.error('DB connection failed');
  }
};

module.exports = connection;
