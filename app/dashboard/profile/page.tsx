'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { userAPI } from '@/lib/api/client';
import { useAuthStore, useSettingsStore } from '@/lib/store';
import { JLPT_LEVELS, getLevelColor } from '@/lib/utils';
import toast from 'react-hot-toast';
import { User, Award, Flame } from 'lucide-react';

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const { level, setLevel } = useSettingsStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingStreak, setIsUpdatingStreak] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
  });

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      const response = await userAPI.updateProfile(formData);
      setUser(response.data.user);
      toast.success('Profile berhasil diupdate! ✅');
    } catch (error) {
      toast.error('Gagal update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateLevel = async (newLevel: string) => {
    setIsLoading(true);
    try {
      await userAPI.updateJLPTLevel({ level: newLevel });
      setLevel(newLevel);
      toast.success(`Level diupdate ke ${newLevel}! 🎯`);
    } catch (error) {
      toast.error('Gagal update level');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStreak = async () => {
    setIsUpdatingStreak(true);
    try {
      await userAPI.updateStudyStreak();
      toast.success('Study streak diupdate! 🔥');
    } catch (error) {
      toast.error('Gagal update study streak');
    } finally {
      setIsUpdatingStreak(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-japanese-pink to-japanese-purple rounded-2xl p-6 text-white shadow-xl"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{user?.fullName}</h1>
            <p className="opacity-90">{user?.email}</p>
          </div>
        </div>
      </motion.div>

      {/* Update Profile */}
      <Card>
        <CardHeader>
          <CardTitle>
            <User className="w-5 h-5 inline mr-2" />
            Update Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Full Name"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <Button onClick={handleUpdateProfile} isLoading={isLoading}>
            Update Profile
          </Button>
        </CardContent>
      </Card>

      {/* Update JLPT Level */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Award className="w-5 h-5 inline mr-2" />
            JLPT Level
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-gray-600 mb-4">
              Current Level: <span className={`px-3 py-1 rounded-full ${getLevelColor(level)} font-bold`}>{level}</span>
            </p>
            <div className="flex flex-wrap gap-3">
              {JLPT_LEVELS.map((lvl) => (
                <Button
                  key={lvl}
                  variant={level === lvl ? 'primary' : 'outline'}
                  onClick={() => handleUpdateLevel(lvl)}
                  disabled={isLoading}
                  className={level !== lvl ? getLevelColor(lvl) : ''}
                >
                  {lvl}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Study Streak */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Flame className="w-5 h-5 inline mr-2" />
            Study Streak
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
            <div className="text-6xl mb-2">🔥</div>
            <div className="text-4xl font-bold text-gradient mb-1">7 Days</div>
            <p className="text-gray-600">Keep it up!</p>
          </div>
          <Button 
            onClick={handleUpdateStreak} 
            isLoading={isUpdatingStreak}
            className="w-full"
          >
            Update Study Streak
          </Button>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-4xl mb-2">📚</div>
            <div className="text-2xl font-bold text-gradient">342</div>
            <p className="text-sm text-gray-600">Words Learned</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center py-6">
            <div className="text-4xl mb-2">⏱️</div>
            <div className="text-2xl font-bold text-gradient">12h</div>
            <p className="text-sm text-gray-600">Study Time</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center py-6">
            <div className="text-4xl mb-2">⭐</div>
            <div className="text-2xl font-bold text-gradient">120</div>
            <p className="text-sm text-gray-600">Points</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
