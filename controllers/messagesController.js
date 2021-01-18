const messagesModels = require('../models/messagesModel');

const sendPublicMensage = (io) => async (req, res) => {
  try {
    const { chatMessage, nickname } = req.body;
    

    const addMessage = await messagesModels.add('nickname', chatMessage, new Date());
    const message = `${addMessage.dateMessage} ${nickname} ${chatMessage}`

    io.emit('message', message);
    
    return res.status(200).json(message);
  } catch (e) {
    return e;
  }
}

module.exports = {
  sendPublicMensage,
};
