import {
    Body,
    Controller,
    Get,
    Post,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { CreateConvoDto } from './dto/CreateConvo.dto';
import Result from 'src/types/Result';
import { AuthorizedUser } from 'src/core/auth/AuthorizedUser.decorator';
import { AuthGuard } from '../auth/AuthGuard';

@Controller('convo')
@UseGuards(AuthGuard)
export class ConvoController {
    @Get()
    getConversations(@AuthorizedUser('uid') userid: string) {
        return Result.success({
            userId: userid,
        });
    }

    @Post()
    @UsePipes(new ValidationPipe({ stopAtFirstError: true }))
    createConversation(@Body() convoBody: CreateConvoDto) {
        return Result.success(convoBody);
    }
}
