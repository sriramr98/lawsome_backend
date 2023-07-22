import { Request } from 'express';
import { FirebaseUser } from './FirebaseUser';

export interface UserRequest extends Request {
    user: FirebaseUser;
}
