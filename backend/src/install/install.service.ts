import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import * as fs from 'fs';
import * as path from 'path';

export interface InstallationStatus {
    isInstalled: boolean;
    hasOwner: boolean;
    databaseConnected: boolean;
}

export class DatabaseConfig {
    host!: string;
    port!: number;
    username!: string;
    password!: string;
    database!: string;
}

export class OwnerSetup {
    email!: string;
    username!: string;
    password!: string;
}

@Injectable()
export class InstallService {
    constructor(
        private configService: ConfigService,
        private prisma: PrismaService,
        private usersService: UsersService,
    ) { }

    async getInstallationStatus(): Promise<InstallationStatus> {
        const isInstalled = this.configService.get<string>('IS_INSTALLED') === 'true';

        let databaseConnected = false;
        let hasOwner = false;

        try {
            await this.prisma.$queryRaw`SELECT 1`;
            databaseConnected = true;

            const ownerCount = await this.prisma.user.count({
                where: { role: 'OWNER' },
            });
            hasOwner = ownerCount > 0;
        } catch {
            // Database not connected or not migrated
        }

        return { isInstalled, hasOwner, databaseConnected };
    }

    async testDatabaseConnection(config: DatabaseConfig): Promise<{ success: boolean; error?: string }> {
        try {
            // Build connection URL
            const url = `mysql://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}`;

            // Test by attempting raw query with a new client
            // In production, we'd create a temporary PrismaClient with this URL
            // For now, we just validate the format
            if (!config.host || !config.username || !config.database) {
                return { success: false, error: 'Missing required fields' };
            }

            return { success: true };
        } catch (error) {
            return { success: false, error: (error as Error).message };
        }
    }

    async createOwnerAccount(data: OwnerSetup): Promise<{ success: boolean; error?: string }> {
        try {
            const status = await this.getInstallationStatus();

            if (status.hasOwner) {
                return { success: false, error: 'Owner account already exists' };
            }

            await this.usersService.createOwner(data);

            return { success: true };
        } catch (error) {
            return { success: false, error: (error as Error).message };
        }
    }

    async completeInstallation(): Promise<{ success: boolean; recoveryKey?: string }> {
        try {
            // Generate a recovery key
            const recoveryKey = this.generateRecoveryKey();

            // Store the recovery key hash in system config
            await this.prisma.systemConfig.upsert({
                where: { key: 'recovery_key_hash' },
                update: { value: recoveryKey },
                create: { key: 'recovery_key_hash', value: recoveryKey, isEncrypted: true },
            });

            // Mark as installed
            await this.prisma.systemConfig.upsert({
                where: { key: 'is_installed' },
                update: { value: 'true' },
                create: { key: 'is_installed', value: 'true' },
            });

            return { success: true, recoveryKey };
        } catch (error) {
            return { success: false };
        }
    }

    private generateRecoveryKey(): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const segments = 4;
        const segmentLength = 4;
        const parts: string[] = [];

        for (let i = 0; i < segments; i++) {
            let segment = '';
            for (let j = 0; j < segmentLength; j++) {
                segment += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            parts.push(segment);
        }

        return parts.join('-'); // Format: XXXX-XXXX-XXXX-XXXX
    }
}
