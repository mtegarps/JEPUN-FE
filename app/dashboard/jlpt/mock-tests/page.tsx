'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { jlptFullAPI } from '@/lib/api/jlpt';
import { useSettingsStore } from '@/lib/store';
import toast from 'react-hot-toast';
import { 
  ArrowLeft,
  Loader2,
  Clock,
  Target,
  Zap,
  FileText,
  CheckCircle,
  XCircle,
  Trophy,
  BarChart3
} from 'lucide-react';

type TestMode = 'menu' | 'quick' | 'custom' | 'full' | 'adaptive' | 'result';

const TEST_TYPES = [
  { id: 'quick', label: '⚡ Quick Test', description: '10-15 questions, ~10 mins', icon: Zap, color: 'from-yellow-400 to-orange-500' },
  { id: 'custom', label: '🎯 Custom Test', description: 'Choose sections & time', icon: Target, color: 'from-blue-400 to-purple-500' },
  { id: 'full', label: '📝 Full Mock Test', description: 'Complete JLPT simulation', icon: FileText, color: 'from-green-400 to-teal-500' },
  { id: 'adaptive', label: '🧠 Adaptive Test', description: 'AI adjusts difficulty', icon: BarChart3, color: 'from-pink-400 to-red-500' },
];

const SECTIONS = [
  { id: 'moji_goi', label: '文字・語彙', english: 'Vocabulary & Kanji' },
  { id: 'bunpou', label: '文法', english: 'Grammar' },
  { id: 'dokkai', label: '読解', english: 'Reading' },
];

export default function MockTestsPage() {
  const [mode, setMode] = useState<TestMode>('menu');
  const [isLoading, setIsLoading] = useState(false);
  const [testData, setTestData] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [answers, setAnswers] = useState<any[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [testResult, setTestResult] = useState<any>(null);
  
  // Custom test settings
  const [selectedSections, setSelectedSections] = useState<string[]>(['moji_goi']);
  const [questionsPerSection, setQuestionsPerSection] = useState(10);
  const [timedMode, setTimedMode] = useState(false);
  
  const { level } = useSettingsStore();

  const handleStartQuickTest = async () => {
    setIsLoading(true);
    try {
      const response = await jlptFullAPI.mockTest.quick({
        level: level as any,
        questionCount: level === 'N5' ? 10 : 15,
        types: ['vocabulary', 'grammar', 'kanji_reading'],
      });
      setTestData(response.data);
      setCurrentQuestion(0);
      setAnswers([]);
      setMode('quick');
      toast.success('Quick test started! ⚡');
    } catch (error) {
      toast.error('Failed to load test');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartCustomTest = async () => {
    if (selectedSections.length === 0) {
      toast.error('Please select at least one section');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await jlptFullAPI.mockTest.custom({
        level: level as any,
        sections: selectedSections as any,
        questionsPerSection,
        timedMode,
      });
      setTestData(response.data);
      setCurrentQuestion(0);
      setAnswers([]);
      if (timedMode) {
        setTimeLeft(selectedSections.length * questionsPerSection * 60); // 1 min per question
      }
      setMode('custom');
      toast.success('Custom test started! 🎯');
    } catch (error) {
      toast.error('Failed to load test');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartFullTest = async () => {
    setIsLoading(true);
    try {
      const response = await jlptFullAPI.mockTest.full({
        level: level as any,
        includeListening: false,
      });
      setTestData(response.data);
      setCurrentQuestion(0);
      setAnswers([]);
      setMode('full');
      toast.success('Full mock test started! 📝');
    } catch (error) {
      toast.error('Failed to load test');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartAdaptiveTest = async () => {
    setIsLoading(true);
    try {
      const response = await jlptFullAPI.mockTest.adaptive({
        startLevel: level as any,
        questionCount: 20,
      });
      setTestData(response.data);
      setCurrentQuestion(0);
      setAnswers([]);
      setMode('adaptive');
      toast.success('Adaptive test started! 🧠');
    } catch (error) {
      toast.error('Failed to load test');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
  };

const handleSubmitAnswer = () => {
  // Get questions from sections array
  const questions = testData?.sections?.[0]?.questions || testData?.questions || [];
  const current = questions[currentQuestion];
    
    const answerData = {
      questionId: current?.id || `q_${currentQuestion}`,
      userAnswer: selectedAnswer,
      correctAnswer: current?.correctAnswer,
      questionType: current?.type || 'vocabulary',
      timeSpentSeconds: 30,
    };
    
    const newAnswers = [...answers, answerData];
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
      setShowResult(false);
    } else {
      // Test completed - calculate results
      const correct = newAnswers.filter(a => a.userAnswer === a.correctAnswer).length;
      setTestResult({
        score: correct,
        total: questions.length,
        percentage: Math.round((correct / questions.length) * 100),
        answers: newAnswers,
        level,
      });
      setMode('result');
      toast.success('Test completed! 🎉');
    }
  };

  const handleBack = () => {
    setMode('menu');
    setTestData(null);
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setAnswers([]);
    setShowResult(false);
    setTimeLeft(null);
    setTestResult(null);
  };

  const toggleSection = (sectionId: string) => {
    setSelectedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(s => s !== sectionId)
        : [...prev, sectionId]
    );
  };

  const renderMenu = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TEST_TYPES.map(test => (
          <motion.div
            key={test.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              hover 
              className="cursor-pointer h-full overflow-hidden"
              onClick={() => {
                if (test.id === 'quick') handleStartQuickTest();
                else if (test.id === 'full') handleStartFullTest();
                else if (test.id === 'adaptive') handleStartAdaptiveTest();
                else setMode(test.id as TestMode);
              }}
            >
              <div className={`h-2 bg-gradient-to-r ${test.color}`} />
              <CardContent className="py-8">
                <test.icon className="w-12 h-12 mb-4 text-gray-700" />
                <h3 className="text-xl font-bold mb-2">{test.label}</h3>
                <p className="text-gray-600">{test.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold">Current Level</h3>
              <p className="text-sm text-gray-600">Tests will be generated for this level</p>
            </div>
            <span className="text-3xl font-bold text-japanese-pink">{level}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCustomSettings = () => (
    <div className="space-y-6">
      <Button variant="ghost" onClick={handleBack}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-6 h-6" />
            Custom Test Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block font-medium mb-3">Select Sections</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {SECTIONS.map(section => (
                <motion.button
                  key={section.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleSection(section.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    selectedSections.includes(section.id)
                      ? 'border-japanese-pink bg-japanese-pink/10'
                      : 'border-gray-200 hover:border-japanese-pink/50'
                  }`}
                >
                  <div className="font-bold text-lg">{section.label}</div>
                  <div className="text-sm text-gray-600">{section.english}</div>
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-medium mb-3">Questions per Section</label>
            <div className="flex gap-3">
              {[5, 10, 15, 20].map(num => (
                <button
                  key={num}
                  onClick={() => setQuestionsPerSection(num)}
                  className={`px-6 py-3 rounded-xl font-bold transition-all ${
                    questionsPerSection === num
                      ? 'bg-japanese-pink text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={timedMode}
                onChange={(e) => setTimedMode(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-japanese-pink focus:ring-japanese-pink"
              />
              <div>
                <span className="font-medium">Timed Mode</span>
                <p className="text-xs text-gray-500">Add time pressure like real JLPT</p>
              </div>
            </label>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-bold mb-2">Test Summary</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-japanese-pink">{selectedSections.length}</div>
                <div className="text-xs text-gray-600">Sections</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-japanese-pink">{selectedSections.length * questionsPerSection}</div>
                <div className="text-xs text-gray-600">Questions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-japanese-pink">~{selectedSections.length * questionsPerSection}</div>
                <div className="text-xs text-gray-600">Minutes</div>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleStartCustomTest} 
            disabled={isLoading || selectedSections.length === 0}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              'Start Custom Test 🎯'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );

const renderTest = () => {
  if (!testData) return null;
  
  // Get questions from sections array
  const questions = testData.sections?.[0]?.questions || testData.questions || [];
  const current = questions[currentQuestion];
  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Exit Test
          </Button>
          <div className="flex items-center gap-4">
            {timeLeft !== null && (
              <div className="flex items-center gap-2 text-orange-600">
                <Clock className="w-4 h-4" />
                <span className="font-mono font-bold">
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>
            )}
            <div className="text-sm font-medium">
              {currentQuestion + 1} / {questions.length}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-japanese-pink h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {current?.type === 'vocabulary' ? '📚 Vocabulary' :
                 current?.type === 'grammar' ? '📝 Grammar' :
                 current?.type === 'kanji_reading' ? '漢字 Kanji Reading' :
                 current?.type === 'kanji_meaning' ? '漢字 Kanji Meaning' :
                 current?.type === 'reading' ? '📖 Reading' : '❓ Question'}
              </CardTitle>
              <span className="px-3 py-1 bg-japanese-pink text-white rounded-full text-sm">
                {level}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Question */}
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-lg font-medium">{current?.question}</p>
              {current?.context && (
                <p className="text-sm text-gray-600 mt-2">{current.context}</p>
              )}
              {current?.passage && (
                <div className="mt-4 p-4 bg-white rounded-lg border">
                  <p className="whitespace-pre-wrap">{current.passage}</p>
                </div>
              )}
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {current?.options?.map((option: string, idx: number) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(option)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    selectedAnswer === option
                      ? 'border-japanese-pink bg-japanese-pink/10'
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
                    <span className="font-medium">{option}</span>
                  </div>
                </motion.button>
              ))}
            </div>

            <Button 
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer}
              className="w-full"
              size="lg"
            >
              {currentQuestion < questions.length - 1 ? 'Next Question →' : 'Finish Test 🏁'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderResult = () => {
    if (!testResult) return null;

    const isPassed = testResult.percentage >= 60;

    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-12 text-center">
            <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
              isPassed ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {isPassed ? (
                <Trophy className="w-12 h-12 text-green-600" />
              ) : (
                <XCircle className="w-12 h-12 text-red-600" />
              )}
            </div>
            
            <h2 className="text-3xl font-bold mb-2">
              {isPassed ? 'Congratulations! 🎉' : 'Keep Practicing! 💪'}
            </h2>
            <p className="text-gray-600 mb-8">
              {isPassed 
                ? "You've passed this mock test!" 
                : "You need 60% to pass. Try again!"}
            </p>

            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-4xl font-bold text-japanese-pink">{testResult.percentage}%</div>
                <div className="text-sm text-gray-600">Score</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-4xl font-bold text-green-600">{testResult.score}</div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-4xl font-bold text-red-600">{testResult.total - testResult.score}</div>
                <div className="text-sm text-gray-600">Wrong</div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={handleBack}>
                Back to Menu
              </Button>
              <Button onClick={() => {
                handleBack();
                // Could restart the same test type
              }}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Answer Review */}
        <Card>
          <CardHeader>
            <CardTitle>Answer Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testResult.answers.map((answer: any, idx: number) => {
                const isCorrect = answer.userAnswer === answer.correctAnswer;
                return (
                  <div 
                    key={idx}
                    className={`p-4 rounded-xl border-2 ${
                      isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                        <span className="font-medium">Question {idx + 1}</span>
                        <span className="text-xs px-2 py-1 bg-gray-200 rounded">{answer.questionType}</span>
                      </div>
                      <div className="text-sm">
                        {!isCorrect && (
                          <span className="text-red-600">Your answer: {answer.userAnswer}</span>
                        )}
                      </div>
                    </div>
                    {!isCorrect && (
                      <div className="mt-2 text-sm text-green-700">
                        Correct answer: {answer.correctAnswer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
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
          <p className="text-gray-600">Loading test...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-japanese-yellow via-japanese-pink to-japanese-purple rounded-2xl p-6 text-white shadow-xl"
      >
        <div className="flex items-center gap-4">
          <div className="text-5xl">📝</div>
          <div>
            <h1 className="text-3xl font-bold">Mock Tests</h1>
            <p className="opacity-90">Practice with JLPT-style tests</p>
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {mode === 'menu' && (
          <motion.div key="menu" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            {renderMenu()}
          </motion.div>
        )}
        {mode === 'custom' && !testData && (
          <motion.div key="custom-settings" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            {renderCustomSettings()}
          </motion.div>
        )}
        {(mode === 'quick' || mode === 'custom' || mode === 'full' || mode === 'adaptive') && testData && (
          <motion.div key="test" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            {renderTest()}
          </motion.div>
        )}
        {mode === 'result' && (
          <motion.div key="result" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            {renderResult()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
