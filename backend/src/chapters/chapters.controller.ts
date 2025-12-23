import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ChaptersService, CreateChapterDto } from './chapters.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/constants';

@Controller('chapters')
export class ChaptersController {
    constructor(private chaptersService: ChaptersService) { }

    @Get('latest')
    async getLatest(@Query('limit') limit = '20') {
        return this.chaptersService.getLatestChapters(parseInt(limit, 10));
    }

    @Get('manga/:mangaId')
    async findByManga(
        @Param('mangaId') mangaId: string,
        @Query('page') page = '1',
        @Query('limit') limit = '50',
    ) {
        return this.chaptersService.findByMangaId(
            mangaId,
            parseInt(page, 10),
            parseInt(limit, 10),
        );
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        const chapter = await this.chaptersService.findById(id);
        if (chapter) {
            const adjacent = await this.chaptersService.findAdjacentChapters(
                chapter.mangaId,
                chapter.number,
            );
            return { ...chapter, ...adjacent };
        }
        return chapter;
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.OWNER, UserRole.ADMIN)
    async create(@Body() data: CreateChapterDto) {
        return this.chaptersService.create(data);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.OWNER, UserRole.ADMIN)
    async update(@Param('id') id: string, @Body() data: Partial<CreateChapterDto>) {
        return this.chaptersService.update(id, data);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.OWNER, UserRole.ADMIN)
    async delete(@Param('id') id: string) {
        return this.chaptersService.delete(id);
    }

    @Post('upload')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.OWNER, UserRole.ADMIN)
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req: any, file: any, cb: any) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return cb(null, `${randomName}${extname(file.originalname)}`);
            },
        }),
    }))
    async uploadFile(@UploadedFile() file: any) {
        return {
            url: `/uploads/${file.filename}`,
            filename: file.filename,
            originalName: file.originalname,
            mimeType: file.mimetype,
        };
    }
}
