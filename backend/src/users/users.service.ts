import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '../common/constants';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findByEmail(email: string): Promise<any> {
        return this.prisma.user.findUnique({ where: { email } });
    }

    async findByUsername(username: string): Promise<any> {
        return this.prisma.user.findUnique({ where: { username } });
    }

    async findById(id: string): Promise<any> {
        return this.prisma.user.findUnique({ where: { id } });
    }

    async create(data: {
        email: string;
        username: string;
        password: string;
        role?: string;
    }): Promise<any> {
        const passwordHash = await bcrypt.hash(data.password, 12);

        return this.prisma.user.create({
            data: {
                email: data.email,
                username: data.username,
                passwordHash,
                role: data.role || UserRole.MEMBER,
            },
        });
    }

    async createOwner(data: {
        email: string;
        username: string;
        password: string;
    }): Promise<any> {
        // Check if owner already exists
        const existingOwner = await this.prisma.user.findFirst({
            where: { role: UserRole.OWNER },
        });

        if (existingOwner) {
            throw new Error('Owner account already exists');
        }

        return this.create({ ...data, role: UserRole.OWNER });
    }

    async validatePassword(user: any, password: string): Promise<boolean> {
        return bcrypt.compare(password, user.passwordHash);
    }

    async updateLastLogin(userId: string): Promise<void> {
        await this.prisma.user.update({
            where: { id: userId },
            data: { lastLoginAt: new Date() },
        });
    }

    async rotateSecurityStamp(userId: string): Promise<void> {
        await this.prisma.user.update({
            where: { id: userId },
            data: { securityStamp: crypto.randomUUID() },
        });
    }

    async getAllUsers(page = 1, limit = 20) {
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                skip,
                take: limit,
                select: {
                    id: true,
                    email: true,
                    username: true,
                    role: true,
                    isEmailVerified: true,
                    avatarUrl: true,
                    lastLoginAt: true,
                    registeredAt: true,
                },
                orderBy: { registeredAt: 'desc' },
            }),
            this.prisma.user.count(),
        ]);

        return { users, total, page, limit };
    }
}
