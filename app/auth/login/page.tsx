'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { authAPI } from '@/lib/api/client';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authAPI.login(formData);
      const { accessToken, refreshToken, user } = response.data;

      // Save to localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // Update store
      setUser(user);
      setToken(accessToken);

      toast.success('ログイン成功！ Welcome back! 🎉');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Login failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      {/* Floating cherry blossoms */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="sakura"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-8 japanese-shadow">
          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="text-4xl md:text-6xl mb-3 md:mb-4"
            >
              🌸
            </motion.div>
            <h1 className="text-2xl md:text-3xl font-bold text-gradient mb-2">
              おかえりなさい！
            </h1>
            <p className="text-gray-600 text-sm md:text-base">Welcome back! Let's continue learning</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isLoading}
            >
              <LogIn className="w-5 h-5 mr-2" />
              ログイン
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm">または</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-gray-600">
              アカウントがない？{' '}
              <Link
                href="/auth/register"
                className="text-japanese-pink font-semibold hover:underline"
              >
                新規登録
              </Link>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-gray-600 hover:text-japanese-pink">
            ← ホームに戻る
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
