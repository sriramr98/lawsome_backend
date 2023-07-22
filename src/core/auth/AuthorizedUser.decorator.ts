import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserRequest } from 'src/types/UserRequest';

export const AuthorizedUser = createParamDecorator(
    (_data: string, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest<UserRequest>();

        return _data ? request.user[_data] : request.user;
    },
);
