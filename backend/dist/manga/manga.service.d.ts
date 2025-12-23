import { PrismaService } from '../prisma/prisma.service';
export declare class CreateMangaDto {
    slug: string;
    titleEn: string;
    titleJp?: string;
    titleId?: string;
    status?: string;
    type?: string;
    isAdult?: boolean;
    description?: string;
    coverUrl?: string;
    bannerUrl?: string;
    genreIds?: string[];
    tagIds?: string[];
    authorIds?: {
        authorId: string;
        role?: string;
    }[];
}
export declare class MangaFilters {
    status?: string;
    type?: string;
    genreSlug?: string;
    search?: string;
    isAdult?: boolean;
}
export declare class MangaService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(page?: number, limit?: number, filters?: MangaFilters, sortBy?: 'latest' | 'popular' | 'rating'): Promise<{
        data: ({
            _count: {
                chapters: number;
            };
            genres: ({
                genre: {
                    id: string;
                    createdAt: Date;
                    name: string;
                    slug: string;
                    description: string | null;
                };
            } & {
                mangaId: string;
                genreId: string;
            })[];
        } & {
            rating: number;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            slug: string;
            titleEn: string;
            titleJp: string | null;
            titleId: string | null;
            type: string;
            isAdult: boolean;
            description: string | null;
            coverUrl: string | null;
            bannerUrl: string | null;
            viewsTotal: number;
            viewsWeekly: number;
            ratingCount: number;
            follows: number;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findBySlug(slug: string): Promise<({
        chapters: {
            number: number;
            id: string;
            title: string | null;
            releaseDate: Date;
            views: number;
        }[];
        genres: ({
            genre: {
                id: string;
                createdAt: Date;
                name: string;
                slug: string;
                description: string | null;
            };
        } & {
            mangaId: string;
            genreId: string;
        })[];
        tags: ({
            tag: {
                id: string;
                createdAt: Date;
                name: string;
                slug: string;
            };
        } & {
            mangaId: string;
            tagId: string;
        })[];
        authors: ({
            author: {
                id: string;
                createdAt: Date;
                name: string;
                slug: string;
                bio: string | null;
                imageUrl: string | null;
            };
        } & {
            role: string | null;
            mangaId: string;
            authorId: string;
        })[];
    } & {
        rating: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        slug: string;
        titleEn: string;
        titleJp: string | null;
        titleId: string | null;
        type: string;
        isAdult: boolean;
        description: string | null;
        coverUrl: string | null;
        bannerUrl: string | null;
        viewsTotal: number;
        viewsWeekly: number;
        ratingCount: number;
        follows: number;
    }) | null>;
    findById(id: string): Promise<({
        genres: ({
            genre: {
                id: string;
                createdAt: Date;
                name: string;
                slug: string;
                description: string | null;
            };
        } & {
            mangaId: string;
            genreId: string;
        })[];
        tags: ({
            tag: {
                id: string;
                createdAt: Date;
                name: string;
                slug: string;
            };
        } & {
            mangaId: string;
            tagId: string;
        })[];
        authors: ({
            author: {
                id: string;
                createdAt: Date;
                name: string;
                slug: string;
                bio: string | null;
                imageUrl: string | null;
            };
        } & {
            role: string | null;
            mangaId: string;
            authorId: string;
        })[];
    } & {
        rating: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        slug: string;
        titleEn: string;
        titleJp: string | null;
        titleId: string | null;
        type: string;
        isAdult: boolean;
        description: string | null;
        coverUrl: string | null;
        bannerUrl: string | null;
        viewsTotal: number;
        viewsWeekly: number;
        ratingCount: number;
        follows: number;
    }) | null>;
    create(data: CreateMangaDto): Promise<{
        genres: ({
            genre: {
                id: string;
                createdAt: Date;
                name: string;
                slug: string;
                description: string | null;
            };
        } & {
            mangaId: string;
            genreId: string;
        })[];
        tags: ({
            tag: {
                id: string;
                createdAt: Date;
                name: string;
                slug: string;
            };
        } & {
            mangaId: string;
            tagId: string;
        })[];
        authors: ({
            author: {
                id: string;
                createdAt: Date;
                name: string;
                slug: string;
                bio: string | null;
                imageUrl: string | null;
            };
        } & {
            role: string | null;
            mangaId: string;
            authorId: string;
        })[];
    } & {
        rating: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        slug: string;
        titleEn: string;
        titleJp: string | null;
        titleId: string | null;
        type: string;
        isAdult: boolean;
        description: string | null;
        coverUrl: string | null;
        bannerUrl: string | null;
        viewsTotal: number;
        viewsWeekly: number;
        ratingCount: number;
        follows: number;
    }>;
    update(id: string, data: Partial<CreateMangaDto>): Promise<{
        genres: ({
            genre: {
                id: string;
                createdAt: Date;
                name: string;
                slug: string;
                description: string | null;
            };
        } & {
            mangaId: string;
            genreId: string;
        })[];
        tags: ({
            tag: {
                id: string;
                createdAt: Date;
                name: string;
                slug: string;
            };
        } & {
            mangaId: string;
            tagId: string;
        })[];
        authors: ({
            author: {
                id: string;
                createdAt: Date;
                name: string;
                slug: string;
                bio: string | null;
                imageUrl: string | null;
            };
        } & {
            role: string | null;
            mangaId: string;
            authorId: string;
        })[];
    } & {
        rating: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        slug: string;
        titleEn: string;
        titleJp: string | null;
        titleId: string | null;
        type: string;
        isAdult: boolean;
        description: string | null;
        coverUrl: string | null;
        bannerUrl: string | null;
        viewsTotal: number;
        viewsWeekly: number;
        ratingCount: number;
        follows: number;
    }>;
    delete(id: string): Promise<{
        rating: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        slug: string;
        titleEn: string;
        titleJp: string | null;
        titleId: string | null;
        type: string;
        isAdult: boolean;
        description: string | null;
        coverUrl: string | null;
        bannerUrl: string | null;
        viewsTotal: number;
        viewsWeekly: number;
        ratingCount: number;
        follows: number;
    }>;
    incrementViews(id: string): Promise<{
        rating: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        slug: string;
        titleEn: string;
        titleJp: string | null;
        titleId: string | null;
        type: string;
        isAdult: boolean;
        description: string | null;
        coverUrl: string | null;
        bannerUrl: string | null;
        viewsTotal: number;
        viewsWeekly: number;
        ratingCount: number;
        follows: number;
    }>;
}
