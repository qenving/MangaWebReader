'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import api from '@/lib/api';

export default function MangaDetailPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [manga, setManga] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (slug) loadManga();
    }, [slug]);

    const loadManga = async () => {
        try {
            const data = await api.manga.getBySlug(slug);
            setManga(data);
        } catch (err) {
            console.error('Failed to load manga:', err);
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
                <div className="animate-pulse text-white text-xl">Loading...</div>
            </div>
        );
    }

    if (!manga) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Manga Not Found</h1>
                    <Link href="/">
                        <Button>Go Home</Button>
                    </Link>
                </div>
            </div>
        );
    }

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
                {/* Hero Section */}
                <div className="flex flex-col md:flex-row gap-8 mb-12">
                    {/* Cover */}
                    <div className="w-full md:w-64 flex-shrink-0">
                        {manga.coverUrl ? (
                            <img src={manga.coverUrl} alt={manga.titleEn} className="w-full rounded-xl shadow-2xl" />
                        ) : (
                            <div className="aspect-[3/4] bg-gradient-to-br from-purple-900 to-pink-900 rounded-xl flex items-center justify-center">
                                <span className="text-6xl">📖</span>
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <h1 className="text-4xl font-bold text-white mb-2">{manga.titleEn}</h1>
                        {manga.titleJp && <p className="text-slate-400 text-lg mb-4">{manga.titleJp}</p>}

                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">{manga.type}</span>
                            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">{manga.status}</span>
                            {manga.isAdult && <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">18+</span>}
                        </div>

                        <div className="flex gap-6 mb-6 text-slate-300">
                            <div>⭐ <span className="font-bold">{manga.rating?.toFixed(1) || '0.0'}</span></div>
                            <div>👁 <span className="font-bold">{manga.viewsTotal || 0}</span> views</div>
                            <div>📚 <span className="font-bold">{manga.chapters?.length || 0}</span> chapters</div>
                        </div>

                        {manga.description && (
                            <p className="text-slate-400 leading-relaxed mb-6">{manga.description}</p>
                        )}

                        {manga.chapters?.length > 0 && (
                            <Link href={`/read/${manga.chapters[manga.chapters.length - 1].id}`}>
                                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                                    Start Reading
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Chapters List */}
                <div>
                    <h2 className="text-2xl font-bold text-white mb-4">Chapters</h2>
                    {manga.chapters?.length === 0 ? (
                        <p className="text-slate-400">No chapters available yet</p>
                    ) : (
                        <div className="grid gap-2">
                            {manga.chapters?.map((chapter: any) => (
                                <Link key={chapter.id} href={`/read/${chapter.id}`}>
                                    <Card className="bg-slate-800/50 border-slate-700/50 hover:border-purple-500/50 transition-all">
                                        <CardContent className="p-4 flex items-center justify-between">
                                            <div>
                                                <span className="text-white font-medium">Chapter {chapter.number}</span>
                                                {chapter.title && <span className="text-slate-400 ml-2">- {chapter.title}</span>}
                                            </div>
                                            <div className="text-slate-500 text-sm">
                                                {new Date(chapter.releaseDate).toLocaleDateString()}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
