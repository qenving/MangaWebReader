'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    LayoutDashboard,
    BookOpen,
    FileText,
    Settings,
    Users,
    LogOut,
    Plus
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

const sidebarItems = [
    {
        title: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard,
    },
    {
        title: 'Manage Manga',
        href: '/admin/manga',
        icon: BookOpen,
    },
    // {
    //     title: 'Manage Chapters',
    //     href: '/admin/chapters',
    //     icon: FileText,
    // },
    // {
    //     title: 'Users',
    //     href: '/admin/users',
    //     icon: Users,
    // },
    // {
    //     title: 'Settings',
    //     href: '/admin/settings',
    //     icon: Settings,
    // },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <div className="flex flex-col h-screen w-64 bg-slate-950 border-r border-slate-800">
            <div className="p-6 border-b border-slate-800">
                <Link href="/" className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">M</span>
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                        Admin
                    </span>
                </Link>
            </div>

            <div className="flex-1 py-6 px-4 space-y-2">
                {sidebarItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start gap-2",
                                pathname === item.href
                                    ? "bg-slate-800 text-purple-400 font-semibold"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.title}
                        </Button>
                    </Link>
                ))}

                <div className="pt-4 mt-4 border-t border-slate-800">
                    <h3 className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Quick Actions
                    </h3>
                    <Link href="/admin/manga/new">
                        <Button variant="outline" className="w-full justify-start gap-2 text-slate-400 border-slate-800 hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-colors">
                            <Plus className="h-4 w-4" />
                            Add Manga
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="p-4 border-t border-slate-800">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-red-400 hover:text-red-300 hover:bg-red-950/20"
                    onClick={logout}
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    );
}
