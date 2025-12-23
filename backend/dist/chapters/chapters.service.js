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
exports.ChaptersService = exports.CreateChapterDto = exports.ChapterImage = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
class ChapterImage {
    url;
    width;
    height;
}
exports.ChapterImage = ChapterImage;
class CreateChapterDto {
    mangaId;
    number;
    title;
    volume;
    images;
    sourceOrigin;
    sourceExternalId;
    isLocked;
}
exports.CreateChapterDto = CreateChapterDto;
let ChaptersService = class ChaptersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByMangaId(mangaId, page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        const [chapters, total] = await Promise.all([
            this.prisma.chapter.findMany({
                where: { mangaId },
                skip,
                take: limit,
                orderBy: { number: 'desc' },
                select: {
                    id: true,
                    number: true,
                    title: true,
                    volume: true,
                    releaseDate: true,
                    views: true,
                    isLocked: true,
                },
            }),
            this.prisma.chapter.count({ where: { mangaId } }),
        ]);
        return {
            data: chapters,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
    async findById(id) {
        const chapter = await this.prisma.chapter.findUnique({
            where: { id },
            include: {
                manga: {
                    select: {
                        id: true,
                        slug: true,
                        titleEn: true,
                        coverUrl: true,
                    },
                },
            },
        });
        if (chapter) {
            await this.prisma.chapter.update({
                where: { id },
                data: { views: { increment: 1 } },
            });
        }
        return chapter;
    }
    async findAdjacentChapters(mangaId, currentNumber) {
        const [prev, next] = await Promise.all([
            this.prisma.chapter.findFirst({
                where: { mangaId, number: { lt: currentNumber } },
                orderBy: { number: 'desc' },
                select: { id: true, number: true, title: true },
            }),
            this.prisma.chapter.findFirst({
                where: { mangaId, number: { gt: currentNumber } },
                orderBy: { number: 'asc' },
                select: { id: true, number: true, title: true },
            }),
        ]);
        return { prev, next };
    }
    async create(data) {
        await this.prisma.manga.update({
            where: { id: data.mangaId },
            data: { updatedAt: new Date() },
        });
        return this.prisma.chapter.create({
            data: {
                ...data,
                images: data.images,
            },
        });
    }
    async update(id, data) {
        return this.prisma.chapter.update({
            where: { id },
            data: {
                ...data,
                images: data.images ? data.images : undefined,
            },
        });
    }
    async delete(id) {
        return this.prisma.chapter.delete({ where: { id } });
    }
    async getLatestChapters(limit = 20) {
        return this.prisma.chapter.findMany({
            take: limit,
            orderBy: { releaseDate: 'desc' },
            include: {
                manga: {
                    select: {
                        id: true,
                        slug: true,
                        titleEn: true,
                        coverUrl: true,
                    },
                },
            },
        });
    }
};
exports.ChaptersService = ChaptersService;
exports.ChaptersService = ChaptersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChaptersService);
//# sourceMappingURL=chapters.service.js.map