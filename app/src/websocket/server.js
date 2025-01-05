const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: '*', // 必要に応じてクライアントのURLに変更
    methods: ['GET', 'POST'],
    credentials: true,
  },
});
const sticky = require('sticky-session');

const PORT = process.env.PORT || 4000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post('/message', (req, res) => {
  try {
    const { chat_id } = req.body;
    if (!chat_id) {
      return res.status(400).json({ error: 'chat_id is required' });
    }

    // デバッグ用のログを追加
    const room = io.sockets.adapter.rooms.get(chat_id);
    console.log(`Room ${chat_id} has ${room ? room.size : 0} clients`);

    // ブロードキャストを使用してメッセージを送信
    io.to(chat_id).emit('message', req.body);
    
    // 成功レスポンスを返す
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
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
        // デバッグ用のログを追加
        const room = io.sockets.adapter.rooms.get(chatId);
        console.log(`Room ${chatId} has ${room ? room.size : 0} clients`);
        io.to(chatId).emit('message', msg);
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
