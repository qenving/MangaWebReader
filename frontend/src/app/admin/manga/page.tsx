'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import api from '@/lib/api';

interface Manga {
    id: string;
    titleEn: string;
    slug: string;
    status: string;
    rating: number;
    viewsTotal: number;
}

export default function AdminMangaPage() {
    const [manga, setManga] = useState<Manga[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const router = useRouter();

    useEffect(() => {
        loadManga();
    }, [search]);

    const loadManga = async () => {
        try {
            // Debounce search ideally, but for now just fetch
            const response = await api.manga.getAll({
                search: search || undefined,
                limit: 50
            });
            setManga(response.data);
        } catch (err) {
            console.error('Failed to load manga:', err);
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this manga? This action cannot be undone.')) return;

        try {
            // Need to implement delete in API client first if missing, checking later
            // Assuming endpoint exists as per controller
            // await api.manga.delete(id); 
            // For now just console log as delete endpoint might not be in api client yet
            console.log('Delete requested for', id);
            alert('Delete feature requires API client update');
        } catch (err) {
            console.error('Failed to delete:', err);
            alert('Failed to delete manga');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Manage Manga</h2>
                    <p className="text-slate-400">Create, update, and delete manga series.</p>
                </div>
                <Link href="/admin/manga/new">
                    <Button className="bg-purple-600 hover:bg-purple-700 gap-2">
                        <Plus className="h-4 w-4" />
                        Add New Manga
                    </Button>
                </Link>
            </div>

            <div className="flex items-center space-x-2 bg-slate-900 p-4 rounded-lg border border-slate-800">
                <Search className="h-5 w-5 text-slate-500" />
                <Input
                    placeholder="Search manga by title..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-transparent border-none focus-visible:ring-0 text-white placeholder:text-slate-500"
                />
            </div>

            <div className="rounded-md border border-slate-800 bg-slate-900/50">
                <Table>
                    <TableHeader>
                        <TableRow className="border-slate-800 hover:bg-slate-900">
                            <TableHead className="text-slate-400">Title</TableHead>
                            <TableHead className="text-slate-400">Status</TableHead>
                            <TableHead className="text-slate-400 text-right">Views</TableHead>
                            <TableHead className="text-slate-400 text-right">Rating</TableHead>
                            <TableHead className="text-slate-400 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow className="border-slate-800 hover:bg-slate-900">
                                <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : manga.length === 0 ? (
                            <TableRow className="border-slate-800 hover:bg-slate-900">
                                <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                                    No manga found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            manga.map((item) => (
                                <TableRow key={item.id} className="border-slate-800 hover:bg-slate-800/50">
                                    <TableCell className="font-medium text-slate-200">
                                        {item.titleEn}
                                        <div className="text-xs text-slate-500">{item.slug}</div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${item.status === 'ONGOING' ? 'bg-green-900/50 text-green-400' :
                                                item.status === 'COMPLETED' ? 'bg-blue-900/50 text-blue-400' :
                                                    'bg-slate-800 text-slate-400'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right text-slate-400">{item.viewsTotal.toLocaleString()}</TableCell>
                                    <TableCell className="text-right text-yellow-500">{item.rating.toFixed(1)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/manga/${item.slug}`} target="_blank">
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-white">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Link href={`/admin/manga/${item.id}`}>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-purple-400">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 text-slate-400 hover:text-red-400"
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
