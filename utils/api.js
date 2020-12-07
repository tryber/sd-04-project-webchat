import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3000' });

// const headers = { 'Content-Type': 'application/json' };

const insertMessage = (nickname, message) =>
  api.post('/message', { nickname, message });

export default {
  insertMessage,
};
