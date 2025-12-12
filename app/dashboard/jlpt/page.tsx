'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { jlptAPI } from '@/lib/api/client';
import { useSettingsStore } from '@/lib/store';
import toast from 'react-hot-toast';
import { Award, FileQuestion, Target } from 'lucide-react';

export default function JLPTPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [question, setQuestion] = useState<any>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const { level } = useSettingsStore();

  const handleGenerateQuestion = async () => {
    setIsLoading(true);
    setShowResult(false);
    setSelectedAnswer('');
    try {
      const response = await jlptAPI.generateQuestion({ 
        level, 
        type: 'grammar' 
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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-japanese-yellow via-japanese-pink to-japanese-purple rounded-2xl p-6 text-white shadow-xl"
      >
        <div className="flex items-center gap-4">
          <div className="text-5xl">🏆</div>
          <div>
            <h1 className="text-3xl font-bold">JLPT Practice</h1>
            <p className="opacity-90">Practice with AI-generated JLPT questions</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card hover className={`cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={!isLoading ? handleGenerateQuestion : undefined}>
          <CardContent className="text-center py-8">
            {isLoading ? (
              <>
                <div className="w-12 h-12 mx-auto mb-3 animate-spin rounded-full border-4 border-japanese-pink border-t-transparent" />
                <h3 className="font-bold">Generating...</h3>
                <p className="text-sm text-gray-600">Please wait</p>
              </>
            ) : (
              <>
                <FileQuestion className="w-12 h-12 mx-auto mb-3 text-japanese-pink" />
                <h3 className="font-bold">Generate Question</h3>
                <p className="text-sm text-gray-600">Get a random JLPT question</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card hover className="cursor-pointer opacity-50">
          <CardContent className="text-center py-8">
            <Target className="w-12 h-12 mx-auto mb-3 text-japanese-blue" />
            <h3 className="font-bold">Mock Test</h3>
            <p className="text-sm text-gray-600">Coming soon!</p>
          </CardContent>
        </Card>

        <Card hover className="cursor-pointer opacity-50">
          <CardContent className="text-center py-8">
            <Award className="w-12 h-12 mx-auto mb-3 text-japanese-purple" />
            <h3 className="font-bold">My Results</h3>
            <p className="text-sm text-gray-600">Coming soon!</p>
          </CardContent>
        </Card>
      </div>

      {question && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>JLPT {level} Question</CardTitle>
                <span className="px-3 py-1 bg-japanese-pink text-white rounded-full text-sm">
                  {question.difficulty}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <p className="text-lg font-medium mb-4">{question.question}</p>
              </div>

              <div className="space-y-3">
                {question.options?.map((option: string, idx: number) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => !showResult && setSelectedAnswer(option)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedAnswer === option
                        ? showResult
                          ? option === question.correctAnswer
                            ? 'border-green-500 bg-green-50'
                            : 'border-red-500 bg-red-50'
                          : 'border-japanese-pink bg-japanese-pink/10'
                        : 'border-gray-200 hover:border-japanese-pink/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        selectedAnswer === option
                          ? 'bg-japanese-pink text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span>{option}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {!showResult ? (
                <Button 
                  onClick={handleCheckAnswer}
                  disabled={!selectedAnswer}
                  className="w-full"
                >
                  Check Answer
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className={`rounded-xl p-4 ${
                    selectedAnswer === question.correctAnswer
                      ? 'bg-green-50 border-2 border-green-500'
                      : 'bg-red-50 border-2 border-red-500'
                  }`}>
                    <h4 className="font-bold mb-2">
                      {selectedAnswer === question.correctAnswer ? '✅ Correct!' : '❌ Incorrect'}
                    </h4>
                    <p className="text-sm mb-2">
                      <strong>Correct Answer:</strong> {question.correctAnswer}
                    </p>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-4">
                    <h4 className="font-bold mb-2">Explanation:</h4>
                    <p className="text-sm whitespace-pre-wrap">{question.explanation}</p>
                  </div>

                  <div className="bg-purple-50 rounded-xl p-4">
                    <h4 className="font-bold mb-2">Grammar Point:</h4>
                    <p className="text-sm">{question.grammarPoint}</p>
                  </div>

                  <Button onClick={handleGenerateQuestion} className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Loading...
                      </span>
                    ) : (
                      'Next Question →'
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}