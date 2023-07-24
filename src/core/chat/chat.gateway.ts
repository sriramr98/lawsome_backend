import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    SubscribeMessage,
    WebSocketGateway,
    WsException,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { SocketMessage } from './types/SocketMessage';
import { ChatService } from './chat.service';
import { AuthGuard } from '../auth/AuthGuard';
import { FirebaseUser } from 'src/types/FirebaseUser';
import { AuthorizedWsUser } from '../auth/AuthorizedWsUser.decorator';
import { Chat } from '../convo/entities/Chats';

interface UserSocket extends Socket {
    user: FirebaseUser;
}

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection {
    constructor(
        private chatService: ChatService,
        private authGuard: AuthGuard,
    ) {}
   async afterInit(client: UserSocket) {
    console.log('Initialized');
      }
    async handleConnection(client: UserSocket) {
        console.log('client connected');
        const authToken = client.handshake.auth.authorization;

        try {
            const user = await this.authGuard.validateToken(authToken, 'ws');
            client.user = user;
            console.log("user authenticated")
        } catch (ex: any) {
            this.sendErrorToClient(client, ex);
            client.disconnect(true);
        }
    }

    @SubscribeMessage('chat:msg')
    async handleMessage(
        @ConnectedSocket() client: UserSocket,
        @MessageBody() payload: SocketMessage,
        @AuthorizedWsUser('uid') userId: string,
    ) {

       
        console.log("payload from socket",payload);
        const { conversation_id, msg } = payload;
        Chat.create({
            conversationId:conversation_id,
            userId,
            message:msg,
            sender:'user'
        })
        const subscriber = await this.chatService.chat(
            conversation_id,
            userId,
            msg,
        );

        let finalAnswer = '';
        subscriber.subscribe({
            next: (token) => {
                client.emit('chat:resp', {
                    msg: token,
                    conversation_id,
                    isLast: false,
                });
                finalAnswer += token;
            },
            complete: () => {
                client.emit('chat:resp', {
                    msg: finalAnswer,
                    conversation_id,
                    isLast: true,
                });
                Chat.create({
                    conversationId:conversation_id,
                    userId,
                    message:finalAnswer,
                    sender:'bot'
                })
            },
            error: (error) => this.sendErrorToClient(client, error),
        });
    }

    private sendErrorToClient(client: Socket, error: any) {
        client.emit('chat:err', { mesassge: error.message });
    }
}
