
export interface JwtPayload {
    userName: string;
    email: string;
    provider: 'google' | 'local';
}
