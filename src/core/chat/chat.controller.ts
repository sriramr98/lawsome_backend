import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
} from '@nestjs/common';
import { AuthorizedUser } from '../auth/AuthorizedHttpUser.decorator';
import { CreateFeedbackDto } from './models/CreateFeedback.dto';
import { ChatService } from './chat.service';
import { AuthGuard } from '../auth/AuthGuard';
import Result from 'src/types/Result';

@Controller('chat')
@UseGuards(AuthGuard)
export class ChatController {
    constructor(private chatService: ChatService) {}

    @Post('feedback')
    @HttpCode(HttpStatus.CREATED)
    async feedback(
        @AuthorizedUser('uid') userId: string,
        @Body() feedback: CreateFeedbackDto,
    ) {
        await this.chatService.addFeedback(
            feedback.chat_id,
            userId,
            feedback.is_liked,
            feedback.feedback,
        );
    }
}
