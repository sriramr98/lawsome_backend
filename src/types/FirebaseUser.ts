export interface FirebaseUser {
    iss: string;
    aud: string;
    auth_time: number;
    user_id?: string;
    sub: string;
    iat: number;
    exp: number;
    email?: string;
    email_verified?: boolean;
    firebase: {
        identities: {
            [key: string]: any;
        };
        sign_in_provider: string;
    };
    phone_number?: string;
    uid: string;
}
