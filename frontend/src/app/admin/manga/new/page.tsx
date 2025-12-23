'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

export default function NewMangaPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        titleEn: '',
        titleJp: '',
        slug: '',
        description: '',
        status: 'ONGOING',
        type: 'MANGA',
        coverUrl: '',
        author: '',
        artist: '',
        releaseYear: new Date().getFullYear().toString(),
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Auto-generate slug from titleEn
        if (name === 'titleEn' && !formData.slug) {
            setFormData(prev => ({
                ...prev,
                slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
            }));
        }
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Check if API client has create method, if not assume endpoint
            // api.manga.create(formData) - likely missing in client, using fetch manually or adding to client
            // For now, let's look at api.ts - it needs 'create' method in 'manga' object.

            // Temporary direct fetch if api client is incomplete
            const token = localStorage.getItem('auth_token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/manga`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    releaseYear: parseInt(formData.releaseYear) || 2024,
                    genres: [], // TODO: Add genre selection
                })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Failed to create manga');
            }

            router.push('/admin/manga');
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="flex items-center space-x-4">
                <Link href="/admin/manga">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h2 className="text-2xl font-bold text-white">Add New Manga</h2>
            </div>

            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-slate-200">Manga Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="titleEn">English Title</Label>
                            <Input
                                id="titleEn"
                                name="titleEn"
                                placeholder="e.g. Solo Leveling"
                                value={formData.titleEn}
                                onChange={handleChange}
                                required
                                className="bg-slate-950 border-slate-800"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug (URL Friendly)</Label>
                            <Input
                                id="slug"
                                name="slug"
                                placeholder="e.g. solo-leveling"
                                value={formData.slug}
                                onChange={handleChange}
                                required
                                className="bg-slate-950 border-slate-800 font-mono text-sm"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(val) => handleSelectChange('status', val)}
                                >
                                    <SelectTrigger className="bg-slate-950 border-slate-800">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ONGOING">Ongoing</SelectItem>
                                        <SelectItem value="COMPLETED">Completed</SelectItem>
                                        <SelectItem value="HIATUS">Hiatus</SelectItem>
                                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type">Type</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(val) => handleSelectChange('type', val)}
                                >
                                    <SelectTrigger className="bg-slate-950 border-slate-800">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="MANGA">Manga (JP)</SelectItem>
                                        <SelectItem value="MANHWA">Manhwa (KR)</SelectItem>
                                        <SelectItem value="MANHUA">Manhua (CN)</SelectItem>
                                        <SelectItem value="COMIC">Comic (Western)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Synopsis..."
                                value={formData.description}
                                onChange={handleChange}
                                className="bg-slate-950 border-slate-800 min-h-[150px]"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="coverUrl">Cover Image URL</Label>
                            <Input
                                id="coverUrl"
                                name="coverUrl"
                                placeholder="https://..."
                                value={formData.coverUrl}
                                onChange={handleChange}
                                className="bg-slate-950 border-slate-800"
                            />
                            {formData.coverUrl && (
                                <div className="mt-2 text-xs text-slate-500">
                                    Preview: img will appear here
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="p-3 rounded bg-red-900/50 border border-red-900 text-red-200 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="pt-4 flex justify-end">
                            <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700">
                                {loading ? 'Creating...' : 'Create Manga'}
                                <Save className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
