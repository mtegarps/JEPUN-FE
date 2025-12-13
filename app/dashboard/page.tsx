'use client';

import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useAuthStore, useSettingsStore } from '@/lib/store';
import { getGreeting, getLevelColor } from '@/lib/utils';
import {
  MessageCircle,
  BookOpen,
  Award,
  Brain,
  TrendingUp,
  Sparkles,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { level } = useSettingsStore();

  const quickActions = [
    {
      title: 'Chat with Sensei',
      description: 'Practice conversation',
      icon: <MessageCircle className="w-6 h-6" />,
      href: '/dashboard/chat',
      color: 'from-japanese-pink to-japanese-purple',
    },
    {
      title: 'Grammar Check',
      description: 'Check your sentences',
      icon: <BookOpen className="w-6 h-6" />,
      href: '/dashboard/grammar',
      color: 'from-japanese-blue to-japanese-green',
    },
    {
      title: 'Learn Kanji',
      description: 'Explore new characters',
      icon: <Brain className="w-6 h-6" />,
      href: '/dashboard/kanji',
      color: 'from-japanese-purple to-japanese-pink',
    },
    {
      title: 'JLPT Practice',
      description: 'Take mock tests',
      icon: <Award className="w-6 h-6" />,
      href: '/dashboard/jlpt',
      color: 'from-japanese-yellow to-japanese-pink',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-japanese-pink via-japanese-purple to-japanese-blue rounded-2xl md:rounded-3xl p-4 md:p-8 text-white shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">
              {getGreeting()}
            </h1>
            <p className="text-base md:text-xl opacity-90 truncate">{user?.fullName}さん</p>
            <div className="mt-3 md:mt-4 flex flex-wrap items-center gap-2 md:gap-4">
              <div className={`px-3 py-1 md:px-4 md:py-2 rounded-full ${getLevelColor(level)} font-semibold text-xs md:text-sm`}>
                Level: {level}
              </div>
              <div className="flex items-center gap-1 md:gap-2 text-sm md:text-base">
                <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                <span>120 Points</span>
              </div>
            </div>
          </div>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-5xl md:text-8xl ml-2 md:ml-4 flex-shrink-0"
          >
            🌸
          </motion.div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gradient">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Link href={action.href}>
                <Card hover className="h-full">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br ${action.color} flex items-center justify-center text-white mb-3 md:mb-4`}>
                    {action.icon}
                  </div>
                  <h3 className="text-sm md:text-lg font-bold mb-1">{action.title}</h3>
                  <p className="text-gray-600 text-xs md:text-sm hidden sm:block">{action.description}</p>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats & Progress */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6">
        <Card>
          <CardHeader className="pb-2 md:pb-4">
            <CardTitle className="text-sm md:text-base">Study Streak 🔥</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-4xl font-bold text-gradient mb-1 md:mb-2">7 Days</div>
            <p className="text-gray-600 text-xs md:text-sm">Keep it up!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 md:pb-4">
            <CardTitle className="text-sm md:text-base">Vocabulary 📚</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-4xl font-bold text-gradient mb-1 md:mb-2">342</div>
            <p className="text-gray-600 text-xs md:text-sm">Words learned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 md:pb-4">
            <CardTitle className="text-sm md:text-base">Practice Time ⏱️</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-4xl font-bold text-gradient mb-1 md:mb-2">12h</div>
            <p className="text-gray-600 text-xs md:text-sm">This week</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: 'Completed Grammar Exercise', time: '2 hours ago', icon: '✅' },
              { action: 'Chat with Sensei', time: '5 hours ago', icon: '💬' },
              { action: 'Learned 10 new Kanji', time: '1 day ago', icon: '📝' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <span className="text-2xl">{item.icon}</span>
                <div className="flex-1">
                  <p className="font-medium">{item.action}</p>
                  <p className="text-sm text-gray-500">{item.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
