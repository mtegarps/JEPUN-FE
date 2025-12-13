'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { jlptFullAPI } from '@/lib/api/jlpt';
import { useSettingsStore } from '@/lib/store';
import toast from 'react-hot-toast';
import { 
  ArrowLeft,
  Loader2,
  Calendar,
  Clock,
  Repeat,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  Sparkles
} from 'lucide-react';

type Mode = 'menu' | 'daily' | 'session' | 'plan' | 'review';

export default function StudyToolsPage() {
  const [mode, setMode] = useState<Mode>('menu');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [selectedFocusAreas, setSelectedFocusAreas] = useState<string[]>(['vocabulary']);
  const [sessionDuration, setSessionDuration] = useState(30);
  const { level } = useSettingsStore();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sessionActive && sessionTime > 0) {
      interval = setInterval(() => {
        setSessionTime(prev => {
          if (prev <= 1) {
            setSessionActive(false);
            toast.success('Session completed! 🎉');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionActive, sessionTime]);

  const handleLoadDailyChallenge = async () => {
    setIsLoading(true);
    try {
      const response = await jlptFullAPI.getDailyChallenge(level);
      setData(response.data);
      setCurrentQuestion(0);
      setScore(0);
      setMode('daily');
      toast.success('Daily challenge loaded! 🌟');
    } catch (error) {
      toast.error('Failed to load daily challenge');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadStudyPlan = async () => {
    setIsLoading(true);
    try {
      const response = await jlptFullAPI.getStudyPlan(level);
      setData(response.data);
      setMode('plan');
      toast.success('Study plan loaded! 📚');
    } catch (error) {
      toast.error('Failed to load study plan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartSession = async () => {
    setIsLoading(true);
    try {
      const response = await jlptFullAPI.startSession({
        userId: 'current-user',
        level: level as any,
        focusAreas: selectedFocusAreas,
        durationMinutes: sessionDuration,
      });
      setData(response.data);
      setSessionTime(sessionDuration * 60);
      setSessionActive(true);
      setCurrentQuestion(0);
      setScore(0);
      setMode('session');
      toast.success('Study session started! 📖');
    } catch (error) {
      toast.error('Failed to start session');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadReview = async () => {
    setIsLoading(true);
    try {
      const response = await jlptFullAPI.review.getDue(10);
      setData(response.data);
      setCurrentQuestion(0);
      setScore(0);
      setMode('review');
      toast.success('Review questions loaded! 🔄');
    } catch (error) {
      toast.error('Failed to load review');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    
    const questions = data?.questions || data?.challenge?.questions || [];
    const current = questions[currentQuestion];
    const isCorrect = answer === current?.correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
      toast.success('正解！Correct! 🎉');
    } else {
      toast.error('残念！Try again! 💪');
    }

    if (mode === 'review' && current?.id) {
      jlptFullAPI.review.update({
        userId: 'current-user',
        questionId: current.id,
        wasCorrect: isCorrect,
        confidenceLevel: isCorrect ? 4 : 1,
      }).catch(console.error);
    }
  };

  const handleNext = () => {
    const questions = data?.questions || data?.challenge?.questions || [];
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
      setShowResult(false);
    } else {
      toast.success(`Completed! Score: ${score}/${questions.length}`);
    }
  };

  const handleBack = () => {
    setMode('menu');
    setData(null);
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setShowResult(false);
    setScore(0);
    setSessionActive(false);
    setSessionTime(0);
  };

  const toggleFocusArea = (area: string) => {
    setSelectedFocusAreas(prev =>
      prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderMenu = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Card hover className="cursor-pointer h-full" onClick={handleLoadDailyChallenge}>
          <CardContent className="py-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Daily Challenge</h3>
            <p className="text-gray-600">Complete today&apos;s challenge!</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Card hover className="cursor-pointer h-full" onClick={() => setMode('session')}>
          <CardContent className="py-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Study Session</h3>
            <p className="text-gray-600">Start a focused study session</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Card hover className="cursor-pointer h-full" onClick={handleLoadStudyPlan}>
          <CardContent className="py-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-400 to-teal-500 rounded-2xl flex items-center justify-center">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Study Plan</h3>
            <p className="text-gray-600">Get a personalized study plan</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Card hover className="cursor-pointer h-full" onClick={handleLoadReview}>
          <CardContent className="py-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-pink-400 to-red-500 rounded-2xl flex items-center justify-center">
              <Repeat className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Spaced Repetition</h3>
            <p className="text-gray-600">Review items due for practice</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );

  const renderSessionSetup = () => (
    <div className="space-y-6">
      <Button variant="ghost" onClick={handleBack}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-6 h-6 text-japanese-blue" />
            Study Session Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block font-medium mb-3">Focus Areas</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['vocabulary', 'grammar', 'kanji_reading', 'reading'].map(area => (
                <motion.button
                  key={area}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleFocusArea(area)}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                    selectedFocusAreas.includes(area)
                      ? 'border-japanese-pink bg-japanese-pink/10'
                      : 'border-gray-200 hover:border-japanese-pink/50'
                  }`}
                >
                  <div className="text-2xl mb-1">
                    {area === 'vocabulary' ? '📚' : area === 'grammar' ? '📝' : area === 'kanji_reading' ? '漢' : '📖'}
                  </div>
                  <div className="text-sm font-medium capitalize">{area.replace('_', ' ')}</div>
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-medium mb-3">Duration (minutes)</label>
            <div className="flex gap-3">
              {[15, 30, 45, 60].map(mins => (
                <button
                  key={mins}
                  onClick={() => setSessionDuration(mins)}
                  className={`px-6 py-3 rounded-xl font-bold transition-all ${
                    sessionDuration === mins ? 'bg-japanese-pink text-white' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {mins}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={handleStartSession} disabled={isLoading || selectedFocusAreas.length === 0} className="w-full" size="lg">
            {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Starting...</> : <><Play className="w-4 h-4 mr-2" />Start Session</>}
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderQuiz = (title: string, icon: React.ReactNode) => {
    const questions = data?.questions || data?.challenge?.questions || [];
    const current = questions[currentQuestion];

    if (!current) {
      return (
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
          <h2 className="text-2xl font-bold mb-2">All Done!</h2>
          <p className="text-gray-600 mb-6">Score: {score}/{questions.length}</p>
          <Button onClick={handleBack}>Back to Menu</Button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={handleBack}><ArrowLeft className="w-4 h-4 mr-2" /> Exit</Button>
          <div className="flex items-center gap-4">
            {mode === 'session' && sessionTime > 0 && (
              <div className="flex items-center gap-2">
                <Clock className={`w-4 h-4 ${sessionTime < 60 ? 'text-red-500' : 'text-gray-500'}`} />
                <span className={`font-mono font-bold ${sessionTime < 60 ? 'text-red-500' : ''}`}>{formatTime(sessionTime)}</span>
                <Button variant="ghost" size="sm" onClick={() => setSessionActive(!sessionActive)}>
                  {sessionActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
              </div>
            )}
            <div className="text-sm font-medium">{currentQuestion + 1} / {questions.length} | Score: {score}</div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">{icon}{title}</span>
              <span className="text-sm px-3 py-1 bg-japanese-pink text-white rounded-full">{level}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-lg font-medium">{current?.question}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {current?.options?.map((option: string, idx: number) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = option === current?.correctAnswer;
                return (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: showResult ? 1 : 1.02 }}
                    whileTap={{ scale: showResult ? 1 : 0.98 }}
                    onClick={() => !showResult && handleAnswer(option)}
                    disabled={showResult}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      showResult ? isCorrect ? 'border-green-500 bg-green-50' : isSelected ? 'border-red-500 bg-red-50' : 'border-gray-200'
                      : isSelected ? 'border-japanese-pink bg-japanese-pink/10' : 'border-gray-200 hover:border-japanese-pink/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        showResult ? isCorrect ? 'bg-green-500 text-white' : isSelected ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'
                        : isSelected ? 'bg-japanese-pink text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {showResult ? (isCorrect ? <CheckCircle className="w-5 h-5" /> : isSelected ? <XCircle className="w-5 h-5" /> : String.fromCharCode(65 + idx)) : String.fromCharCode(65 + idx)}
                      </div>
                      <span className="font-medium">{option}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {showResult && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {current?.explanation && (
                  <div className="bg-blue-50 rounded-xl p-4">
                    <h4 className="font-bold mb-2">💡 Explanation</h4>
                    <p className="text-sm">{current.explanation}</p>
                  </div>
                )}
                <Button onClick={handleNext} className="w-full">
                  {currentQuestion < questions.length - 1 ? 'Next Question →' : 'Finish 🎉'}
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderStudyPlan = () => {
    if (!data) return null;

    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={handleBack}><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-6 h-6 text-green-500" />
              Study Plan for {level}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {data.overview && (
              <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6">
                <h4 className="font-bold mb-2">📋 Overview</h4>
                <p>{data.overview}</p>
              </div>
            )}

            {data.weeklyGoals && (
              <div>
                <h4 className="font-bold mb-4">🎯 Weekly Goals</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.weeklyGoals.map((goal: any, idx: number) => (
                    <div key={idx} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{goal.icon || '📚'}</span>
                        <span className="font-bold">{goal.area}</span>
                      </div>
                      <p className="text-sm text-gray-600">{goal.target}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.recommendations && (
              <div className="bg-yellow-50 rounded-xl p-6">
                <h4 className="font-bold mb-4">💡 Recommendations</h4>
                <ul className="space-y-2">
                  {data.recommendations.map((rec: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-yellow-600">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-japanese-pink" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-japanese-pink via-japanese-purple to-japanese-blue rounded-2xl p-6 text-white shadow-xl"
      >
        <div className="flex items-center gap-4">
          <div className="text-5xl">🛠️</div>
          <div>
            <h1 className="text-3xl font-bold">Study Tools</h1>
            <p className="opacity-90">Tools to help you study smarter</p>
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {mode === 'menu' && <motion.div key="menu" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>{renderMenu()}</motion.div>}
        {mode === 'session' && !data && <motion.div key="session-setup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>{renderSessionSetup()}</motion.div>}
        {mode === 'daily' && <motion.div key="daily" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>{renderQuiz('Daily Challenge', <Sparkles className="w-5 h-5 text-yellow-500" />)}</motion.div>}
        {mode === 'session' && data && <motion.div key="session" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>{renderQuiz('Study Session', <Clock className="w-5 h-5 text-blue-500" />)}</motion.div>}
        {mode === 'plan' && <motion.div key="plan" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>{renderStudyPlan()}</motion.div>}
        {mode === 'review' && <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>{renderQuiz('Spaced Repetition Review', <Repeat className="w-5 h-5 text-pink-500" />)}</motion.div>}
      </AnimatePresence>
    </div>
  );
}
