import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    SubscribeMessage,
    WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { SocketMessage } from './types/SocketMessage';
import { ChatService } from './chat.service';
import { AuthGuard } from '../auth/AuthGuard';
import { FirebaseUser } from 'src/types/FirebaseUser';
import { AuthorizedWsUser } from '../auth/AuthorizedWsUser.decorator';

interface UserSocket extends Socket {
    user: FirebaseUser;
}

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection {
    constructor(
        private chatService: ChatService,
        private authGuard: AuthGuard,
    ) {}

    async handleConnection(client: UserSocket) {
        console.log('client connected');
        const handshake = client.handshake;
        const authToken =
            handshake.auth.authorization || handshake.headers.authorization;

        try {
            const user = await this.authGuard.validateToken(authToken, 'ws');
            client.user = user;
            console.log('user authenticated');
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
        console.log('payload from socket', payload);
        const { conversation_id, msg } = payload;
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
            complete: async () => {
                const sources = await this.chatService.extractSources(
                    finalAnswer,
                );

                client.emit('chat:resp', {
                    msg: finalAnswer,
                    conversation_id,
                    sources: sources.map((s) => ({
                        law: s,
                    })),
                    isLast: true,
                });

                await this.chatService.addQAToConversation(
                    msg,
                    finalAnswer,
                    userId,
                    conversation_id,
                    sources,
                );
            },
            error: (error) => this.sendErrorToClient(client, error),
        });
    }

    private sendErrorToClient(client: Socket, error: any) {
        client.emit('chat:err', { mesassge: error.message });
    }
}
