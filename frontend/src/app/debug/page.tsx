'use client';

import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';

export default function DebugAuthPage() {
    const { user, loading } = useAuth();
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setToken(localStorage.getItem('token'));
        }
    }, []);

    return (
        <div className="p-8 text-white space-y-4">
            <h1 className="text-2xl font-bold">Auth Debugger</h1>

            <div className="p-4 border rounded bg-slate-900">
                <h2 className="font-bold mb-2">Auth Context State</h2>
                <pre>{JSON.stringify({ user, loading }, null, 2)}</pre>
            </div>

            <div className="p-4 border rounded bg-slate-900">
                <h2 className="font-bold mb-2">LocalStorage Token</h2>
                <p className="break-all">{token || 'No token found'}</p>
            </div>
        </div>
    );
}
