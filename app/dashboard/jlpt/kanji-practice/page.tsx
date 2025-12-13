'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { jlptFullAPI } from '@/lib/api/jlpt';
import { useSettingsStore } from '@/lib/store';
import toast from 'react-hot-toast';
import { 
  BookOpen, 
  Brain, 
  Search,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Loader2,
  Lightbulb,
  PenTool
} from 'lucide-react';

const SAMPLE_KANJI = [
  { kanji: '日', hint: 'sun rising over horizon', meaning: 'Sun/Day' },
  { kanji: '山', hint: '', meaning: 'Mountain' },
  { kanji: '水', hint: 'water splashing', meaning: 'Water' },
  { kanji: '火', hint: '', meaning: 'Fire' },
  { kanji: '人', hint: 'person walking with two legs', meaning: 'Person' },
  { kanji: '木', hint: '', meaning: 'Tree' },
  { kanji: '月', hint: '', meaning: 'Moon/Month' },
  { kanji: '金', hint: '', meaning: 'Gold/Money' },
];

export default function KanjiPracticePage() {
  const [mode, setMode] = useState<'menu' | 'mnemonic' | 'quiz'>('menu');
  const [isLoading, setIsLoading] = useState(false);
  const [kanjiInput, setKanjiInput] = useState('');
  const [customHint, setCustomHint] = useState('');
  const [mnemonicData, setMnemonicData] = useState<any>(null);
  const [quizData, setQuizData] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [withMnemonics, setWithMnemonics] = useState(true);
  const [quizType, setQuizType] = useState<'kanji_meaning' | 'kanji_reading'>('kanji_meaning');
  const { level } = useSettingsStore();

  const handleGetMnemonic = async (kanji?: string, hint?: string) => {
    const targetKanji = kanji || kanjiInput;
    if (!targetKanji) {
      toast.error('Please enter a kanji character');
      return;
    }

    setIsLoading(true);
    try {
      const response = await jlptFullAPI.kanji.mnemonic({
        kanji: targetKanji,
        customHint: hint || customHint || undefined,
      });
      setMnemonicData(response.data);
      setKanjiInput(targetKanji);
      toast.success('Mnemonic generated! 🧠');
    } catch (error) {
      toast.error('Failed to generate mnemonic');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartQuiz = async () => {
    setIsLoading(true);
    try {
      const response = await jlptFullAPI.kanji.quiz({
        level: level as any,
        count: 5,
        withMnemonics,
        type: quizType,
      });
      setQuizData(response.data);
      setCurrentQuestion(0);
      setScore(0);
      setShowResult(false);
      setSelectedAnswer('');
      toast.success('Quiz loaded! 📝');
    } catch (error) {
      toast.error('Failed to load quiz');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    
    const current = quizData?.questions?.[currentQuestion];
    const isCorrect = answer === current?.correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
      toast.success('正解！Correct! 🎉');
    } else {
      toast.error('残念！Try again! 💪');
    }
  };

  const handleNext = () => {
    // Handle both array directly or nested in questions property
    const questions = Array.isArray(quizData) ? quizData : (quizData?.questions || []);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
      setShowResult(false);
    } else {
      toast.success(`Quiz completed! Score: ${score}/${questions.length}`);
    }
  };

  const handleBack = () => {
    setMode('menu');
    setMnemonicData(null);
    setQuizData(null);
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setShowResult(false);
    setScore(0);
    setKanjiInput('');
    setCustomHint('');
  };

  const renderMenu = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Card hover className="cursor-pointer h-full" onClick={() => setMode('mnemonic')}>
          <CardContent className="text-center py-12">
            <Brain className="w-20 h-20 mx-auto mb-4 text-japanese-purple" />
            <h3 className="text-2xl font-bold mb-2">Kanji Mnemonics</h3>
            <p className="text-gray-600 mb-4">Generate memory aids for kanji</p>
            <div className="flex flex-wrap justify-center gap-2">
              {SAMPLE_KANJI.slice(0, 5).map(k => (
                <span key={k.kanji} className="text-2xl bg-gray-100 px-2 py-1 rounded">
                  {k.kanji}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Card hover className="cursor-pointer h-full" onClick={() => setMode('quiz')}>
          <CardContent className="text-center py-12">
            <PenTool className="w-20 h-20 mx-auto mb-4 text-japanese-pink" />
            <h3 className="text-2xl font-bold mb-2">Kanji Quiz</h3>
            <p className="text-gray-600 mb-4">Test your kanji knowledge</p>
            <div className="flex justify-center gap-4">
              <div className="text-center">
                <div className="text-3xl mb-1">📖</div>
                <span className="text-xs text-gray-500">Meaning</span>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-1">🔊</div>
                <span className="text-xs text-gray-500">Reading</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );

  const renderMnemonicMode = () => (
    <div className="space-y-6">
      <Button variant="ghost" onClick={handleBack}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-japanese-purple" />
            Kanji Mnemonic Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Kanji Character</label>
              <Input
                value={kanjiInput}
                onChange={(e) => setKanjiInput(e.target.value)}
                placeholder="Enter kanji (e.g. 日)"
                className="text-center text-2xl h-16"
                maxLength={1}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Custom Hint (Optional)</label>
              <Input
                value={customHint}
                onChange={(e) => setCustomHint(e.target.value)}
                placeholder="e.g. sun rising over horizon"
              />
            </div>
          </div>

          <Button 
            onClick={() => handleGetMnemonic()} 
            disabled={isLoading || !kanjiInput}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Lightbulb className="w-4 h-4 mr-2" />
                Generate Mnemonic
              </>
            )}
          </Button>

          <div className="border-t pt-6">
            <h4 className="font-medium mb-4">Quick Access - Common Kanji</h4>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_KANJI.map(k => (
                <motion.button
                  key={k.kanji}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleGetMnemonic(k.kanji, k.hint)}
                  disabled={isLoading}
                  className="w-12 h-12 bg-gray-100 hover:bg-japanese-pink/10 rounded-lg text-2xl font-bold transition-colors"
                  title={k.meaning}
                >
                  {k.kanji}
                </motion.button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {mnemonicData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-6xl">{mnemonicData.kanji || kanjiInput}</CardTitle>
                  <span className="px-3 py-1 bg-japanese-purple text-white rounded-full text-sm">
                    {mnemonicData.jlptLevel || level}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {mnemonicData.meaning && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-bold text-sm text-gray-500 mb-1">Meaning</h4>
                    <p className="text-xl">{mnemonicData.meaning}</p>
                  </div>
                )}

                {mnemonicData.readings && (
                  <div className="grid grid-cols-2 gap-4">
                    {mnemonicData.readings.onyomi && (
                      <div className="bg-blue-50 rounded-xl p-4">
                        <h4 className="font-bold text-sm text-blue-600 mb-1">On'yomi (音読み)</h4>
                        <p className="text-lg">{mnemonicData.readings.onyomi}</p>
                      </div>
                    )}
                    {mnemonicData.readings.kunyomi && (
                      <div className="bg-green-50 rounded-xl p-4">
                        <h4 className="font-bold text-sm text-green-600 mb-1">Kun'yomi (訓読み)</h4>
                        <p className="text-lg">{mnemonicData.readings.kunyomi}</p>
                      </div>
                    )}
                  </div>
                )}

                {mnemonicData.mnemonic && (
                  <div className="bg-purple-50 rounded-xl p-6">
                    <h4 className="font-bold text-purple-700 mb-2 flex items-center gap-2">
                      <Brain className="w-5 h-5" />
                      Memory Aid
                    </h4>
                    <p className="text-lg leading-relaxed">{mnemonicData.mnemonic}</p>
                  </div>
                )}

                {mnemonicData.visualDescription && (
                  <div className="bg-yellow-50 rounded-xl p-4">
                    <h4 className="font-bold text-yellow-700 mb-2">Visual Description</h4>
                    <p>{mnemonicData.visualDescription}</p>
                  </div>
                )}

                {mnemonicData.exampleWords && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-bold mb-3">Example Words</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {mnemonicData.exampleWords.map((word: any, idx: number) => (
                        <div key={idx} className="bg-white rounded-lg p-3 border">
                          <span className="text-xl font-bold text-japanese-pink">{word.word}</span>
                          <span className="text-gray-500 ml-2">({word.reading})</span>
                          <p className="text-sm text-gray-600 mt-1">{word.meaning}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {mnemonicData.strokeOrder && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-bold mb-2">Stroke Order</h4>
                    <p className="text-sm text-gray-600">{mnemonicData.strokeOrder}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderQuizMode = () => {
    if (!quizData) {
      return (
        <div className="space-y-6">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PenTool className="w-6 h-6 text-japanese-pink" />
                Kanji Quiz Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3">Quiz Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setQuizType('kanji_meaning')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      quizType === 'kanji_meaning'
                        ? 'border-japanese-pink bg-japanese-pink/10'
                        : 'border-gray-200 hover:border-japanese-pink/50'
                    }`}
                  >
                    <div className="text-3xl mb-2">📖</div>
                    <div className="font-bold">Kanji → Meaning</div>
                    <p className="text-xs text-gray-500 mt-1">See kanji, choose meaning</p>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setQuizType('kanji_reading')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      quizType === 'kanji_reading'
                        ? 'border-japanese-pink bg-japanese-pink/10'
                        : 'border-gray-200 hover:border-japanese-pink/50'
                    }`}
                  >
                    <div className="text-3xl mb-2">🔊</div>
                    <div className="font-bold">Kanji → Reading</div>
                    <p className="text-xs text-gray-500 mt-1">See kanji, choose reading</p>
                  </motion.button>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={withMnemonics}
                    onChange={(e) => setWithMnemonics(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-japanese-pink focus:ring-japanese-pink"
                  />
                  <div>
                    <span className="font-medium">Include Mnemonics</span>
                    <p className="text-xs text-gray-500">Show memory aids after answering</p>
                  </div>
                </label>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">JLPT Level</span>
                  <span className="font-bold text-japanese-pink">{level}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-600">Questions</span>
                  <span className="font-bold">5</span>
                </div>
              </div>

              <Button onClick={handleStartQuiz} disabled={isLoading} className="w-full" size="lg">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading Quiz...
                  </>
                ) : (
                  'Start Quiz 🎯'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

  const questions = Array.isArray(quizData) ? quizData : (quizData.questions || []);
  const current = questions[currentQuestion];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <div className="text-sm font-medium">
            Question {currentQuestion + 1} / {questions.length} | Score: {score}
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {quizType === 'kanji_meaning' ? '📖 Meaning Quiz' : '🔊 Reading Quiz'}
              </CardTitle>
              <span className="px-3 py-1 bg-japanese-pink text-white rounded-full text-sm">
                {level}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              {current?.imageUrl && (
                <div className="mb-6">
                  <img 
                    src={current.imageUrl} 
                    alt={`Kanji ${current.kanji || current.mnemonic?.kanji}`}
                    className="w-full max-w-md mx-auto rounded-lg shadow-md"
                  />
                </div>
              )}
              <span className="text-8xl font-bold">{current?.kanji || current?.mnemonic?.kanji}</span>
              <p className="text-gray-500 mt-4">{current?.question || current?.prompt || 'Choose the correct answer'}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
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
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
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

          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {withMnemonics && (current?.mnemonic?.mnemonic || current?.explanation) && (
                <div className="bg-purple-50 rounded-xl p-4">
                  <h4 className="font-bold text-purple-700 mb-2 flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Memory Aid
                  </h4>
                  <p className="leading-relaxed">{current?.mnemonic?.mnemonic || current?.explanation}</p>
                </div>
              )}

              {withMnemonics && current?.mnemonic?.examples && current.mnemonic.examples.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-bold mb-3">Example Words</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {current.mnemonic.examples.map((word: any, idx: number) => (
                      <div key={idx} className="bg-white rounded-lg p-3 border text-left">
                        <span className="text-lg font-bold text-japanese-pink">{word.word}</span>
                        <span className="text-gray-500 ml-2">({word.reading})</span>
                        <p className="text-sm text-gray-600 mt-1">{word.meaning}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {current?.mnemonic?.readings && (
                <div className="grid grid-cols-2 gap-3">
                  {current.mnemonic.readings.onyomi && current.mnemonic.readings.onyomi.length > 0 && (
                    <div className="bg-blue-50 rounded-xl p-3">
                      <h4 className="font-bold text-sm text-blue-600 mb-1">On'yomi</h4>
                      <p className="text-lg">{current.mnemonic.readings.onyomi.join(', ')}</p>
                    </div>
                  )}
                  {current.mnemonic.readings.kunyomi && current.mnemonic.readings.kunyomi.length > 0 && (
                    <div className="bg-green-50 rounded-xl p-3">
                      <h4 className="font-bold text-sm text-green-600 mb-1">Kun'yomi</h4>
                      <p className="text-lg">{current.mnemonic.readings.kunyomi.join(', ')}</p>
                    </div>
                  )}
                </div>
              )}

              <Button onClick={handleNext} className="w-full">
                {currentQuestion < questions.length - 1 ? 'Next Question →' : 'Finish Quiz 🎉'}
              </Button>
            </motion.div>
          )}
          </CardContent>
        </Card>
      </div>
    );
  };

  if (isLoading && mode === 'menu') {
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
        className="bg-gradient-to-r from-japanese-purple via-japanese-pink to-japanese-blue rounded-2xl p-6 text-white shadow-xl"
      >
        <div className="flex items-center gap-4">
          <div className="text-5xl">漢字</div>
          <div>
            <h1 className="text-3xl font-bold">Kanji Practice</h1>
            <p className="opacity-90">Learn kanji with mnemonics and quizzes</p>
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {mode === 'menu' && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {renderMenu()}
          </motion.div>
        )}
        {mode === 'mnemonic' && (
          <motion.div
            key="mnemonic"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {renderMnemonicMode()}
          </motion.div>
        )}
        {mode === 'quiz' && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {renderQuizMode()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
