import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserRequest } from 'src/types/UserRequest';

export const AuthorizedUser = createParamDecorator(
    (key: string, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest<UserRequest>();

        return key ? request.user[key] : request.user;
    },
);
