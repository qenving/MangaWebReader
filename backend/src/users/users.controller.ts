import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/constants';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get()
    @Roles(UserRole.OWNER, UserRole.ADMIN)
    async findAll(
        @Query('page') page = '1',
        @Query('limit') limit = '20',
    ) {
        return this.usersService.getAllUsers(
            parseInt(page, 10),
            parseInt(limit, 10),
        );
    }
}
