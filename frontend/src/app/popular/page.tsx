'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import api from '@/lib/api';

export default function PopularPage() {
    const [manga, setManga] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadManga();
    }, []);

    const loadManga = async () => {
        try {
            const response = await api.manga.getAll({ limit: 48, sort: 'popular' });
            setManga(response.data);
        } catch (err) {
            console.error('Failed to load manga:', err);
        }
        setLoading(false);
    };

    const formatViews = (views: number) => {
        if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
        if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
        return views.toString();
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
                    <Link href="/login">
                        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                            Sign In
                        </Button>
                    </Link>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold text-white mb-2">Popular Manga</h1>
                <p className="text-slate-400 mb-8">Most read series this week</p>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {[...Array(24)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-[3/4] bg-slate-800 rounded-xl mb-2" />
                                <div className="h-4 bg-slate-800 rounded w-3/4" />
                            </div>
                        ))}
                    </div>
                ) : manga.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-slate-400 text-xl">No manga yet</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {manga.map((item, index) => (
                            <Link key={item.id} href={`/manga/${item.slug}`} className="group">
                                <Card className="overflow-hidden bg-slate-800/50 border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
                                    <div className="relative aspect-[3/4]">
                                        {index < 3 && (
                                            <div className="absolute top-2 left-2 z-20">
                                                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${index === 0 ? 'bg-yellow-500 text-yellow-900' :
                                                        index === 1 ? 'bg-slate-400 text-slate-900' :
                                                            'bg-amber-700 text-amber-100'
                                                    }`}>
                                                    {index + 1}
                                                </span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10" />
                                        <div className="absolute bottom-2 left-2 right-2 z-20 flex items-center justify-between">
                                            <span className="text-xs text-slate-300">⭐ {item.rating?.toFixed(1) || '0.0'}</span>
                                            <span className="text-xs text-slate-300">👁 {formatViews(item.viewsTotal || 0)}</span>
                                        </div>
                                        {item.coverUrl ? (
                                            <img src={item.coverUrl} alt={item.titleEn} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center">
                                                <span className="text-4xl">📖</span>
                                            </div>
                                        )}
                                    </div>
                                    <CardContent className="p-3">
                                        <h3 className="font-semibold text-white text-sm line-clamp-2 group-hover:text-purple-400">
                                            {item.titleEn}
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-1">{item._count?.chapters || 0} chapters</p>
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
