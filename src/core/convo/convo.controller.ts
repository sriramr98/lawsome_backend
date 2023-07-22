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
import { AuthorizedUser } from 'src/decorators/AuthorizedUser.decorator';
import { UserFromTokenPipe } from 'src/decorators/UserFromToken.pipe';
import { FirebaseUser } from 'src/types/FirebaseUser';

@Controller('convo')
export class ConvoController {
    @Get()
    getConversations(@AuthorizedUser(UserFromTokenPipe) user: FirebaseUser) {
        return Result.success({
            userId: user.uid,
        });
    }

    @Post()
    @UsePipes(new ValidationPipe({ stopAtFirstError: true }))
    createConversation(@Body() convoBody: CreateConvoDto) {
        return Result.success(convoBody);
    }
}
