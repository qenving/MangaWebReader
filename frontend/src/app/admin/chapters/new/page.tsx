'use client';

import { useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Upload, FileType } from 'lucide-react';
import Link from 'next/link';

export default function NewChapterPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const mangaId = searchParams.get('mangaId');

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        number: '',
        title: '',
        mangaId: mangaId || '',
        images: [] as string[], // Will store the PDF URL or Image URLs
    });

    const [fileStats, setFileStats] = useState<{ name: string, size: string } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileStats({
            name: file.name,
            size: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
        });
    };

    const uploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        const token = localStorage.getItem('auth_token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/chapters/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
                // Content-Type not needed, browser sets it for FormData
            },
            body: formData
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || 'Upload failed');
        }

        return res.json();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (formData.images.length === 0 && fileInputRef.current?.files?.length === 0) {
                throw new Error('Please upload a file (PDF or Images)');
            }

            let fileUrls = formData.images;

            // Handle file upload if a file is selected
            if (fileInputRef.current?.files?.length) {
                setUploading(true);
                const file = fileInputRef.current.files[0];
                const uploadResult = await uploadFile(file);

                // If it's a PDF, we store just the PDF URL in the array
                // The frontend reader will detect .pdf extension
                fileUrls = [uploadResult.url];
                setUploading(false);
            }

            const token = localStorage.getItem('auth_token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/chapters`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    mangaId: formData.mangaId,
                    number: parseFloat(formData.number),
                    title: formData.title,
                    images: JSON.stringify(fileUrls), // Store as JSON string as per schema
                    releaseDate: new Date().toISOString(),
                })
            });

            if (!res.ok) throw new Error('Failed to create chapter');

            router.push(`/admin/manga/${formData.mangaId}`);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'Something went wrong');
            setUploading(false);
        } finally {
            setLoading(false);
        }
    };

    if (!mangaId) {
        return (
            <div className="p-8 text-center">
                <p className="text-red-400">Error: No Manga ID provided.</p>
                <Link href="/admin/manga">
                    <Button variant="link" className="text-purple-400">Back to Manga List</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="flex items-center space-x-4">
                <Link href={`/admin/manga/${mangaId}`}>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h2 className="text-2xl font-bold text-white">Add New Chapter</h2>
            </div>

            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-slate-200">Chapter Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="number">Chapter Number</Label>
                                <Input
                                    id="number"
                                    name="number"
                                    type="number"
                                    step="0.1"
                                    placeholder="e.g. 1, 1.5, 100"
                                    value={formData.number}
                                    onChange={handleChange}
                                    required
                                    className="bg-slate-950 border-slate-800"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="title">Chapter Title (Optional)</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    placeholder="e.g. The Beginning"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="bg-slate-950 border-slate-800"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Upload Content (PDF or Images)</Label>
                            <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center hover:bg-slate-950/50 transition-colors bg-slate-950/20">
                                <div className="flex flex-col items-center justify-center space-y-3">
                                    <div className="p-3 bg-purple-500/10 rounded-full">
                                        <Upload className="h-6 w-6 text-purple-400" />
                                    </div>
                                    <div className="text-sm text-slate-400">
                                        {fileStats ? (
                                            <div className="flex items-center gap-2 text-green-400">
                                                <FileType className="h-4 w-4" />
                                                <span>{fileStats.name} ({fileStats.size})</span>
                                            </div>
                                        ) : (
                                            <span>Drag and drop or click to upload PDF</span>
                                        )}
                                    </div>
                                    <Input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".pdf,image/*"
                                        className="hidden"
                                        id="file-upload"
                                        onChange={handleFileChange}
                                    />
                                    <Label htmlFor="file-upload">
                                        <Button variant="outline" className="border-slate-700 text-slate-300" asChild>
                                            <span>Select File</span>
                                        </Button>
                                    </Label>
                                </div>
                            </div>
                            <p className="text-xs text-slate-500">Supported formats: PDF (Recommended), JPG, PNG</p>
                        </div>

                        {error && (
                            <div className="p-3 rounded bg-red-900/50 border border-red-900 text-red-200 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="pt-4 flex justify-end">
                            <Button type="submit" disabled={loading || uploading} className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
                                {uploading ? 'Uploading File...' : loading ? 'Creating Chapter...' : 'Upload & Create'}
                                {!loading && !uploading && <Save className="ml-2 h-4 w-4" />}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
