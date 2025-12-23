'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import api from '@/lib/api';

type Step = 'checking' | 'database' | 'owner' | 'complete';

export default function InstallPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>('checking');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [recoveryKey, setRecoveryKey] = useState('');

    // Database form
    const [dbConfig, setDbConfig] = useState({
        host: 'localhost',
        port: 3306,
        username: 'manga_user',
        password: 'manga_password',
        database: 'manga_db',
    });

    // Owner form
    const [ownerData, setOwnerData] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
    });

    useEffect(() => {
        checkInstallStatus();
    }, []);

    const checkInstallStatus = async () => {
        try {
            const status = await api.install.getStatus();
            if (status.isInstalled && status.hasOwner) {
                router.push('/');
                return;
            }
            if (status.databaseConnected) {
                setStep(status.hasOwner ? 'complete' : 'owner');
            } else {
                setStep('database');
            }
        } catch {
            setStep('database');
        }
    };

    const testDatabase = async () => {
        setLoading(true);
        setError('');
        try {
            const result = await api.install.testDatabase(dbConfig);
            if (result.success) {
                setStep('owner');
            } else {
                setError(result.error || 'Failed to connect to database');
            }
        } catch (err) {
            setError((err as Error).message);
        }
        setLoading(false);
    };

    const createOwner = async () => {
        if (ownerData.password !== ownerData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (ownerData.password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const result = await api.install.createOwner({
                email: ownerData.email,
                username: ownerData.username,
                password: ownerData.password,
            });
            if (result.success) {
                await completeInstallation();
            } else {
                setError(result.error || 'Failed to create owner account');
            }
        } catch (err) {
            setError((err as Error).message);
        }
        setLoading(false);
    };

    const completeInstallation = async () => {
        try {
            const result = await api.install.complete();
            if (result.success) {
                setRecoveryKey(result.recoveryKey || '');
                setStep('complete');
            }
        } catch (err) {
            setError((err as Error).message);
        }
    };

    if (step === 'checking') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <Card className="w-full max-w-md bg-slate-800/50 backdrop-blur border-purple-500/20">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                        </div>
                        <p className="text-center mt-4 text-slate-300">Checking installation status...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
            <div className="w-full max-w-lg">
                {/* Progress indicator */}
                <div className="flex justify-center mb-8">
                    <div className="flex items-center space-x-4">
                        {['database', 'owner', 'complete'].map((s, i) => (
                            <div key={s} className="flex items-center">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step === s
                                            ? 'bg-purple-500 text-white scale-110'
                                            : ['database', 'owner', 'complete'].indexOf(step) > i
                                                ? 'bg-green-500 text-white'
                                                : 'bg-slate-700 text-slate-400'
                                        }`}
                                >
                                    {['database', 'owner', 'complete'].indexOf(step) > i ? '✓' : i + 1}
                                </div>
                                {i < 2 && <div className="w-12 h-1 bg-slate-700 mx-2" />}
                            </div>
                        ))}
                    </div>
                </div>

                <Card className="bg-slate-800/50 backdrop-blur border-purple-500/20">
                    {step === 'database' && (
                        <>
                            <CardHeader>
                                <CardTitle className="text-2xl text-white">Database Configuration</CardTitle>
                                <CardDescription className="text-slate-400">
                                    Configure your MySQL database connection
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {error && (
                                    <Alert variant="destructive" className="bg-red-900/50 border-red-500/50">
                                        <AlertTitle>Error</AlertTitle>
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="host" className="text-slate-300">Host</Label>
                                        <Input
                                            id="host"
                                            value={dbConfig.host}
                                            onChange={(e) => setDbConfig({ ...dbConfig, host: e.target.value })}
                                            className="bg-slate-700 border-slate-600 text-white"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="port" className="text-slate-300">Port</Label>
                                        <Input
                                            id="port"
                                            type="number"
                                            value={dbConfig.port}
                                            onChange={(e) => setDbConfig({ ...dbConfig, port: parseInt(e.target.value) })}
                                            className="bg-slate-700 border-slate-600 text-white"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="database" className="text-slate-300">Database Name</Label>
                                    <Input
                                        id="database"
                                        value={dbConfig.database}
                                        onChange={(e) => setDbConfig({ ...dbConfig, database: e.target.value })}
                                        className="bg-slate-700 border-slate-600 text-white"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="username" className="text-slate-300">Username</Label>
                                    <Input
                                        id="username"
                                        value={dbConfig.username}
                                        onChange={(e) => setDbConfig({ ...dbConfig, username: e.target.value })}
                                        className="bg-slate-700 border-slate-600 text-white"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="password" className="text-slate-300">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={dbConfig.password}
                                        onChange={(e) => setDbConfig({ ...dbConfig, password: e.target.value })}
                                        className="bg-slate-700 border-slate-600 text-white"
                                    />
                                </div>

                                <Button
                                    onClick={testDatabase}
                                    disabled={loading}
                                    className="w-full bg-purple-600 hover:bg-purple-700"
                                >
                                    {loading ? 'Testing Connection...' : 'Test & Continue'}
                                </Button>
                            </CardContent>
                        </>
                    )}

                    {step === 'owner' && (
                        <>
                            <CardHeader>
                                <CardTitle className="text-2xl text-white">Create Owner Account</CardTitle>
                                <CardDescription className="text-slate-400">
                                    Set up the administrator account for your platform
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {error && (
                                    <Alert variant="destructive" className="bg-red-900/50 border-red-500/50">
                                        <AlertTitle>Error</AlertTitle>
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}

                                <div>
                                    <Label htmlFor="email" className="text-slate-300">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={ownerData.email}
                                        onChange={(e) => setOwnerData({ ...ownerData, email: e.target.value })}
                                        className="bg-slate-700 border-slate-600 text-white"
                                        placeholder="admin@example.com"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="owner-username" className="text-slate-300">Username</Label>
                                    <Input
                                        id="owner-username"
                                        value={ownerData.username}
                                        onChange={(e) => setOwnerData({ ...ownerData, username: e.target.value })}
                                        className="bg-slate-700 border-slate-600 text-white"
                                        placeholder="admin"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="owner-password" className="text-slate-300">Password</Label>
                                    <Input
                                        id="owner-password"
                                        type="password"
                                        value={ownerData.password}
                                        onChange={(e) => setOwnerData({ ...ownerData, password: e.target.value })}
                                        className="bg-slate-700 border-slate-600 text-white"
                                        placeholder="Minimum 8 characters"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="confirm-password" className="text-slate-300">Confirm Password</Label>
                                    <Input
                                        id="confirm-password"
                                        type="password"
                                        value={ownerData.confirmPassword}
                                        onChange={(e) => setOwnerData({ ...ownerData, confirmPassword: e.target.value })}
                                        className="bg-slate-700 border-slate-600 text-white"
                                    />
                                </div>

                                <Button
                                    onClick={createOwner}
                                    disabled={loading || !ownerData.email || !ownerData.username || !ownerData.password}
                                    className="w-full bg-purple-600 hover:bg-purple-700"
                                >
                                    {loading ? 'Creating Account...' : 'Create Owner Account'}
                                </Button>
                            </CardContent>
                        </>
                    )}

                    {step === 'complete' && (
                        <>
                            <CardHeader>
                                <CardTitle className="text-2xl text-white text-center">🎉 Installation Complete!</CardTitle>
                                <CardDescription className="text-slate-400 text-center">
                                    Your manga reader platform is ready to use
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {recoveryKey && (
                                    <Alert className="bg-amber-900/50 border-amber-500/50">
                                        <AlertTitle className="text-amber-400">⚠️ Save Your Recovery Key</AlertTitle>
                                        <AlertDescription className="text-amber-200">
                                            <p className="mb-2">Keep this key safe. You'll need it to recover your account:</p>
                                            <code className="block bg-slate-800 p-3 rounded text-lg font-mono text-center text-white">
                                                {recoveryKey}
                                            </code>
                                        </AlertDescription>
                                    </Alert>
                                )}

                                <Button
                                    onClick={() => router.push('/')}
                                    className="w-full bg-green-600 hover:bg-green-700"
                                >
                                    Go to Homepage
                                </Button>
                            </CardContent>
                        </>
                    )}
                </Card>

                <p className="text-center mt-4 text-slate-500 text-sm">
                    Manga Reader Platform v2.0
                </p>
            </div>
        </div>
    );
}
