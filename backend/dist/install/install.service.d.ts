import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
export interface InstallationStatus {
    isInstalled: boolean;
    hasOwner: boolean;
    databaseConnected: boolean;
}
export declare class DatabaseConfig {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
}
export declare class OwnerSetup {
    email: string;
    username: string;
    password: string;
}
export declare class InstallService {
    private configService;
    private prisma;
    private usersService;
    constructor(configService: ConfigService, prisma: PrismaService, usersService: UsersService);
    getInstallationStatus(): Promise<InstallationStatus>;
    testDatabaseConnection(config: DatabaseConfig): Promise<{
        success: boolean;
        error?: string;
    }>;
    createOwnerAccount(data: OwnerSetup): Promise<{
        success: boolean;
        error?: string;
    }>;
    completeInstallation(): Promise<{
        success: boolean;
        recoveryKey?: string;
    }>;
    private generateRecoveryKey;
}
