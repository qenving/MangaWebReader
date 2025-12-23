import Link from 'next/link';

export default function DMCAPage() {
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
                <h1 className="text-4xl font-bold text-white mb-8">DMCA Policy</h1>

                <div className="prose prose-invert prose-purple max-w-none">
                    <p className="text-slate-300 text-lg leading-relaxed mb-6">
                        MangaVerse respects the intellectual property rights of others and expects its users to do the same.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-8 mb-4">Copyright Infringement Claims</h2>
                    <p className="text-slate-300 leading-relaxed mb-6">
                        If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement
                        and is accessible via this website, please notify us immediately.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-8 mb-4">Required Information</h2>
                    <ul className="text-slate-300 space-y-2 mb-6">
                        <li>A physical or electronic signature of the copyright owner</li>
                        <li>Identification of the copyrighted work claimed to have been infringed</li>
                        <li>The URL or location of the infringing material</li>
                        <li>Your contact information (address, phone number, email)</li>
                        <li>A statement that you have a good faith belief that the use is not authorized</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-white mt-8 mb-4">Contact</h2>
                    <p className="text-slate-300 leading-relaxed">
                        Send DMCA notices to: <span className="text-purple-400">dmca@mangaverse.com</span>
                    </p>
                </div>

                <div className="mt-12">
                    <Link href="/" className="text-purple-400 hover:text-purple-300">← Back to Home</Link>
                </div>
            </main>
        </div>
    );
}
