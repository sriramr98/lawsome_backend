import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { SocketMessage } from './types/SocketMessage';
import { ChatService } from './chat.service';

@WebSocketGateway()
export class ChatGateway {
    constructor(private chatService: ChatService) {}

    @SubscribeMessage('chat:msg')
    async handleMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: SocketMessage,
    ) {
        const userId = 'jD7eF2XwFDPAGxe7NA44uLhOGp63';
        const { conversation_id, msg } = payload;

        const subscriber = await this.chatService.chat(
            conversation_id,
            userId,
            msg,
        );

        subscriber.subscribe((token) => {
            client.emit('chat:resp', {
                msg: token,
                conversation_id,
                isLast: false,
            });
        });

        client.emit('chat:resp', { msg: '', conversation_id, isLast: true });
    }
}
