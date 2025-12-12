'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { motion } from 'framer-motion';
import {
  MessageCircle,
  BookOpen,
  Award,
  Brain,
  TrendingUp,
  LogOut,
  Settings,
  User,
  Coffee,
  Tv,
  Mic,
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  const navigation = [
    { name: 'Chat', href: '/dashboard/chat', icon: MessageCircle },
    { name: 'Grammar', href: '/dashboard/grammar', icon: BookOpen },
    { name: 'Kanji', href: '/dashboard/kanji', icon: Brain },
    { name: 'JLPT', href: '/dashboard/jlpt', icon: Award },
    { name: 'Learning Path', href: '/dashboard/learning-path', icon: TrendingUp },
    { name: 'Scenarios', href: '/dashboard/scenarios', icon: Coffee },
    { name: 'Anime', href: '/dashboard/anime', icon: Tv },
    { name: 'Speech', href: '/dashboard/speech', icon: Mic },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    localStorage.clear();
    router.push('/');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl z-50 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <Link href="/dashboard">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🌸</span>
              <span className="text-xl font-bold text-gradient">日本語</span>
            </div>
          </Link>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-japanese-pink/10 to-japanese-blue/10">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-japanese-pink to-japanese-blue flex items-center justify-center text-white font-bold">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="font-semibold text-sm truncate">
                {user?.fullName || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigation.map((item) => (
            <Link key={item.name} href={item.href}>
              <motion.div
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-japanese-pink/20 hover:to-japanese-blue/20 transition-all cursor-pointer group"
              >
                <item.icon className="w-5 h-5 text-gray-600 group-hover:text-japanese-pink" />
                <span className="font-medium text-gray-700 group-hover:text-japanese-pink">
                  {item.name}
                </span>
              </motion.div>
            </Link>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-100 space-y-2">
          <Link href="/dashboard/settings">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-all cursor-pointer"
            >
              <Settings className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-700">Settings</span>
            </motion.div>
          </Link>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-all cursor-pointer"
          >
            <LogOut className="w-5 h-5 text-red-600" />
            <span className="font-medium text-red-600">Logout</span>
          </motion.div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">{children}</main>
    </div>
  );
}
