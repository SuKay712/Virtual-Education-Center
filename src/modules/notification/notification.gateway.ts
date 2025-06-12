import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  namespace: '/notification',
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    // Có thể log hoặc xử lý khi client kết nối
  }

  handleDisconnect(client: Socket) {
    // Có thể log hoặc xử lý khi client ngắt kết nối
  }

  @SubscribeMessage('join')
  handleJoin(client: Socket, userId: number) {
    client.join(`user_${userId}`);
    // Có thể log hoặc xử lý khi user join room
  }

  // Gửi thông báo đến một user cụ thể
  sendNotificationToUser(userId: number, message: string) {
    this.server.to(`user_${userId}`).emit('notification', {
      message,
      timestamp: new Date(),
    });
  }
}
