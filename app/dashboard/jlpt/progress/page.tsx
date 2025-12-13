'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { jlptFullAPI } from '@/lib/api/jlpt';
import { useSettingsStore } from '@/lib/store';
import toast from 'react-hot-toast';
import { 
  Loader2,
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  Brain,
  BarChart3,
  PieChart,
  Calendar,
  Flame,
  RefreshCw
} from 'lucide-react';

export default function ProgressPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState<any>(null);
  const [weakness, setWeakness] = useState<any>(null);
  const [prediction, setPrediction] = useState<any>(null);
  const [achievements, setAchievements] = useState<any[]>([]);
  const { level } = useSettingsStore();

  useEffect(() => {
    loadAllData();
  }, [level]);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [progressRes, weaknessRes, predictionRes, achievementsRes] = await Promise.all([
        jlptFullAPI.getProgress(level).catch(() => ({ data: null })),
        jlptFullAPI.getWeakness(50).catch(() => ({ data: null })),
        jlptFullAPI.predictLevel().catch(() => ({ data: null })),
        jlptFullAPI.achievements.getAll().catch(() => ({ data: [] })),
      ]);

      setProgress(progressRes.data);
      setWeakness(weaknessRes.data);
      setPrediction(predictionRes.data);
      setAchievements(achievementsRes.data?.achievements || []);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckAchievements = async () => {
    try {
      const response = await jlptFullAPI.achievements.check();
      if (response.data?.newAchievements?.length > 0) {
        toast.success(`🏆 ${response.data.newAchievements.length} new achievement(s) unlocked!`);
        loadAllData();
      } else {
        toast.success('No new achievements yet. Keep studying!');
      }
    } catch (error) {
      toast.error('Failed to check achievements');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-japanese-pink" />
          <p className="text-gray-600">Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-japanese-blue via-japanese-purple to-japanese-pink rounded-2xl p-6 text-white shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-5xl">📊</div>
            <div>
              <h1 className="text-3xl font-bold">Progress & Analysis</h1>
              <p className="opacity-90">Track your JLPT learning journey</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            onClick={loadAllData}
            className="text-white hover:bg-white/20"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="py-6 text-center">
              <Target className="w-8 h-8 mx-auto mb-2 text-japanese-pink" />
              <div className="text-3xl font-bold">{progress?.totalQuestions || 0}</div>
              <div className="text-sm text-gray-600">Questions Answered</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="py-6 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <div className="text-3xl font-bold">{progress?.accuracy || 0}%</div>
              <div className="text-sm text-gray-600">Accuracy Rate</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardContent className="py-6 text-center">
              <Flame className="w-8 h-8 mx-auto mb-2 text-orange-500" />
              <div className="text-3xl font-bold">{progress?.streak || 0}</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardContent className="py-6 text-center">
              <Award className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              <div className="text-3xl font-bold">{achievements.filter(a => a.unlocked).length}</div>
              <div className="text-sm text-gray-600">Achievements</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Level Prediction */}
      {prediction && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-6 h-6 text-japanese-purple" />
                AI Level Prediction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 mb-2">Based on your performance, we predict you&apos;re at:</p>
                  <div className="flex items-center gap-4">
                    <span className="text-5xl font-bold text-japanese-pink">{prediction.predictedLevel || level}</span>
                    <div>
                      <div className="flex items-center gap-1 text-sm">
                        {prediction.trend === 'improving' ? (
                          <>
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            <span className="text-green-600">Improving</span>
                          </>
                        ) : prediction.trend === 'declining' ? (
                          <>
                            <TrendingDown className="w-4 h-4 text-red-500" />
                            <span className="text-red-600">Needs attention</span>
                          </>
                        ) : (
                          <span className="text-gray-500">Stable</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">Confidence: {prediction.confidence || 75}%</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Ready for next level?</p>
                  <div className="w-32 bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-japanese-pink h-3 rounded-full transition-all"
                      style={{ width: `${prediction.readiness || 60}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{prediction.readiness || 60}% ready</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Weakness Analysis */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-japanese-blue" />
              Weakness Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            {weakness?.weakAreas?.length > 0 ? (
              <div className="space-y-4">
                {weakness.weakAreas.map((area: any, idx: number) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{area.type || area.category}</span>
                      <span className={`text-sm ${
                        area.accuracy < 50 ? 'text-red-600' : 
                        area.accuracy < 70 ? 'text-yellow-600' : 
                        'text-green-600'
                      }`}>
                        {area.accuracy}% accuracy
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          area.accuracy < 50 ? 'bg-red-500' : 
                          area.accuracy < 70 ? 'bg-yellow-500' : 
                          'bg-green-500'
                        }`}
                        style={{ width: `${area.accuracy}%` }}
                      />
                    </div>
                    {area.recommendation && (
                      <p className="text-xs text-gray-500">💡 {area.recommendation}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <PieChart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Answer more questions to see your weakness analysis</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Performance by Type */}
      {progress?.performanceByType && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-6 h-6 text-japanese-yellow" />
                Performance by Question Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(progress.performanceByType).map(([type, stats]: [string, any]) => (
                  <div key={type} className="bg-gray-50 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-2">
                      {type === 'vocabulary' ? '📚' :
                       type === 'grammar' ? '📝' :
                       type === 'kanji_reading' ? '🔊' :
                       type === 'kanji_meaning' ? '漢' :
                       type === 'reading' ? '📖' : '❓'}
                    </div>
                    <div className="font-bold capitalize">{type.replace('_', ' ')}</div>
                    <div className={`text-2xl font-bold ${
                      stats.accuracy >= 70 ? 'text-green-600' :
                      stats.accuracy >= 50 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {stats.accuracy}%
                    </div>
                    <div className="text-xs text-gray-500">{stats.total} questions</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Achievements */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Award className="w-6 h-6 text-yellow-500" />
                Achievements
              </CardTitle>
              <Button variant="outline" size="sm" onClick={handleCheckAchievements}>
                Check for New
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {achievements.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {achievements.map((achievement, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    className={`p-4 rounded-xl text-center transition-all ${
                      achievement.unlocked 
                        ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300'
                        : 'bg-gray-100 opacity-50'
                    }`}
                  >
                    <div className="text-4xl mb-2">{achievement.icon || '🏆'}</div>
                    <div className="font-bold text-sm">{achievement.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{achievement.description}</div>
                    {achievement.unlocked && achievement.unlockedAt && (
                      <div className="text-xs text-yellow-600 mt-2">
                        🎉 {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Award className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Start studying to unlock achievements!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Study Calendar/History */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-6 h-6 text-japanese-pink" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {progress?.recentActivity?.length > 0 ? (
              <div className="space-y-3">
                {progress.recentActivity.slice(0, 7).map((activity: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.performance >= 80 ? 'bg-green-500' :
                        activity.performance >= 60 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`} />
                      <div>
                        <div className="font-medium">{activity.type}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(activity.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{activity.performance}%</div>
                      <div className="text-xs text-gray-500">{activity.questionsAnswered} questions</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No recent activity. Start practicing!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
