'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';

export default function ReadChapterPage() {
    const params = useParams();
    const chapterId = params.id as string;
    const [chapter, setChapter] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (chapterId) loadChapter();
    }, [chapterId]);

    const loadChapter = async () => {
        try {
            const data = await api.chapters.getById(chapterId);
            setChapter(data);
        } catch (err) {
            console.error('Failed to load chapter:', err);
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="animate-pulse text-white text-xl">Loading chapter...</div>
            </div>
        );
    }

    if (!chapter) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-4">Chapter Not Found</h1>
                    <Link href="/">
                        <Button>Go Home</Button>
                    </Link>
                </div>
            </div>
        );
    }

    // Parse images from JSON string
    let images: any[] = [];
    try {
        images = typeof chapter.images === 'string' ? JSON.parse(chapter.images) : chapter.images || [];
    } catch {
        images = [];
    }

    // Check if the content is a PDF
    const isPdf = images.length > 0 && (
        (images[0].url && images[0].url.toLowerCase().endsWith('.pdf')) ||
        (typeof images[0] === 'string' && images[0].toLowerCase().endsWith('.pdf'))
    );
    const pdfUrl = isPdf ? (images[0].url || images[0]) : null;

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800">
                <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
                    <Link href={`/manga/${chapter.manga?.slug || ''}`} className="text-slate-400 hover:text-white">
                        ← Back to Manga
                    </Link>
                    <div className="text-center">
                        <h1 className="text-white font-medium">{chapter.manga?.titleEn}</h1>
                        <p className="text-slate-400 text-sm">Chapter {chapter.number}</p>
                    </div>
                    <div className="w-20" />
                </div>
            </header>

            {/* Navigation */}
            <div className="sticky top-14 z-40 bg-slate-900/80 backdrop-blur border-b border-slate-800">
                <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-center gap-4">
                    {chapter.prev ? (
                        <Link href={`/read/${chapter.prev.id}`}>
                            <Button variant="outline" size="sm" className="border-slate-700">← Previous</Button>
                        </Link>
                    ) : (
                        <Button variant="outline" size="sm" disabled className="border-slate-700 opacity-50">← Previous</Button>
                    )}

                    <span className="text-slate-400">Ch. {chapter.number}</span>

                    {chapter.next ? (
                        <Link href={`/read/${chapter.next.id}`}>
                            <Button variant="outline" size="sm" className="border-slate-700">Next →</Button>
                        </Link>
                    ) : (
                        <Button variant="outline" size="sm" disabled className="border-slate-700 opacity-50">Next →</Button>
                    )}
                </div>
            </div>

            {/* Images */}
            <main className="max-w-4xl mx-auto">
                {images.length === 0 ? (
                    <div className="py-20 text-center">
                        <p className="text-slate-400 text-xl">No images available for this chapter</p>
                    </div>
                ) : isPdf ? (
                    <div className="w-full h-[120vh]">
                        <iframe
                            src={`${api.defaults.baseURL?.replace('/api', '')}${pdfUrl}`}
                            className="w-full h-full border-0 bg-white"
                            title="Manga PDF Reader"
                        />
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        {images.map((img: any, index: number) => (
                            <img
                                key={index}
                                src={img.url || img}
                                alt={`Page ${index + 1}`}
                                className="w-full max-w-3xl"
                                loading="lazy"
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* Bottom Navigation */}
            <div className="py-8 bg-slate-900 border-t border-slate-800">
                <div className="max-w-4xl mx-auto px-4 flex items-center justify-center gap-4">
                    {chapter.prev ? (
                        <Link href={`/read/${chapter.prev.id}`}>
                            <Button className="bg-purple-600 hover:bg-purple-700">← Previous Chapter</Button>
                        </Link>
                    ) : (
                        <Button disabled className="opacity-50">← Previous Chapter</Button>
                    )}

                    <Link href={`/manga/${chapter.manga?.slug || ''}`}>
                        <Button variant="outline" className="border-slate-700">All Chapters</Button>
                    </Link>

                    {chapter.next ? (
                        <Link href={`/read/${chapter.next.id}`}>
                            <Button className="bg-purple-600 hover:bg-purple-700">Next Chapter →</Button>
                        </Link>
                    ) : (
                        <Button disabled className="opacity-50">Next Chapter →</Button>
                    )}
                </div>
            </div>
        </div>
    );
}
