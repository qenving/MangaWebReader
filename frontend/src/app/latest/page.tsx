'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import api from '@/lib/api';

interface LatestChapter {
    id: string;
    number: number;
    title: string | null;
    releaseDate: string;
    manga: {
        id: string;
        slug: string;
        titleEn: string;
        coverUrl: string | null;
    };
}

export default function LatestPage() {
    const [chapters, setChapters] = useState<LatestChapter[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadChapters();
    }, []);

    const loadChapters = async () => {
        try {
            const data = await api.chapters.getLatest(50);
            setChapters(data);
        } catch (err) {
            console.error('Failed to load chapters:', err);
        }
        setLoading(false);
    };

    const timeAgo = (date: string) => {
        const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
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
                    <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                        <Link href="/login">
                            Sign In
                        </Link>
                    </Button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold text-white mb-2">Latest Updates</h1>
                <p className="text-slate-400 mb-8">Recently released chapters</p>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {[...Array(20)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-[3/4] bg-slate-800 rounded-xl mb-2" />
                                <div className="h-4 bg-slate-800 rounded w-3/4" />
                            </div>
                        ))}
                    </div>
                ) : chapters.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-slate-400 text-xl">No chapters yet</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {chapters.map((chapter) => (
                            <Link key={chapter.id} href={`/manga/${chapter.manga.slug}`} className="group">
                                <Card className="overflow-hidden bg-slate-800/50 border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
                                    <div className="relative aspect-[3/4]">
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10" />
                                        <div className="absolute bottom-2 left-2 right-2 z-20">
                                            <span className="inline-block px-2 py-1 bg-purple-500/90 text-white text-xs rounded-md">
                                                Ch. {chapter.number}
                                            </span>
                                            <span className="ml-2 text-slate-400 text-xs" suppressHydrationWarning>{timeAgo(chapter.releaseDate)}</span>
                                        </div>
                                        {chapter.manga.coverUrl ? (
                                            <img src={chapter.manga.coverUrl} alt={chapter.manga.titleEn} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center">
                                                <span className="text-4xl">📖</span>
                                            </div>
                                        )}
                                    </div>
                                    <CardContent className="p-3">
                                        <h3 className="font-semibold text-white text-sm line-clamp-2 group-hover:text-purple-400">
                                            {chapter.manga.titleEn}
                                        </h3>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
