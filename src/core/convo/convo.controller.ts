import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Res,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { CreateConvoDto } from './dto/CreateConvo.dto';
import Result from 'src/types/Result';
import { AuthorizedUser } from 'src/core/auth/AuthorizedUser.decorator';
import { AuthGuard } from '../auth/AuthGuard';
import { ConvoService } from './convo.service';

@Controller('convo')
@UseGuards(AuthGuard)
export class ConvoController {
    constructor(private convoService: ConvoService) {}

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
    ) {
        const chatHistory =
            await this.convoService.getChatHistoryOfConversation(
                convoId,
                userid,
            );

        return Result.success(chatHistory);
    }

    @Post()
    @UsePipes(new ValidationPipe({ stopAtFirstError: true }))
    async createConversation(
        @Body() convoBody: CreateConvoDto,
        @AuthorizedUser('uid') userId: string,
    ) {
        await this.convoService.createConversation(convoBody.title, userId);
    }
}
