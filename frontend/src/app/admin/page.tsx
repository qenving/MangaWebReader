'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, FileText, Activity } from 'lucide-react';

export default function AdminDashboard() {
    // In a real app, we would fetch these stats from the API
    const stats = [
        {
            title: 'Total Manga',
            value: '2',
            icon: BookOpen,
            description: 'Active series',
            change: '+2 this week'
        },
        {
            title: 'Total Users',
            value: '2',
            icon: Users,
            description: 'Registered users',
            change: '+1 since yesterday'
        },
        {
            title: 'Total Chapters',
            value: '9',
            icon: FileText,
            description: 'Uploaded chapters',
            change: '+9 this week'
        },
        {
            title: 'System Status',
            value: 'Healthy',
            icon: Activity,
            description: 'All systems operational',
            change: 'Uptime 99.9%'
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">Overview</h2>
                <p className="text-slate-400">Welcome back to the admin dashboard.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title} className="bg-slate-900 border-slate-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-200">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">{stat.value}</div>
                            <p className="text-xs text-slate-400">
                                {stat.change}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { user: 'Admin', action: 'Uploaded chapter 1103 for One Piece', time: '2 hours ago' },
                                { user: 'New User', action: 'Registered an account', time: '5 hours ago' },
                                { user: 'Admin', action: 'Created manga Solo Leveling', time: '1 day ago' },
                            ].map((activity, i) => (
                                <div key={i} className="flex items-center">
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none text-white">{activity.user}</p>
                                        <p className="text-sm text-slate-400">{activity.action}</p>
                                    </div>
                                    <div className="ml-auto font-medium text-slate-500 text-sm">{activity.time}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3 bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white">System Health</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-300">Database</span>
                                <span className="text-xs bg-green-900/50 text-green-400 px-2 py-1 rounded-full">Connected</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-300">Storage</span>
                                <span className="text-xs bg-green-900/50 text-green-400 px-2 py-1 rounded-full">Available</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-300">API Latency</span>
                                <span className="text-xs text-slate-400">45ms</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
