const rescue = require('express-rescue');
const { getAll } = require('../models/genericModel');

const chat = rescue(async (_req, res) => {
  const messages = await getAll('messages', { _id: false });
  res.render('index', { chat: { messages, name: 'Chat Geral' } });
});

module.exports = { chat };
