import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export class ChapterImage {
    url!: string;
    width!: number;
    height!: number;
}

export class CreateChapterDto {
    mangaId!: string;
    number!: number;
    title?: string;
    volume?: number;
    images!: ChapterImage[];
    sourceOrigin?: string;
    sourceExternalId?: string;
    isLocked?: boolean;
}

@Injectable()
export class ChaptersService {
    constructor(private prisma: PrismaService) { }

    async findByMangaId(mangaId: string, page = 1, limit = 50) {
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

    async findById(id: string) {
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
            // Increment views
            await this.prisma.chapter.update({
                where: { id },
                data: { views: { increment: 1 } },
            });
        }

        return chapter;
    }

    async findAdjacentChapters(mangaId: string, currentNumber: number) {
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

    async create(data: CreateChapterDto) {
        // Update manga's updatedAt when a new chapter is added
        await this.prisma.manga.update({
            where: { id: data.mangaId },
            data: { updatedAt: new Date() },
        });

        return this.prisma.chapter.create({
            data: {
                ...data,
                images: data.images as any, // Prisma JSON type
            },
        });
    }

    async update(id: string, data: Partial<CreateChapterDto>) {
        return this.prisma.chapter.update({
            where: { id },
            data: {
                ...data,
                images: data.images ? (data.images as any) : undefined,
            },
        });
    }

    async delete(id: string) {
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
}
