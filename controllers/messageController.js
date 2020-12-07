const messageModel = require('../models/messageModel');

const insertMessage = async (req, res) => {
  try {
    const { nickname, message } = req.body;
    const insertedMessage = await messageModel.insertMessage({
      nickname,
      message,
    });
    res.status(201).json(insertedMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

module.exports = {
  insertMessage,
};
