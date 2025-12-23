import { InstallService, DatabaseConfig, OwnerSetup } from './install.service';
export declare class InstallController {
    private installService;
    constructor(installService: InstallService);
    getStatus(): Promise<import("./install.service").InstallationStatus>;
    testDatabase(config: DatabaseConfig): Promise<{
        success: boolean;
        error?: string;
    }>;
    createOwner(data: OwnerSetup): Promise<{
        success: boolean;
        error?: string;
    }>;
    completeInstallation(): Promise<{
        success: boolean;
        recoveryKey?: string;
    }>;
}
