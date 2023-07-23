import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Firebase } from '../common/firebase.service';
import { FirebaseUser } from 'src/types/FirebaseUser';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private firebase: Firebase) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const token = this.extractToken(context);
        const user = await this.validateToken(token, 'http');

        this.addUserToContext(context, user);
        return true;
    }

    async validateToken(
        authToken: string,
        type: string,
    ): Promise<FirebaseUser> {
        if (!authToken) {
            this.throwError('Missing authorization token', type);
        }

        const [bearer, token] = authToken.split(' ');

        if (bearer !== 'Bearer') {
            this.throwError('Invalid authorization token type', type);
        }

        try {
            const user = await this.firebase.extractUser(token);
            return user;
        } catch (error) {
            this.throwError('Invalid authorization token', type);
        }
    }

    private extractToken(context: ExecutionContext): string {
        const headers = context.switchToHttp().getRequest().headers;

        const authorizationToken = headers['authorization'];

        return authorizationToken;
    }

    private throwError(message: string, type: string) {
        const ex =
            type === 'ws'
                ? new WsException(message)
                : new UnauthorizedException(message);
        throw ex;
    }

    private addUserToContext(context: ExecutionContext, user: any) {
        const request = context.switchToHttp().getRequest();
        request.user = user;
    }
}
