import { Injectable, UnauthorizedException } from '@nestjs/common';
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

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (user && await this.usersService.validatePassword(user, password)) {
            return user;
        }
        return null;
    }

    async login(email: string, password: string): Promise<AuthResponse> {
        const user = await this.validateUser(email, password);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        await this.usersService.updateLastLogin(user.id);

        const payload: JwtPayload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            securityStamp: user.securityStamp,
        };

        return {
            accessToken: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.role,
                avatarUrl: user.avatarUrl,
            },
        };
    }

    async register(data: {
        email: string;
        username: string;
        password: string;
    }): Promise<AuthResponse> {
        // Check existing user
        const existingEmail = await this.usersService.findByEmail(data.email);
        if (existingEmail) {
            throw new UnauthorizedException('Email already registered');
        }

        const existingUsername = await this.usersService.findByUsername(data.username);
        if (existingUsername) {
            throw new UnauthorizedException('Username already taken');
        }

        const user = await this.usersService.create(data);

        const payload: JwtPayload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            securityStamp: user.securityStamp,
        };

        return {
            accessToken: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.role,
                avatarUrl: user.avatarUrl,
            },
        };
    }
}
