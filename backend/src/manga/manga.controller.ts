import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { MangaService, CreateMangaDto, MangaFilters } from './manga.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/constants';

@Controller('manga')
export class MangaController {
    constructor(private mangaService: MangaService) { }

    @Get()
    async findAll(
        @Query('page') page = '1',
        @Query('limit') limit = '20',
        @Query('status') status?: string,
        @Query('type') type?: string,
        @Query('genre') genre?: string,
        @Query('search') search?: string,
        @Query('sort') sort: 'latest' | 'popular' | 'rating' = 'latest',
        @Query('adult') adult?: string,
    ) {
        const filters: MangaFilters = {
            status,
            type,
            genreSlug: genre,
            search,
            isAdult: adult === 'true' ? true : adult === 'false' ? false : undefined,
        };

        return this.mangaService.findAll(
            parseInt(page, 10),
            parseInt(limit, 10),
            filters,
            sort,
        );
    }

    @Get(':slug')
    async findBySlug(@Param('slug') slug: string) {
        const manga = await this.mangaService.findBySlug(slug);
        if (manga) {
            // Increment views asynchronously
            this.mangaService.incrementViews(manga.id).catch(() => { });
        }
        return manga;
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.OWNER, UserRole.ADMIN)
    async create(@Body() data: CreateMangaDto) {
        return this.mangaService.create(data);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.OWNER, UserRole.ADMIN)
    async update(@Param('id') id: string, @Body() data: Partial<CreateMangaDto>) {
        return this.mangaService.update(id, data);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.OWNER, UserRole.ADMIN)
    async delete(@Param('id') id: string) {
        return this.mangaService.delete(id);
    }
}
