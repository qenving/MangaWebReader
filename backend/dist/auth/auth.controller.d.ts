import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    getProfile(req: any): any;
    login(dto: LoginDto): Promise<import("./auth.service").AuthResponse>;
    register(dto: RegisterDto): Promise<import("./auth.service").AuthResponse>;
}
