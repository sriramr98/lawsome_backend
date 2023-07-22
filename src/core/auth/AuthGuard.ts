import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Firebase } from '../common/firebase.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private firebase: Firebase) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractToken(request);

        if (!token) {
            throw new UnauthorizedException('Invalid Token');
        }

        try {
            const user = await this.firebase.extractUser(token);
            request['user'] = user;
        } catch (error) {
            console.log(error);
            throw new UnauthorizedException('Unable to Authorize user');
        }

        return true;
    }

    private extractToken(request: Request): string {
        const authorizationToken = request.headers['authorization'];

        if (!authorizationToken) {
            throw new UnauthorizedException('Missing authorization token');
        }

        const [bearer, token] = authorizationToken.split(' ');

        if (bearer !== 'Bearer') {
            throw new UnauthorizedException('Invalid authorization token type');
        }

        return token;
    }
}
