// app/api/socket/route.ts

import { NextRequest, NextResponse } from 'next/server';
import type { Socket as NetSocket } from 'net';
import type { Server as HttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';

type ResponseWebSocket = NextResponse & {
  socket: NetSocket & { server: HttpServer & { io?: SocketServer } };
};

export async function POST(req: NextRequest, res: ResponseWebSocket) {
  if (res.socket.server.io) {
    return NextResponse.json({ message: 'already-set-up' });
  }

  const io = new SocketServer(res.socket.server, {
    addTrailingSlash: false,
  });

  io.on('connection', (socket) => {
    const clientId = socket.id;
    console.log(`A client connected. ID: ${clientId}`);

    socket.on('message', (data) => {
      io.emit('message', data);
      console.log('Received message:', data);
    });
  });

  res.socket.server.io = io;
  return NextResponse.json({ message: 'socket-server-set-up' });
}