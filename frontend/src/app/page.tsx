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

export default function HomePage() {
  const [popularManga, setPopularManga] = useState<Manga[]>([]);
  const [latestChapters, setLatestChapters] = useState<LatestChapter[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [popular, latest] = await Promise.all([
        api.manga.getAll({ limit: 12, sort: 'popular' }),
        api.chapters.getLatest(10),
      ]);
      setPopularManga(popular.data);
      setLatestChapters(latest);
    } catch (err) {
      console.error('Failed to load data:', err);
    }
    setLoading(false);
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const timeAgo = (date: string) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="min-h-screen">
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

          <div className="flex-1 max-w-md mx-8">
            <Input
              type="search"
              placeholder="Search manga..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-800/50 border-slate-700 focus:border-purple-500 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center space-x-4">
            <Button asChild variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800">
              <Link href="/browse">
                Browse
              </Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Link href="/login">
                Sign In
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-pink-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/30 via-transparent to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 text-transparent bg-clip-text">
              Read Manga Online
            </span>
          </h1>
          <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
            Discover thousands of manga, manhwa, and manhua. Updated daily with the latest chapters.
          </p>
          <div className="flex justify-center space-x-4">
            <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8">
              <Link href="/browse">
                Start Reading
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 text-lg px-8">
              Popular Series
            </Button>
          </div>
        </div>
      </section>

      {/* Latest Updates */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white flex items-center">
              <span className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mr-4" />
              Latest Updates
            </h2>
            <Link href="/latest" className="text-purple-400 hover:text-purple-300 transition-colors">
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-slate-800 rounded-xl mb-2" />
                  <div className="h-4 bg-slate-800 rounded w-3/4 mb-1" />
                  <div className="h-3 bg-slate-800 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {latestChapters.map((chapter) => (
                <Link
                  key={chapter.id}
                  href={`/manga/${chapter.manga.slug}`}
                  className="group"
                >
                  <Card className="overflow-hidden bg-slate-800/50 border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/10">
                    <div className="relative aspect-[3/4]">
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10" />
                      <div className="absolute bottom-2 left-2 right-2 z-20">
                        <span className="inline-block px-2 py-1 bg-purple-500/90 text-white text-xs rounded-md">
                          Ch. {chapter.number}
                        </span>
                        <span className="ml-2 text-slate-400 text-xs" suppressHydrationWarning>
                          {timeAgo(chapter.releaseDate)}
                        </span>
                      </div>
                      {chapter.manga.coverUrl ? (
                        <img
                          src={chapter.manga.coverUrl}
                          alt={chapter.manga.titleEn}
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
                        {chapter.manga.titleEn}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Popular Manga */}
      <section className="py-16 px-4 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white flex items-center">
              <span className="w-1 h-8 bg-gradient-to-b from-pink-500 to-orange-500 rounded-full mr-4" />
              Popular Series
            </h2>
            <Link href="/popular" className="text-purple-400 hover:text-purple-300 transition-colors">
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-slate-800 rounded-xl mb-2" />
                  <div className="h-4 bg-slate-800 rounded w-3/4 mb-1" />
                  <div className="h-3 bg-slate-800 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {popularManga.map((manga, index) => (
                <Link
                  key={manga.id}
                  href={`/manga/${manga.slug}`}
                  className="group"
                >
                  <Card className="overflow-hidden bg-slate-800/50 border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/10">
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
                        <span className="text-xs text-slate-300">
                          ⭐ {manga.rating.toFixed(1)}
                        </span>
                        <span className="text-xs text-slate-300">
                          👁 {formatViews(manga.viewsTotal)}
                        </span>
                      </div>
                      {manga.coverUrl ? (
                        <img
                          src={manga.coverUrl}
                          alt={manga.titleEn}
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
                        {manga.titleEn}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        {manga._count?.chapters || 0} chapters
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="ml-2 text-xl font-bold text-white">MangaVerse</span>
          </div>
          <p className="text-slate-500 mb-4">
            Your ultimate destination for manga, manhwa, and manhua.
          </p>
          <div className="flex justify-center space-x-6 text-sm text-slate-500">
            <Link href="/about" className="hover:text-purple-400 transition-colors">About</Link>
            <Link href="/dmca" className="hover:text-purple-400 transition-colors">DMCA</Link>
            <Link href="/contact" className="hover:text-purple-400 transition-colors">Contact</Link>
            <Link href="/privacy" className="hover:text-purple-400 transition-colors">Privacy</Link>
          </div>
          <p className="text-slate-600 text-sm mt-6">
            © {new Date().getFullYear()} MangaVerse. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
