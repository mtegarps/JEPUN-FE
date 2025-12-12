'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { 
  MessageCircle, 
  BookOpen, 
  Award, 
  Sparkles,
  Brain,
  TrendingUp 
} from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: 'AI Sensei Chat',
      description: 'Chat dengan guru AI yang bisa adjust ke level kamu (N5-N1)',
      color: 'from-japanese-pink to-japanese-purple',
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'Grammar Checker',
      description: 'Koreksi grammar real-time dengan penjelasan detail',
      color: 'from-japanese-blue to-japanese-green',
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'Kanji Explorer',
      description: 'Belajar kanji dengan mnemonic kreatif dan fun',
      color: 'from-japanese-purple to-japanese-pink',
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'JLPT Mock Test',
      description: 'Latihan soal JLPT dengan AI-generated questions',
      color: 'from-japanese-yellow to-japanese-pink',
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Learning Path',
      description: 'Kurikulum personal sesuai goal dan level kamu',
      color: 'from-japanese-green to-japanese-blue',
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'Gamification',
      description: 'Earn points, unlock achievements, have fun!',
      color: 'from-japanese-pink to-japanese-yellow',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 overflow-hidden">
      {/* Cherry blossoms floating effect */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="sakura"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="inline-block text-8xl mb-6"
          >
            🌸
          </motion.div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            <span className="text-gradient">日本語</span>
            <br />
            <span className="bg-gradient-to-r from-japanese-blue to-japanese-purple bg-clip-text text-transparent">
              を学ぼう！
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Belajar bahasa Jepang dengan AI yang fun dan interaktif!
            <br />
            Dari N5 sampai N1, kami bantu kamu! 💪
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth/register">
              <Button size="lg" className="group">
                <span className="mr-2">始めましょう！</span>
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  →
                </motion.span>
              </Button>
            </Link>

            <Link href="/auth/login">
              <Button size="lg" variant="outline">
                <span>ログイン</span>
              </Button>
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-japanese-yellow" />
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-japanese-pink" />
              <span>JLPT Prep</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-japanese-green" />
              <span>Progress Tracking</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center mb-12"
        >
          <span className="text-gradient">何ができる？</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, rotate: 1 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div
                className={`w-16 h-16 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-japanese-pink via-japanese-purple to-japanese-blue rounded-3xl p-12 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="cursor-default"
            >
              <div className="text-5xl font-bold mb-2">5000+</div>
              <div className="text-xl opacity-90">Active Learners</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="cursor-default"
            >
              <div className="text-5xl font-bold mb-2">10K+</div>
              <div className="text-xl opacity-90">Practice Sessions</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="cursor-default"
            >
              <div className="text-5xl font-bold mb-2">95%</div>
              <div className="text-xl opacity-90">Success Rate</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-5xl font-bold mb-6">
            <span className="text-gradient">今日から始めよう！</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Mulai perjalanan belajar bahasa Jepang kamu sekarang!
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="text-xl px-12 py-6">
              無料で始める 🚀
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 text-center text-gray-600">
        <p>Made with 💖 by Om Tegar</p>
        <p className="text-sm mt-2">© 2025 All rights reserved</p>
      </footer>
    </div>
  );
}
