import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { CreateConvoDto } from './dto/CreateConvo.dto';
import Result from 'src/types/Result';

@Controller('convo')
export class ConvoController {
    @Get()
    getConversations() {
        return Result.success([]);
    }

    @Post()
    @UsePipes(new ValidationPipe({ stopAtFirstError: true }))
    createConversation(@Body() convoBody: CreateConvoDto) {
        return Result.success(convoBody);
    }
}
