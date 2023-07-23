import { Module, Global } from '@nestjs/common';
import { Firebase } from './firebase.service';

@Global()
@Module({
    providers: [Firebase],
    exports: [Firebase],
})
export class FirebaseModule {}
