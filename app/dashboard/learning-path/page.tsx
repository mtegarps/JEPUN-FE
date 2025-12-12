'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { learningPathAPI } from '@/lib/api/client';
import { useSettingsStore } from '@/lib/store';
import toast from 'react-hot-toast';
import { TrendingUp, Target, Clock } from 'lucide-react';

export default function LearningPathPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [path, setPath] = useState<any>(null);
  const { level } = useSettingsStore();

  const [formData, setFormData] = useState({
    currentLevel: level,
    goals: '',
    studyTime: 5,
    weakPoints: '',
  });

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const response = await learningPathAPI.generate({
        currentLevel: formData.currentLevel,
        goals: formData.goals,
        studyTime: Number(formData.studyTime),
        weakPoints: formData.weakPoints ? formData.weakPoints.split(',').map(s => s.trim()) : undefined,
      });
      setPath(response.data);
      toast.success('Learning path generated! 🎯');
    } catch (error) {
      toast.error('Failed to generate learning path');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-japanese-green via-japanese-blue to-japanese-purple rounded-2xl p-6 text-white shadow-xl"
      >
        <div className="flex items-center gap-4">
          <div className="text-5xl">📈</div>
          <div>
            <h1 className="text-3xl font-bold">Learning Path</h1>
            <p className="opacity-90">Get your personalized study roadmap</p>
          </div>
        </div>
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle>Generate Your Learning Path</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Current Level"
              value={formData.currentLevel}
              onChange={(e) => setFormData({...formData, currentLevel: e.target.value})}
            />
            <Input
              label="Study Time (hours/week)"
              type="number"
              value={formData.studyTime}
              onChange={(e) => setFormData({...formData, studyTime: Number(e.target.value)})}
            />
          </div>

          <Input
            label="Your Goals"
            placeholder="e.g., Pass JLPT N3, Business conversation"
            value={formData.goals}
            onChange={(e) => setFormData({...formData, goals: e.target.value})}
          />

          <Input
            label="Weak Points (comma-separated)"
            placeholder="e.g., kanji, listening, grammar"
            value={formData.weakPoints}
            onChange={(e) => setFormData({...formData, weakPoints: e.target.value})}
          />

          <Button onClick={handleGenerate} isLoading={isLoading} className="w-full">
            <Target className="w-4 h-4 mr-2" />
            Generate Learning Path
          </Button>
        </CardContent>
      </Card>

      {path && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Your 12-Week Roadmap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-japanese-pink/10 to-japanese-blue/10 rounded-xl p-6">
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap">{path.roadmap}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="text-center py-6">
            <Target className="w-12 h-12 mx-auto mb-3 text-japanese-pink" />
            <h3 className="font-bold text-lg mb-1">Goal Setting</h3>
            <p className="text-sm text-gray-600">Clear objectives</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center py-6">
            <TrendingUp className="w-12 h-12 mx-auto mb-3 text-japanese-blue" />
            <h3 className="font-bold text-lg mb-1">Progress Tracking</h3>
            <p className="text-sm text-gray-600">Monitor improvement</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center py-6">
            <Clock className="w-12 h-12 mx-auto mb-3 text-japanese-purple" />
            <h3 className="font-bold text-lg mb-1">Flexible Schedule</h3>
            <p className="text-sm text-gray-600">Adapt to your pace</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
