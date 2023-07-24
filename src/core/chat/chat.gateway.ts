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

interface UserSocket extends Socket {
    user: FirebaseUser;
}

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection {
    constructor(
        private chatService: ChatService,
        private authGuard: AuthGuard,
    ) {}

    async handleConnection(client: UserSocket) {
        console.log('client connected');
        const authToken = client.handshake.headers.authorization;

        try {
            const user = await this.authGuard.validateToken(authToken, 'ws');
            client.user = user;
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
        try {
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
                    try {
                        const sources = await this.chatService.extractSources(
                            finalAnswer,
                        );
                        console.log({ sources });
                        client.emit('chat:resp', {
                            msg: finalAnswer,
                            conversation_id,
                            sources,
                            isLast: true,
                        });
                    } catch (ex: any) {
                        this.sendErrorToClient(client, ex);
                    }
                },
                error: (error) => this.sendErrorToClient(client, error),
            });
        } catch (ex: any) {
            this.sendErrorToClient(client, ex);
        }
    }

    private sendErrorToClient(client: Socket, error: any) {
        client.emit('chat:err', { mesassge: error.message });
    }
}
