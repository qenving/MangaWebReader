'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
import { ArrowLeft, Save, Plus, FileText, Upload } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

export default function EditMangaPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [chapters, setChapters] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        titleEn: '',
        titleJp: '',
        slug: '',
        description: '',
        status: 'ONGOING',
        type: 'MANGA',
        coverUrl: '',
        releaseYear: '',
    });

    useEffect(() => {
        if (id) {
            loadManga(id);
            loadChapters(id);
        }
    }, [id]);

    const loadManga = async (mangaId: string) => {
        try {
            // We need an endpoint to get by ID, api.manga.getById not explicitly in client but we can try slug or add it
            // Assuming we fallback to fetch for now as api client maintenance is needed
            // Actually, admin usually needs ID based fetch.
            // Let's rely on api.manga.getBySlug if we don't have ID, but wait, list page uses ID. 
            // Let's assume we can fetch by endpoint /manga/:id directly even if api client doesn't type it

            // WORKAROUND: The current backend likely supports GET /manga/:id
            const token = localStorage.getItem('auth_token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/manga/${mangaId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!res.ok) {
                // Try slug fallback? No, we need editing by ID usually.
                throw new Error('Failed to load manga');
            }

            const data = await res.json();
            setFormData({
                titleEn: data.titleEn,
                titleJp: data.titleJp || '',
                slug: data.slug,
                description: data.description || '',
                status: data.status,
                type: data.type,
                coverUrl: data.coverUrl || '',
                releaseYear: data.releaseYear?.toString() || '',
            });
        } catch (err) {
            console.error(err);
            setError('Failed to load manga details');
        }
        setLoading(false);
    };

    const loadChapters = async (mangaId: string) => {
        try {
            const res = await api.chapters.getByManga(mangaId, 1, 100);
            setChapters(res.data);
        } catch (err) {
            console.error('Failed to load chapters:', err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const token = localStorage.getItem('auth_token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/manga/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    releaseYear: parseInt(formData.releaseYear) || undefined,
                })
            });

            if (!res.ok) throw new Error('Failed to update manga');

            // Show success message or just redirect?
            alert('Manga updated successfully');
        } catch (err) {
            console.error(err);
            setError('Failed to update manga');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading...</div>;

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex items-center space-x-4">
                <Link href="/admin/manga">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h2 className="text-2xl font-bold text-white">Edit Manga</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Form */}
                <div className="lg:col-span-2 space-y-6">
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
                                        value={formData.titleEn}
                                        onChange={handleChange}
                                        required
                                        className="bg-slate-950 border-slate-800"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="slug">Slug</Label>
                                    <Input
                                        id="slug"
                                        name="slug"
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
                                        value={formData.coverUrl}
                                        onChange={handleChange}
                                        className="bg-slate-950 border-slate-800"
                                    />
                                </div>

                                {error && (
                                    <div className="p-3 rounded bg-red-900/50 border border-red-900 text-red-200 text-sm">
                                        {error}
                                    </div>
                                )}

                                <div className="pt-4 flex justify-end">
                                    <Button type="submit" disabled={saving} className="bg-purple-600 hover:bg-purple-700">
                                        {saving ? 'Saving...' : 'Save Changes'}
                                        <Save className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Chapters */}
                <div className="space-y-6">
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-slate-200 text-lg">Chapters</CardTitle>
                            <Link href={`/admin/chapters/new?mangaId=${id}`}>
                                <Button size="sm" variant="outline" className="h-8 border-slate-700 hover:bg-purple-600 hover:text-white hover:border-purple-600">
                                    <Plus className="h-3 w-3 mr-1" />
                                    Add
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                {chapters.length === 0 ? (
                                    <div className="text-center py-8 text-slate-500 text-sm">
                                        No chapters yet.
                                    </div>
                                ) : (
                                    chapters.map((chapter) => (
                                        <div key={chapter.id} className="flex items-center justify-between p-3 rounded bg-slate-950/50 border border-slate-800 group hover:border-slate-700 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <FileText className="h-4 w-4 text-slate-500 group-hover:text-purple-400" />
                                                <div>
                                                    <div className="font-medium text-sm text-slate-300">Ch. {chapter.number}</div>
                                                    <div className="text-xs text-slate-500 truncate max-w-[150px]">{chapter.title || 'No Title'}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {/* Edit Chapter Link could go here */}
                                                <Button size="icon" variant="ghost" className="h-6 w-6 text-slate-500 hover:text-white">
                                                    <Upload className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-slate-200 text-lg">Cover Preview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="aspect-[3/4] rounded-lg bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center relative">
                                {formData.coverUrl ? (
                                    <img
                                        src={formData.coverUrl}
                                        alt="Cover Preview"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://placehold.co/400x600/1a1a1a/666666?text=No+Preview';
                                        }}
                                    />
                                ) : (
                                    <div className="text-slate-600 flex flex-col items-center">
                                        <Upload className="h-8 w-8 mb-2 opacity-50" />
                                        <span className="text-xs">No Cover URL</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
