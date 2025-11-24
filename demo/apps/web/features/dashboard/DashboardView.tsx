'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { logout } from '@/features/auth';
import { toast } from 'react-hot-toast';
import {
    DollarSign,
    Users,
    ShoppingBag,
    Activity,
    ClipboardList,
    CheckCircle2,
    Clock,
    Hourglass,
    Bell,
    LogOut
} from 'lucide-react';

// Mock Data for Demo
const MOCK_STATS = [
    { title: 'Total Revenue', value: '$45,231.89', change: '+20.1% from last month', icon: DollarSign, color: 'from-green-500/20 to-emerald-500/20', iconColor: 'text-green-500' },
    { title: 'Subscriptions', value: '+2350', change: '+180.1% from last month', icon: Users, color: 'from-blue-500/20 to-indigo-500/20', iconColor: 'text-blue-500' },
    { title: 'Sales', value: '+12,234', change: '+19% from last month', icon: ShoppingBag, color: 'from-orange-500/20 to-red-500/20', iconColor: 'text-orange-500' },
    { title: 'Active Now', value: '+573', change: '+201 since last hour', icon: Activity, color: 'from-purple-500/20 to-pink-500/20', iconColor: 'text-purple-500' },
];

const MOCK_TODOS = [
    { id: 1, title: 'Review project proposal', status: 'completed', date: 'Today, 10:00 AM' },
    { id: 2, title: 'Team meeting with design team', status: 'pending', date: 'Today, 2:00 PM' },
    { id: 3, title: 'Update documentation', status: 'in-progress', date: 'Tomorrow, 11:00 AM' },
    { id: 4, title: 'Deploy to production', status: 'pending', date: 'Wed, 4:00 PM' },
];

const MOCK_ACTIVITIES = [
    { id: 1, user: 'Alice Smith', action: 'created a new project', time: '2 min ago' },
    { id: 2, user: 'Bob Johnson', action: 'commented on task #123', time: '15 min ago' },
    { id: 3, user: 'Charlie Brown', action: 'completed onboarding', time: '1 hour ago' },
];

export function DashboardView() {
    const handleLogout = async () => {
        await logout();
        toast.success('Logged out successfully');
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <div className="min-h-screen bg-background p-8 relative overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute -top-[40%] -right-[30%] w-[70%] h-[70%] rounded-full bg-primary/10 blur-[120px] animate-float" />
                <div className="absolute top-[60%] -left-[20%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[100px] animate-float" style={{ animationDelay: '3s' }} />
            </div>

            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between"
                >
                    <div>
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600 mb-2">
                            Dashboard Overview
                        </h1>
                        <p className="text-muted-foreground">Welcome back, Ziad! Here's what's happening today.</p>
                    </div>
                    <Button onClick={handleLogout} variant="outline" className="border-primary/20 hover:bg-primary/10 hover:text-primary transition-colors gap-2">
                        <LogOut className="w-4 h-4" />
                        Sign out
                    </Button>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {MOCK_STATS.map((stat, index) => (
                        <motion.div key={index} variants={item}>
                            <Card className={`glass border-white/10 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group overflow-hidden relative`}>
                                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                    <div className={`p-2 rounded-lg bg-background/50 ${stat.iconColor}`}>
                                        <stat.icon className="w-5 h-5" />
                                    </div>
                                </CardHeader>
                                <CardContent className="relative z-10">
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                    <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Tasks */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-2"
                    >
                        <Card className="glass border-white/10 h-full">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ClipboardList className="w-5 h-5 text-primary" />
                                    Recent Tasks
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {MOCK_TODOS.map((todo) => (
                                        <div key={todo.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors group cursor-pointer border border-transparent hover:border-primary/10">
                                            <div className="flex items-center gap-4">
                                                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${todo.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                                                        todo.status === 'in-progress' ? 'bg-blue-500/10 text-blue-500' :
                                                            'bg-orange-500/10 text-orange-500'
                                                    }`}>
                                                    {todo.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> :
                                                        todo.status === 'in-progress' ? <Activity className="w-5 h-5" /> :
                                                            <Hourglass className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <p className="font-medium group-hover:text-primary transition-colors">{todo.title}</p>
                                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Clock className="w-3 h-3" /> {todo.date}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded-full capitalize ${todo.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                                                    todo.status === 'in-progress' ? 'bg-blue-500/10 text-blue-500' :
                                                        'bg-orange-500/10 text-orange-500'
                                                }`}>
                                                {todo.status.replace('-', ' ')}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Recent Activity */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Card className="glass border-white/10 h-full">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Bell className="w-5 h-5 text-primary" />
                                    Recent Activity
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {MOCK_ACTIVITIES.map((activity, index) => (
                                        <div key={activity.id} className="flex gap-4 relative">
                                            {index !== MOCK_ACTIVITIES.length - 1 && (
                                                <div className="absolute left-[19px] top-10 bottom-[-24px] w-[2px] bg-secondary" />
                                            )}
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-sm font-bold text-primary">
                                                {activity.user[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm">
                                                    <span className="font-semibold">{activity.user}</span> {activity.action}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
