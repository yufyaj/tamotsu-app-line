const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {});
const sticky = require('sticky-session');

const PORT = process.env.PORT || 1000;

app.get('/', (req, res) => {
  res.send('Hello World');
});

const isWorker = sticky.listen(http, PORT);

/*
 * サーバの接続
 */
if (isWorker) {
  console.log(`Server is running on port ${PORT}`);
  io.on('connection', function (socket) {
    console.log('client connected');

    socket.on('joinChat', chatId => {
      try {
        console.log(`client joined chat: ${chatId}`);
        socket.join(chatId);
      } catch (error) {
        console.error('Join chat error:', error);
      }
    });

    socket.on('message', msg => {
      try {
        console.log('message', msg);
        const chatId = msg.chat_id;
        console.log('chatId', chatId);
        io.to(chatId).emit('message', msg);
        // 送信元に確認を返す
        socket.emit('messageSent')
      } catch (error) {
        console.error('Message error:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('client disconnected');
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });
}
