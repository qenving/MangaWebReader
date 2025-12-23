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
exports.MangaService = exports.MangaFilters = exports.CreateMangaDto = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
class CreateMangaDto {
    slug;
    titleEn;
    titleJp;
    titleId;
    status;
    type;
    isAdult;
    description;
    coverUrl;
    bannerUrl;
    genreIds;
    tagIds;
    authorIds;
}
exports.CreateMangaDto = CreateMangaDto;
class MangaFilters {
    status;
    type;
    genreSlug;
    search;
    isAdult;
}
exports.MangaFilters = MangaFilters;
let MangaService = class MangaService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(page = 1, limit = 20, filters = {}, sortBy = 'latest') {
        const skip = (page - 1) * limit;
        const where = {};
        if (filters.status)
            where.status = filters.status;
        if (filters.type)
            where.type = filters.type;
        if (filters.isAdult !== undefined)
            where.isAdult = filters.isAdult;
        if (filters.search) {
            where.OR = [
                { titleEn: { contains: filters.search } },
                { titleJp: { contains: filters.search } },
                { titleId: { contains: filters.search } },
            ];
        }
        if (filters.genreSlug) {
            where.genres = { some: { genre: { slug: filters.genreSlug } } };
        }
        const orderBy = {};
        switch (sortBy) {
            case 'popular':
                orderBy.viewsTotal = 'desc';
                break;
            case 'rating':
                orderBy.rating = 'desc';
                break;
            default:
                orderBy.updatedAt = 'desc';
        }
        const [mangas, total] = await Promise.all([
            this.prisma.manga.findMany({
                skip,
                take: limit,
                where,
                orderBy,
                include: {
                    genres: { include: { genre: true } },
                    _count: { select: { chapters: true } },
                },
            }),
            this.prisma.manga.count({ where }),
        ]);
        return {
            data: mangas,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
    async findBySlug(slug) {
        return this.prisma.manga.findUnique({
            where: { slug },
            include: {
                genres: { include: { genre: true } },
                tags: { include: { tag: true } },
                authors: { include: { author: true } },
                chapters: {
                    orderBy: { number: 'desc' },
                    take: 50,
                    select: {
                        id: true,
                        number: true,
                        title: true,
                        releaseDate: true,
                        views: true,
                    },
                },
            },
        });
    }
    async findById(id) {
        return this.prisma.manga.findUnique({
            where: { id },
            include: {
                genres: { include: { genre: true } },
                tags: { include: { tag: true } },
                authors: { include: { author: true } },
            },
        });
    }
    async create(data) {
        const { genreIds, tagIds, authorIds, ...mangaData } = data;
        return this.prisma.manga.create({
            data: {
                ...mangaData,
                genres: genreIds
                    ? { create: genreIds.map((genreId) => ({ genreId })) }
                    : undefined,
                tags: tagIds
                    ? { create: tagIds.map((tagId) => ({ tagId })) }
                    : undefined,
                authors: authorIds
                    ? { create: authorIds.map((a) => ({ authorId: a.authorId, role: a.role })) }
                    : undefined,
            },
            include: {
                genres: { include: { genre: true } },
                tags: { include: { tag: true } },
                authors: { include: { author: true } },
            },
        });
    }
    async update(id, data) {
        const { genreIds, tagIds, authorIds, ...mangaData } = data;
        if (genreIds) {
            await this.prisma.mangaGenre.deleteMany({ where: { mangaId: id } });
            await this.prisma.mangaGenre.createMany({
                data: genreIds.map((genreId) => ({ mangaId: id, genreId })),
            });
        }
        if (tagIds) {
            await this.prisma.mangaTag.deleteMany({ where: { mangaId: id } });
            await this.prisma.mangaTag.createMany({
                data: tagIds.map((tagId) => ({ mangaId: id, tagId })),
            });
        }
        if (authorIds) {
            await this.prisma.mangaAuthor.deleteMany({ where: { mangaId: id } });
            await this.prisma.mangaAuthor.createMany({
                data: authorIds.map((a) => ({ mangaId: id, authorId: a.authorId, role: a.role })),
            });
        }
        return this.prisma.manga.update({
            where: { id },
            data: mangaData,
            include: {
                genres: { include: { genre: true } },
                tags: { include: { tag: true } },
                authors: { include: { author: true } },
            },
        });
    }
    async delete(id) {
        return this.prisma.manga.delete({ where: { id } });
    }
    async incrementViews(id) {
        return this.prisma.manga.update({
            where: { id },
            data: {
                viewsTotal: { increment: 1 },
                viewsWeekly: { increment: 1 },
            },
        });
    }
};
exports.MangaService = MangaService;
exports.MangaService = MangaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MangaService);
//# sourceMappingURL=manga.service.js.map