'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import api from '@/lib/api';

import { useAuth } from '@/hooks/use-auth';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                const response = await api.auth.login(formData.email, formData.password);
                // User api.setToken() is handled, but also update Context if we were using it inside Login, 
                // but Login page uses api directly. Context will pick up token from localStorage on mount/update?
                // Actually Login page simply pushes router. Context loop might be slow.
                // Better to set it via Context if possible, but Context isn't imported here (it is in layout).
                // Let's stick to api.setToken + localStorage (which api.setToken does).
                // API client setToken does: localStorage.setItem('auth_token', token);

                // FORCE UPDATE LOCAL STORAGE for AuthContext to pick it up (Context listens to... wait, Context only loads on mount!)
                // If we login, we must update the Context State too, otherwise the AdminLayout (wrapped in Context) won't know we are logged in immediately if we just push route.
                // We need to use `useAuth` hook here to call `login` function!
                login(response.accessToken, response.user);

                if (response.user.role === 'OWNER' || response.user.role === 'ADMIN') {
                    router.push('/admin');
                } else {
                    router.push('/');
                }
            } else {
                if (formData.password !== formData.confirmPassword) {
                    setError('Passwords do not match');
                    setLoading(false);
                    return;
                }
                const response = await api.auth.register({
                    email: formData.email,
                    username: formData.username,
                    password: formData.password,
                });
                login(response.accessToken, response.user);
                router.push('/');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
            </div>

            <Card className="w-full max-w-md relative bg-slate-900/80 backdrop-blur-xl border-slate-800">
                <CardHeader className="text-center">
                    <Link href="/" className="flex items-center justify-center mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <span className="text-white font-bold text-2xl">M</span>
                        </div>
                    </Link>
                    <CardTitle className="text-2xl text-white">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                        {isLogin
                            ? 'Sign in to continue reading'
                            : 'Join MangaVerse to track your reading'
                        }
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Input
                                type="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                                required
                            />
                        </div>

                        {!isLogin && (
                            <div>
                                <Input
                                    type="text"
                                    placeholder="Username"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                                    required
                                />
                            </div>
                        )}

                        <div>
                            <Input
                                type="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                                required
                            />
                        </div>

                        {!isLogin && (
                            <div>
                                <Input
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                                    required
                                />
                            </div>
                        )}

                        {error && (
                            <p className="text-red-400 text-sm text-center">{error}</p>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Create Account'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            type="button"
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                            }}
                            className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
                        >
                            {isLogin
                                ? "Don't have an account? Sign up"
                                : 'Already have an account? Sign in'
                            }
                        </button>
                    </div>

                    <div className="mt-4 text-center">
                        <Link href="/" className="text-slate-500 hover:text-slate-400 text-sm transition-colors">
                            ← Back to Home
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
