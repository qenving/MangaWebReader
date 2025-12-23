"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstallService = exports.OwnerSetup = exports.DatabaseConfig = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const users_service_1 = require("../users/users.service");
class DatabaseConfig {
    host;
    port;
    username;
    password;
    database;
}
exports.DatabaseConfig = DatabaseConfig;
class OwnerSetup {
    email;
    username;
    password;
}
exports.OwnerSetup = OwnerSetup;
let InstallService = class InstallService {
    configService;
    prisma;
    usersService;
    constructor(configService, prisma, usersService) {
        this.configService = configService;
        this.prisma = prisma;
        this.usersService = usersService;
    }
    async getInstallationStatus() {
        const isInstalled = this.configService.get('IS_INSTALLED') === 'true';
        let databaseConnected = false;
        let hasOwner = false;
        try {
            await this.prisma.$queryRaw `SELECT 1`;
            databaseConnected = true;
            const ownerCount = await this.prisma.user.count({
                where: { role: 'OWNER' },
            });
            hasOwner = ownerCount > 0;
        }
        catch {
        }
        return { isInstalled, hasOwner, databaseConnected };
    }
    async testDatabaseConnection(config) {
        try {
            const url = `mysql://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}`;
            if (!config.host || !config.username || !config.database) {
                return { success: false, error: 'Missing required fields' };
            }
            return { success: true };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async createOwnerAccount(data) {
        try {
            const status = await this.getInstallationStatus();
            if (status.hasOwner) {
                return { success: false, error: 'Owner account already exists' };
            }
            await this.usersService.createOwner(data);
            return { success: true };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async completeInstallation() {
        try {
            const recoveryKey = this.generateRecoveryKey();
            await this.prisma.systemConfig.upsert({
                where: { key: 'recovery_key_hash' },
                update: { value: recoveryKey },
                create: { key: 'recovery_key_hash', value: recoveryKey, isEncrypted: true },
            });
            await this.prisma.systemConfig.upsert({
                where: { key: 'is_installed' },
                update: { value: 'true' },
                create: { key: 'is_installed', value: 'true' },
            });
            return { success: true, recoveryKey };
        }
        catch (error) {
            return { success: false };
        }
    }
    generateRecoveryKey() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const segments = 4;
        const segmentLength = 4;
        const parts = [];
        for (let i = 0; i < segments; i++) {
            let segment = '';
            for (let j = 0; j < segmentLength; j++) {
                segment += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            parts.push(segment);
        }
        return parts.join('-');
    }
};
exports.InstallService = InstallService;
exports.InstallService = InstallService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService,
        users_service_1.UsersService])
], InstallService);
//# sourceMappingURL=install.service.js.map