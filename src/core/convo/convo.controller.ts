import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Query,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { CreateConvoDto } from './dto/CreateConvo.dto';
import Result from 'src/types/Result';
import { AuthorizedUser } from 'src/core/auth/AuthorizedHttpUser.decorator';
import { ConvoService } from './convo.service';
import { AuthGuard } from '../auth/AuthGuard';
import { ChatService } from '../chat/chat.service';

@Controller('convo')
@UseGuards(AuthGuard)
export class ConvoController {
    constructor(
        private convoService: ConvoService,
        private chatService: ChatService,
    ) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    async getConversations(@AuthorizedUser('uid') userid: string) {
        const conversations = await this.convoService.getConversations(userid);
        return Result.success(conversations);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async getChatHistory(
        @AuthorizedUser('uid') userid: string,
        @Param('id') convoId: string,
        @Query('page') page: number,
        @Query('limit') limit: number,
    ) {
        console.log('convoId', convoId);
        const chatHistory = await this.chatService.getChatHistoryOfConversation(
            convoId,
            userid,
            limit,
            page,
        );

        return Result.success(chatHistory);
    }

    @Post()
    @UsePipes(new ValidationPipe({ stopAtFirstError: true }))
    async createConversation(
        @Body() convoBody: CreateConvoDto,
        @AuthorizedUser('uid') userId: string,
    ) {
        const reponse = await this.convoService.createConversation(
            convoBody.title,
            userId,
        );
        return Result.success(reponse);
    }
}
