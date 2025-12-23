import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            <nav className="border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <span className="text-white font-bold text-xl">M</span>
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                            MangaVerse
                        </span>
                    </Link>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold text-white mb-8">About MangaVerse</h1>

                <div className="prose prose-invert prose-purple max-w-none">
                    <p className="text-slate-300 text-lg leading-relaxed mb-6">
                        MangaVerse is your ultimate destination for reading manga, manhwa, and manhua online.
                        We provide a seamless reading experience with a vast library of titles across all genres.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-8 mb-4">Our Mission</h2>
                    <p className="text-slate-300 leading-relaxed mb-6">
                        To make manga accessible to everyone with a beautiful, ad-free reading experience.
                        We believe in supporting creators and bringing stories to readers worldwide.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-8 mb-4">Features</h2>
                    <ul className="text-slate-300 space-y-2 mb-6">
                        <li>📚 Extensive library of manga, manhwa, and manhua</li>
                        <li>🌙 Dark mode optimized reading</li>
                        <li>📱 Mobile-friendly design</li>
                        <li>🔖 Bookmark and track your reading progress</li>
                        <li>🔔 Get notified when new chapters release</li>
                    </ul>
                </div>

                <div className="mt-12">
                    <Link href="/" className="text-purple-400 hover:text-purple-300">← Back to Home</Link>
                </div>
            </main>
        </div>
    );
}
