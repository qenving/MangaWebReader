'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import api from '@/lib/api';

interface Manga {
    id: string;
    slug: string;
    titleEn: string;
    coverUrl: string | null;
    status: string;
    type: string;
    rating: number;
    viewsTotal: number;
    _count?: { chapters: number };
    genres?: { genre: { name: string; slug: string } }[];
}

export default function BrowsePage() {
    const [manga, setManga] = useState<Manga[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        status: '',
        type: '',
        sort: 'latest' as 'latest' | 'popular' | 'rating',
    });
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        loadManga();
    }, [page, filters]);

    const loadManga = async () => {
        setLoading(true);
        try {
            const response = await api.manga.getAll({
                page,
                limit: 24,
                status: filters.status || undefined,
                type: filters.type || undefined,
                sort: filters.sort,
                search: searchQuery || undefined,
            });
            setManga(response.data);
            setTotalPages(response.meta.totalPages);
        } catch (err) {
            console.error('Failed to load manga:', err);
        }
        setLoading(false);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        loadManga();
    };

    const formatViews = (views: number) => {
        if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
        if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
        return views.toString();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <span className="text-white font-bold text-xl">M</span>
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                            MangaVerse
                        </span>
                    </Link>

                    <Link href="/login">
                        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                            Sign In
                        </Button>
                    </Link>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Browse Manga</h1>
                    <p className="text-slate-400">Discover your next favorite series</p>
                </div>

                {/* Search and Filters */}
                <div className="mb-8 space-y-4">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <Input
                            type="search"
                            placeholder="Search manga..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                        />
                        <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                            Search
                        </Button>
                    </form>

                    <div className="flex flex-wrap gap-4">
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                        >
                            <option value="">All Status</option>
                            <option value="ONGOING">Ongoing</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="HIATUS">Hiatus</option>
                        </select>

                        <select
                            value={filters.type}
                            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                        >
                            <option value="">All Types</option>
                            <option value="MANGA">Manga</option>
                            <option value="MANHWA">Manhwa</option>
                            <option value="MANHUA">Manhua</option>
                        </select>

                        <select
                            value={filters.sort}
                            onChange={(e) => setFilters({ ...filters, sort: e.target.value as any })}
                            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                        >
                            <option value="latest">Latest</option>
                            <option value="popular">Popular</option>
                            <option value="rating">Top Rated</option>
                        </select>
                    </div>
                </div>

                {/* Manga Grid */}
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {[...Array(24)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-[3/4] bg-slate-800 rounded-xl mb-2" />
                                <div className="h-4 bg-slate-800 rounded w-3/4 mb-1" />
                                <div className="h-3 bg-slate-800 rounded w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : manga.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-slate-400 text-xl mb-4">No manga found</p>
                        <p className="text-slate-500">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {manga.map((item) => (
                            <Link key={item.id} href={`/manga/${item.slug}`} className="group">
                                <Card className="overflow-hidden bg-slate-800/50 border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/10">
                                    <div className="relative aspect-[3/4]">
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10" />
                                        <div className="absolute bottom-2 left-2 right-2 z-20 flex items-center justify-between">
                                            <span className="text-xs text-slate-300">⭐ {item.rating.toFixed(1)}</span>
                                            <span className="text-xs text-slate-300">👁 {formatViews(item.viewsTotal)}</span>
                                        </div>
                                        {item.coverUrl ? (
                                            <img
                                                src={item.coverUrl}
                                                alt={item.titleEn}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center">
                                                <span className="text-4xl">📖</span>
                                            </div>
                                        )}
                                    </div>
                                    <CardContent className="p-3">
                                        <h3 className="font-semibold text-white text-sm line-clamp-2 group-hover:text-purple-400 transition-colors">
                                            {item.titleEn}
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {item._count?.chapters || 0} chapters
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                        <Button
                            variant="outline"
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page === 1}
                            className="border-slate-700 text-slate-300"
                        >
                            Previous
                        </Button>
                        <span className="flex items-center px-4 text-slate-400">
                            Page {page} of {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            onClick={() => setPage(Math.min(totalPages, page + 1))}
                            disabled={page === totalPages}
                            className="border-slate-700 text-slate-300"
                        >
                            Next
                        </Button>
                    </div>
                )}
            </main>
        </div>
    );
}
