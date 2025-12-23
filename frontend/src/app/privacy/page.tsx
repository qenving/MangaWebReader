import Link from 'next/link';

export default function PrivacyPage() {
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
                <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>

                <div className="prose prose-invert prose-purple max-w-none space-y-6">
                    <p className="text-slate-300 text-lg leading-relaxed">
                        Your privacy is important to us. This policy outlines how we collect, use, and protect your information.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-8 mb-4">Information We Collect</h2>
                    <ul className="text-slate-300 space-y-2">
                        <li><strong>Account Data:</strong> Email, username when you register</li>
                        <li><strong>Reading Data:</strong> Your reading history and bookmarks</li>
                        <li><strong>Usage Data:</strong> Pages visited, features used</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-white mt-8 mb-4">How We Use Your Data</h2>
                    <ul className="text-slate-300 space-y-2">
                        <li>To provide and improve our services</li>
                        <li>To personalize your reading experience</li>
                        <li>To send important updates (optional)</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-white mt-8 mb-4">Data Protection</h2>
                    <p className="text-slate-300 leading-relaxed">
                        We use industry-standard security measures to protect your data. Your password is hashed
                        and we never store it in plain text.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-8 mb-4">Your Rights</h2>
                    <ul className="text-slate-300 space-y-2">
                        <li>Request access to your data</li>
                        <li>Request deletion of your account</li>
                        <li>Opt out of marketing communications</li>
                    </ul>

                    <p className="text-slate-400 mt-8">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>
                </div>

                <div className="mt-12">
                    <Link href="/" className="text-purple-400 hover:text-purple-300">← Back to Home</Link>
                </div>
            </main>
        </div>
    );
}
