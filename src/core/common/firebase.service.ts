import { Injectable } from '@nestjs/common';
import admin, { ServiceAccount } from 'firebase-admin';
import * as serviceAccount from './../../../firebase-conf.json';
import { ConfigService } from '@nestjs/config';
import { FirebaseUser } from 'src/types/FirebaseUser';

@Injectable()
export class Firebase {
    constructor(private config: ConfigService) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as ServiceAccount),
        });
    }

    public async extractUser(token: string): Promise<FirebaseUser> {
        return await admin.auth().verifyIdToken(token, true);
    }
}
