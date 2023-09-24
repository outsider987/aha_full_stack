
export interface JwtPayload {
    userName: string;
    email: string;
    confirmed: boolean;
    provider: 'google' | 'local';
}
