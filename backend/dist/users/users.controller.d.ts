import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    findAll(page?: string, limit?: string): Promise<{
        users: {
            id: string;
            email: string;
            role: string;
            isEmailVerified: boolean;
            username: string;
            avatarUrl: string | null;
            lastLoginAt: Date | null;
            registeredAt: Date;
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
}
