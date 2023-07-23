import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const AuthorizedWsUser = createParamDecorator(
    (key: string, context: ExecutionContext) => {
        const client = context.switchToWs().getClient();
        const user = client.user;

        return key ? user[key] : user;
    },
);
