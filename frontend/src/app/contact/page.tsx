import Link from 'next/link';

export default function ContactPage() {
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
                <h1 className="text-4xl font-bold text-white mb-8">Contact Us</h1>

                <div className="prose prose-invert prose-purple max-w-none">
                    <p className="text-slate-300 text-lg leading-relaxed mb-8">
                        Have questions, feedback, or need support? We&apos;d love to hear from you!
                    </p>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                            <h3 className="text-xl font-bold text-white mb-2">📧 Email</h3>
                            <p className="text-purple-400">support@mangaverse.com</p>
                        </div>

                        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                            <h3 className="text-xl font-bold text-white mb-2">🐦 Twitter</h3>
                            <p className="text-purple-400">@MangaVerse</p>
                        </div>

                        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                            <h3 className="text-xl font-bold text-white mb-2">💬 Discord</h3>
                            <p className="text-purple-400">discord.gg/mangaverse</p>
                        </div>

                        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                            <h3 className="text-xl font-bold text-white mb-2">🐛 Bug Reports</h3>
                            <p className="text-purple-400">bugs@mangaverse.com</p>
                        </div>
                    </div>

                    <p className="text-slate-400 mt-8">
                        We typically respond within 24-48 hours.
                    </p>
                </div>

                <div className="mt-12">
                    <Link href="/" className="text-purple-400 hover:text-purple-300">← Back to Home</Link>
                </div>
            </main>
        </div>
    );
}
