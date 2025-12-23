import { PrismaService } from '../prisma/prisma.service';
export declare class ChapterImage {
    url: string;
    width: number;
    height: number;
}
export declare class CreateChapterDto {
    mangaId: string;
    number: number;
    title?: string;
    volume?: number;
    images: ChapterImage[];
    sourceOrigin?: string;
    sourceExternalId?: string;
    isLocked?: boolean;
}
export declare class ChaptersService {
    private prisma;
    constructor(prisma: PrismaService);
    findByMangaId(mangaId: string, page?: number, limit?: number): Promise<{
        data: {
            number: number;
            id: string;
            title: string | null;
            volume: number | null;
            releaseDate: Date;
            isLocked: boolean;
            views: number;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findById(id: string): Promise<({
        manga: {
            id: string;
            slug: string;
            titleEn: string;
            coverUrl: string | null;
        };
    } & {
        number: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        mangaId: string;
        title: string | null;
        volume: number | null;
        images: string;
        sourceOrigin: string | null;
        sourceExternalId: string | null;
        releaseDate: Date;
        isLocked: boolean;
        views: number;
    }) | null>;
    findAdjacentChapters(mangaId: string, currentNumber: number): Promise<{
        prev: {
            number: number;
            id: string;
            title: string | null;
        } | null;
        next: {
            number: number;
            id: string;
            title: string | null;
        } | null;
    }>;
    create(data: CreateChapterDto): Promise<{
        number: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        mangaId: string;
        title: string | null;
        volume: number | null;
        images: string;
        sourceOrigin: string | null;
        sourceExternalId: string | null;
        releaseDate: Date;
        isLocked: boolean;
        views: number;
    }>;
    update(id: string, data: Partial<CreateChapterDto>): Promise<{
        number: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        mangaId: string;
        title: string | null;
        volume: number | null;
        images: string;
        sourceOrigin: string | null;
        sourceExternalId: string | null;
        releaseDate: Date;
        isLocked: boolean;
        views: number;
    }>;
    delete(id: string): Promise<{
        number: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        mangaId: string;
        title: string | null;
        volume: number | null;
        images: string;
        sourceOrigin: string | null;
        sourceExternalId: string | null;
        releaseDate: Date;
        isLocked: boolean;
        views: number;
    }>;
    getLatestChapters(limit?: number): Promise<({
        manga: {
            id: string;
            slug: string;
            titleEn: string;
            coverUrl: string | null;
        };
    } & {
        number: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        mangaId: string;
        title: string | null;
        volume: number | null;
        images: string;
        sourceOrigin: string | null;
        sourceExternalId: string | null;
        releaseDate: Date;
        isLocked: boolean;
        views: number;
    })[]>;
}
