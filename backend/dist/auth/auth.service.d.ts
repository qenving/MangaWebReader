import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
    securityStamp: string;
}
export interface AuthResponse {
    accessToken: string;
    user: {
        id: string;
        email: string;
        username: string;
        role: string;
        avatarUrl: string | null;
    };
}
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<any>;
    login(email: string, password: string): Promise<AuthResponse>;
    register(data: {
        email: string;
        username: string;
        password: string;
    }): Promise<AuthResponse>;
}
