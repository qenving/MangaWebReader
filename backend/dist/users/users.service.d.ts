import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<any>;
    findByUsername(username: string): Promise<any>;
    findById(id: string): Promise<any>;
    create(data: {
        email: string;
        username: string;
        password: string;
        role?: string;
    }): Promise<any>;
    createOwner(data: {
        email: string;
        username: string;
        password: string;
    }): Promise<any>;
    validatePassword(user: any, password: string): Promise<boolean>;
    updateLastLogin(userId: string): Promise<void>;
    rotateSecurityStamp(userId: string): Promise<void>;
    getAllUsers(page?: number, limit?: number): Promise<{
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
