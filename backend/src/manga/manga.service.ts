import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export class CreateMangaDto {
    slug!: string;
    titleEn!: string;
    titleJp?: string;
    titleId?: string;
    status?: string;  // ONGOING, COMPLETED, HIATUS
    type?: string;    // MANGA, MANHWA, MANHUA
    isAdult?: boolean;
    description?: string;
    coverUrl?: string;
    bannerUrl?: string;
    genreIds?: string[];
    tagIds?: string[];
    authorIds?: { authorId: string; role?: string }[];
}

export class MangaFilters {
    status?: string;
    type?: string;
    genreSlug?: string;
    search?: string;
    isAdult?: boolean;
}

@Injectable()
export class MangaService {
    constructor(private prisma: PrismaService) { }

    async findAll(
        page = 1,
        limit = 20,
        filters: MangaFilters = {},
        sortBy: 'latest' | 'popular' | 'rating' = 'latest',
    ) {
        const skip = (page - 1) * limit;

        const where: any = {};

        if (filters.status) where.status = filters.status;
        if (filters.type) where.type = filters.type;
        if (filters.isAdult !== undefined) where.isAdult = filters.isAdult;
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

        const orderBy: any = {};
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

    async findBySlug(slug: string) {
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

    async findById(id: string) {
        return this.prisma.manga.findUnique({
            where: { id },
            include: {
                genres: { include: { genre: true } },
                tags: { include: { tag: true } },
                authors: { include: { author: true } },
            },
        });
    }

    async create(data: CreateMangaDto) {
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

    async update(id: string, data: Partial<CreateMangaDto>) {
        const { genreIds, tagIds, authorIds, ...mangaData } = data;

        // Update relationships if provided
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

    async delete(id: string) {
        return this.prisma.manga.delete({ where: { id } });
    }

    async incrementViews(id: string) {
        return this.prisma.manga.update({
            where: { id },
            data: {
                viewsTotal: { increment: 1 },
                viewsWeekly: { increment: 1 },
            },
        });
    }
}
