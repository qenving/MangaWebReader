import { Controller, Get, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { InstallService, DatabaseConfig, OwnerSetup } from './install.service';

@Controller('install')
export class InstallController {
    constructor(private installService: InstallService) { }

    @Get('status')
    async getStatus() {
        return this.installService.getInstallationStatus();
    }

    @Post('test-database')
    @HttpCode(HttpStatus.OK)
    async testDatabase(@Body() config: DatabaseConfig) {
        return this.installService.testDatabaseConnection(config);
    }

    @Post('create-owner')
    async createOwner(@Body() data: OwnerSetup) {
        return this.installService.createOwnerAccount(data);
    }

    @Post('complete')
    async completeInstallation() {
        return this.installService.completeInstallation();
    }
}
