import { ChaptersService, CreateChapterDto } from './chapters.service';
export declare class ChaptersController {
    private chaptersService;
    constructor(chaptersService: ChaptersService);
    getLatest(limit?: string): Promise<({
        manga: {
            id: string;
            slug: string;
            titleEn: string;
            coverUrl: string | null;
        };
    } & {
        number: number;
        id: string;
        mangaId: string;
        title: string | null;
        volume: number | null;
        images: string;
        sourceOrigin: string | null;
        sourceExternalId: string | null;
        releaseDate: Date;
        isLocked: boolean;
        views: number;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findByManga(mangaId: string, page?: string, limit?: string): Promise<{
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
    findById(id: string): Promise<{
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
        manga: {
            id: string;
            slug: string;
            titleEn: string;
            coverUrl: string | null;
        };
        number: number;
        id: string;
        mangaId: string;
        title: string | null;
        volume: number | null;
        images: string;
        sourceOrigin: string | null;
        sourceExternalId: string | null;
        releaseDate: Date;
        isLocked: boolean;
        views: number;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    create(data: CreateChapterDto): Promise<{
        number: number;
        id: string;
        mangaId: string;
        title: string | null;
        volume: number | null;
        images: string;
        sourceOrigin: string | null;
        sourceExternalId: string | null;
        releaseDate: Date;
        isLocked: boolean;
        views: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, data: Partial<CreateChapterDto>): Promise<{
        number: number;
        id: string;
        mangaId: string;
        title: string | null;
        volume: number | null;
        images: string;
        sourceOrigin: string | null;
        sourceExternalId: string | null;
        releaseDate: Date;
        isLocked: boolean;
        views: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    delete(id: string): Promise<{
        number: number;
        id: string;
        mangaId: string;
        title: string | null;
        volume: number | null;
        images: string;
        sourceOrigin: string | null;
        sourceExternalId: string | null;
        releaseDate: Date;
        isLocked: boolean;
        views: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    uploadFile(file: any): Promise<{
        url: string;
        filename: any;
        originalName: any;
        mimeType: any;
    }>;
}
