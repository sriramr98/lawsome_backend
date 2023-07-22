import {
    ArgumentMetadata,
    Injectable,
    PipeTransform,
    UnauthorizedException,
} from '@nestjs/common';
import { FirebaseError } from '@firebase/util';
import { Firebase } from 'src/core/common/firebase.service';
import { FirebaseUser } from 'src/types/FirebaseUser';

@Injectable()
export class UserFromTokenPipe implements PipeTransform {
    public constructor(private firebase: Firebase) {}

    public async transform(
        token: string,
        _metadata: ArgumentMetadata,
    ): Promise<FirebaseUser> {
        try {
            return await this.firebase.extractUser(token);
        } catch (error: unknown) {
            if (error instanceof FirebaseError) {
                throw new UnauthorizedException(error.message);
            }

            throw new UnauthorizedException('Invalid authorization token');
        }
    }
}
