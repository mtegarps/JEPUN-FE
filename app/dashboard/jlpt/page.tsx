'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { jlptFullAPI } from '@/lib/api/jlpt';
import { useSettingsStore } from '@/lib/store';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { 
  FileQuestion, 
  Target, 
  Award,
  Image,
  BookOpen,
  PenTool,
  BarChart3,
  Sparkles,
  ChevronRight,
  Loader2,
  CheckCircle,
  XCircle
} from 'lucide-react';

const JLPT_FEATURES = [
  {
    id: 'visual',
    title: 'Visual Quizzes',
    description: 'Learn with images, emotions, and scenes',
    icon: Image,
    color: 'from-pink-400 to-red-500',
    href: '/dashboard/jlpt/visual',
    badge: 'Popular',
  },
  {
    id: 'kanji',
    title: 'Kanji Practice',
    description: 'Mnemonics and kanji quizzes',
    icon: PenTool,
    color: 'from-purple-400 to-indigo-500',
    href: '/dashboard/jlpt/kanji-practice',
  },
  {
    id: 'manga',
    title: 'Manga & Reading',
    description: 'Stories, passages, and cultural lessons',
    icon: BookOpen,
    color: 'from-blue-400 to-cyan-500',
    href: '/dashboard/jlpt/manga-reading',
  },
  {
    id: 'mock',
    title: 'Mock Tests',
    description: 'Quick, custom, full, and adaptive tests',
    icon: Target,
    color: 'from-green-400 to-teal-500',
    href: '/dashboard/jlpt/mock-tests',
    badge: 'New',
  },
  {
    id: 'progress',
    title: 'Progress & Analysis',
    description: 'Track your learning journey',
    icon: BarChart3,
    color: 'from-yellow-400 to-orange-500',
    href: '/dashboard/jlpt/progress',
  },
  {
    id: 'tools',
    title: 'Study Tools',
    description: 'Daily challenge, sessions, spaced repetition',
    icon: Sparkles,
    color: 'from-rose-400 to-pink-500',
    href: '/dashboard/jlpt/study-tools',
  },
];

export default function JLPTPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [question, setQuestion] = useState<any>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const { level } = useSettingsStore();

  const handleGenerateQuestion = async (type: string = 'vocabulary') => {
    setIsLoading(true);
    setShowResult(false);
    setSelectedAnswer('');
    try {
      const response = await jlptFullAPI.question.generate({ 
        level: level as any, 
        type: type as any,
        difficulty: 'medium',
      });
      setQuestion(response.data);
      toast.success('Question generated! 📝');
    } catch (error) {
      toast.error('Failed to generate question');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckAnswer = () => {
    if (!selectedAnswer) {
      toast.error('Please select an answer');
      return;
    }
    setShowResult(true);
    if (selectedAnswer === question.correctAnswer) {
      toast.success('よくできました！ Correct! 🎉');
    } else {
      toast.error('間違い Try again! 💪');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-japanese-yellow via-japanese-pink to-japanese-purple rounded-2xl p-6 text-white shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-5xl">🏆</div>
            <div>
              <h1 className="text-3xl font-bold">JLPT Practice Hub</h1>
              <p className="opacity-90">AI-powered Japanese language learning</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-75">Current Level</div>
            <div className="text-4xl font-bold">{level}</div>
          </div>
        </div>
      </motion.div>

      {/* Quick Practice */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileQuestion className="w-5 h-5 text-japanese-pink" />
            Quick Practice
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
            {['vocabulary', 'grammar', 'kanji_reading', 'kanji_meaning', 'reading'].map(type => (
              <Button
                key={type}
                variant="outline"
                onClick={() => handleGenerateQuestion(type)}
                disabled={isLoading}
                className="capitalize"
              >
                {type.replace('_', ' ')}
              </Button>
            ))}
          </div>

          {isLoading && (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin text-japanese-pink" />
              <p className="text-gray-600">Generating question...</p>
            </div>
          )}

          {question && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 space-y-4"
            >
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs px-2 py-1 bg-japanese-pink text-white rounded-full">
                    {question.type || 'Question'}
                  </span>
                  <span className="text-xs text-gray-500">{question.difficulty}</span>
                </div>
                <p className="text-lg font-medium">{question.question}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {question.options?.map((option: string, idx: number) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrect = option === question.correctAnswer;
                  
                  return (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: showResult ? 1 : 1.02 }}
                      whileTap={{ scale: showResult ? 1 : 0.98 }}
                      onClick={() => !showResult && setSelectedAnswer(option)}
                      disabled={showResult}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        showResult
                          ? isCorrect
                            ? 'border-green-500 bg-green-50'
                            : isSelected
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-200'
                          : isSelected
                            ? 'border-japanese-pink bg-japanese-pink/10'
                            : 'border-gray-200 hover:border-japanese-pink/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          showResult
                            ? isCorrect
                              ? 'bg-green-500 text-white'
                              : isSelected
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-200 text-gray-600'
                            : isSelected
                              ? 'bg-japanese-pink text-white'
                              : 'bg-gray-200 text-gray-600'
                        }`}>
                          {showResult ? (
                            isCorrect ? <CheckCircle className="w-5 h-5" /> : 
                            isSelected ? <XCircle className="w-5 h-5" /> :
                            String.fromCharCode(65 + idx)
                          ) : String.fromCharCode(65 + idx)}
                        </div>
                        <span className="font-medium">{option}</span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {!showResult ? (
                <Button onClick={handleCheckAnswer} disabled={!selectedAnswer} className="w-full">
                  Check Answer
                </Button>
              ) : (
                <div className="space-y-4">
                  {question.explanation && (
                    <div className="bg-blue-50 rounded-xl p-4">
                      <h4 className="font-bold mb-2">💡 Explanation</h4>
                      <p className="text-sm">{question.explanation}</p>
                    </div>
                  )}
                  <Button onClick={() => handleGenerateQuestion(question.type)} className="w-full">
                    Next Question →
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Feature Grid */}
      <div>
        <h2 className="text-xl font-bold mb-4">Explore Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {JLPT_FEATURES.map((feature, idx) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link href={feature.href}>
                <Card hover className="cursor-pointer h-full group">
                  <CardContent className="py-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      {feature.badge && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          feature.badge === 'New' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {feature.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold mb-1 group-hover:text-japanese-pink transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
                    <div className="flex items-center text-japanese-pink text-sm font-medium">
                      Explore <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-4 text-center">
            <div className="text-3xl mb-1">📚</div>
            <div className="text-2xl font-bold text-japanese-pink">5</div>
            <div className="text-xs text-gray-600">Quiz Types</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <div className="text-3xl mb-1">📝</div>
            <div className="text-2xl font-bold text-japanese-pink">4</div>
            <div className="text-xs text-gray-600">Test Modes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <div className="text-3xl mb-1">🎯</div>
            <div className="text-2xl font-bold text-japanese-pink">N5-N1</div>
            <div className="text-xs text-gray-600">All Levels</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <div className="text-3xl mb-1">🤖</div>
            <div className="text-2xl font-bold text-japanese-pink">AI</div>
            <div className="text-xs text-gray-600">Powered</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
