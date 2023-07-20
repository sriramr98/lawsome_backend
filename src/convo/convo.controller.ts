import { Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('convo')
export class ConvoController {
    @Get()
    getConversations() {
        return [{ message: 'hey' }];
    }
}
