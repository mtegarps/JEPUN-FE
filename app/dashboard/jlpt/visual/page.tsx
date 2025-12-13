'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { jlptFullAPI } from '@/lib/api/jlpt';
import { useSettingsStore } from '@/lib/store';
import toast from 'react-hot-toast';
import { 
  Image, 
  Smile, 
  Zap, 
  MapPin, 
  Search,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';

type QuizType = 'vocab' | 'emotion' | 'action' | 'scene' | 'spot-difference';

const VOCAB_CATEGORIES = [
  { id: 'food', label: '🍣 Food', icon: '🍣' },
  { id: 'animals', label: '🐱 Animals', icon: '🐱' },
  { id: 'daily_life', label: '🏠 Daily Life', icon: '🏠' },
  { id: 'transportation', label: '🚗 Transportation', icon: '🚗' },
  { id: 'body_parts', label: '👋 Body Parts', icon: '👋' },
];

const SCENARIOS = [
  { id: 'ordering food at a Japanese restaurant', label: '🍱 Restaurant', style: 'anime' },
  { id: 'asking for directions at a train station', label: '🚉 Train Station', style: 'anime' },
  { id: 'shopping at a convenience store in Japan', label: '🏪 Convenience Store', style: 'illustration' },
  { id: 'checking in at a Japanese hotel', label: '🏨 Hotel', style: 'realistic' },
];

const SPOT_SCENES = [
  { id: 'traditional Japanese room with tatami', label: '🏯 Japanese Room' },
  { id: 'Japanese kitchen with cooking utensils', label: '🍳 Kitchen' },
  { id: 'busy Tokyo street with shops and signs', label: '🌆 Tokyo Street' },
];

export default function VisualQuizzesPage() {
  const [quizType, setQuizType] = useState<QuizType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [quizData, setQuizData] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { level } = useSettingsStore();

  const handleStartVocabQuiz = async (category: string) => {
    setIsLoading(true);
    try {
      const response = await jlptFullAPI.visual.vocabQuiz({
        level: level as any,
        category: category as any,
        count: 5,
      });
      setQuizData(response.data);
      setCurrentQuestion(0);
      setScore(0);
      toast.success('Quiz loaded! 📸');
    } catch (error) {
      toast.error('Failed to load quiz');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartEmotionQuiz = async () => {
    setIsLoading(true);
    try {
      const response = await jlptFullAPI.visual.emotionQuiz({
        level: level as any,
        count: 5,
      });
      setQuizData(response.data);
      setCurrentQuestion(0);
      setScore(0);
      toast.success('Emotion Quiz loaded! 😊');
    } catch (error) {
      toast.error('Failed to load quiz');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartActionQuiz = async () => {
    setIsLoading(true);
    try {
      const response = await jlptFullAPI.visual.actionQuiz({
        level: level as any,
        count: 5,
      });
      setQuizData(response.data);
      setCurrentQuestion(0);
      setScore(0);
      toast.success('Action Quiz loaded! ⚡');
    } catch (error) {
      toast.error('Failed to load quiz');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartSceneQuestion = async (scenario: string, style: string) => {
    setIsLoading(true);
    try {
      const response = await jlptFullAPI.visual.sceneQuestion({
        level: level as any,
        scenario,
        imageStyle: style as any,
      });
      setQuizData(response.data);
      setCurrentQuestion(0);
      toast.success('Scene Question loaded! 🎬');
    } catch (error) {
      toast.error('Failed to load scene');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartSpotDifference = async (scene: string) => {
    setIsLoading(true);
    try {
      const response = await jlptFullAPI.visual.spotDifference({
        level: level as any,
        scene,
        differenceCount: level === 'N5' ? 5 : 7,
      });
      setQuizData(response.data);
      toast.success('Spot the Difference loaded! 🔍');
    } catch (error) {
      toast.error('Failed to load game');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    
    const questions = Array.isArray(quizData) ? quizData : 
                      (quizData?.questions || quizData?.items || quizData?.data || [quizData]);
    const current = questions[currentQuestion];
    
    // Check various possible field names for correct answer
    const correctAnswer = current?.correctAnswer || current?.correct || current?.answer || 
                          current?.rightAnswer;
    
    const isCorrect = answer === correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
      toast.success('正解！Correct! 🎉');
    } else {
      toast.error('残念！Try again! 💪');
    }
  };

  const handleNext = () => {
    const questions = Array.isArray(quizData) ? quizData : 
                      (quizData?.questions || quizData?.items || quizData?.data || [quizData]);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
      setShowResult(false);
    } else {
      toast.success(`Quiz completed! Score: ${score}/${questions.length}`);
    }
  };

  const handleBack = () => {
    setQuizType(null);
    setQuizData(null);
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setShowResult(false);
    setScore(0);
  };

  const renderQuizSelection = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Card hover className="cursor-pointer h-full" onClick={() => setQuizType('vocab')}>
          <CardContent className="text-center py-6 md:py-8">
            <Image className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 text-japanese-pink" />
            <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">Visual Vocabulary</h3>
            <p className="text-gray-600 text-sm md:text-base">Learn vocabulary with images</p>
            <div className="mt-3 md:mt-4 flex flex-wrap justify-center gap-2">
              {VOCAB_CATEGORIES.slice(0, 3).map(cat => (
                <span key={cat.id} className="text-xl md:text-2xl">{cat.icon}</span>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Card hover className="cursor-pointer h-full" onClick={() => setQuizType('emotion')}>
          <CardContent className="text-center py-6 md:py-8">
            <Smile className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 text-japanese-yellow" />
            <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">Emotion Quiz</h3>
            <p className="text-gray-600 text-sm md:text-base">Learn emotion vocabulary</p>
            <div className="mt-3 md:mt-4 flex justify-center gap-2">
              <span className="text-xl md:text-2xl">😊</span>
              <span className="text-xl md:text-2xl">😢</span>
              <span className="text-xl md:text-2xl">😠</span>
              <span className="text-xl md:text-2xl">😱</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Card hover className="cursor-pointer h-full" onClick={() => setQuizType('action')}>
          <CardContent className="text-center py-8">
            <Zap className="w-16 h-16 mx-auto mb-4 text-japanese-blue" />
            <h3 className="text-xl font-bold mb-2">Action Verb Quiz</h3>
            <p className="text-gray-600">Learn action verbs visually</p>
            <div className="mt-4 flex justify-center gap-2">
              <span className="text-2xl">🏃</span>
              <span className="text-2xl">🍽️</span>
              <span className="text-2xl">📖</span>
              <span className="text-2xl">💤</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Card hover className="cursor-pointer h-full" onClick={() => setQuizType('scene')}>
          <CardContent className="text-center py-8">
            <MapPin className="w-16 h-16 mx-auto mb-4 text-japanese-purple" />
            <h3 className="text-xl font-bold mb-2">Scene Questions</h3>
            <p className="text-gray-600">Practice real-life scenarios</p>
            <div className="mt-4 flex justify-center gap-2">
              <span className="text-2xl">🍱</span>
              <span className="text-2xl">🚉</span>
              <span className="text-2xl">🏨</span>
              <span className="text-2xl">🏪</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Card hover className="cursor-pointer h-full" onClick={() => setQuizType('spot-difference')}>
          <CardContent className="text-center py-8">
            <Search className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h3 className="text-xl font-bold mb-2">Spot the Difference</h3>
            <p className="text-gray-600">Find differences & learn vocab</p>
            <div className="mt-4 flex justify-center gap-2">
              <span className="text-2xl">🏯</span>
              <span className="text-2xl">🍳</span>
              <span className="text-2xl">🌆</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );

  const renderVocabCategories = () => (
    <div className="space-y-6">
      <Button variant="ghost" onClick={handleBack} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>
      
      <h2 className="text-2xl font-bold">Select Category</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {VOCAB_CATEGORIES.map(cat => (
          <motion.div 
            key={cat.id}
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
          >
            <Card 
              hover 
              className="cursor-pointer" 
              onClick={() => handleStartVocabQuiz(cat.id)}
            >
              <CardContent className="text-center py-6">
                <span className="text-4xl mb-2 block">{cat.icon}</span>
                <p className="font-medium">{cat.label.split(' ')[1]}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderScenarios = () => (
    <div className="space-y-6">
      <Button variant="ghost" onClick={handleBack} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>
      
      <h2 className="text-2xl font-bold">Select Scenario</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SCENARIOS.map(scenario => (
          <motion.div 
            key={scenario.id}
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              hover 
              className="cursor-pointer" 
              onClick={() => handleStartSceneQuestion(scenario.id, scenario.style)}
            >
              <CardContent className="py-6">
                <h3 className="text-xl font-bold mb-2">{scenario.label}</h3>
                <p className="text-gray-600 text-sm">{scenario.id}</p>
                <span className="inline-block mt-2 px-2 py-1 bg-japanese-pink/10 text-japanese-pink rounded text-xs">
                  {scenario.style}
                </span>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderSpotDifferenceScenes = () => (
    <div className="space-y-6">
      <Button variant="ghost" onClick={handleBack} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>
      
      <h2 className="text-2xl font-bold">Select Scene</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SPOT_SCENES.map(scene => (
          <motion.div 
            key={scene.id}
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              hover 
              className="cursor-pointer" 
              onClick={() => handleStartSpotDifference(scene.id)}
            >
              <CardContent className="text-center py-6">
                <h3 className="text-xl font-bold mb-2">{scene.label}</h3>
                <p className="text-gray-600 text-sm">{scene.id}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // Helper function to get image URL from various possible field names
  const getImageUrl = (item: any): string | null => {
    if (!item) return null;
    // Check various possible field names for image URL
    return item.imageUrl || item.imageURL || item.image || item.img || 
           item.picture || item.pictureUrl || item.photo || item.photoUrl ||
           item.imageSrc || item.src || null;
  };

  // Helper function to get questions array from various response formats
  const getQuestions = (data: any): any[] => {
    if (!data) return [];
    // If data is already an array, return it directly
    if (Array.isArray(data)) return data;
    // Check various possible property names
    if (Array.isArray(data.questions)) return data.questions;
    if (Array.isArray(data.items)) return data.items;
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.results)) return data.results;
    if (Array.isArray(data.quiz)) return data.quiz;
    // If it's a single question object, wrap it in array
    if (data.question || data.options) return [data];
    return [];
  };

  const renderQuiz = () => {
    if (!quizData) return null;

    const questions = getQuestions(quizData);
    
    if (questions.length === 0 && quizType !== 'spot-difference') {
      return (
        <div className="text-center py-12">
          <p className="text-gray-600">No questions available</p>
          <Button onClick={handleBack} className="mt-4">Back to Menu</Button>
        </div>
      );
    }
    
    const current = questions[currentQuestion] || {};
    
    // Get image URL - check current question
    const imageUrl = getImageUrl(current);
    
    // For spot difference, check both current question and quizData root level
    // Handle various naming conventions: image1, image1Url, imageA, etc.
    const image1 = current?.image1 || current?.image1Url || current?.imageA || current?.originalImage ||
                   quizData?.image1 || quizData?.image1Url || quizData?.imageA || quizData?.originalImage;
    const image2 = current?.image2 || current?.image2Url || current?.imageB || current?.modifiedImage ||
                   quizData?.image2 || quizData?.image2Url || quizData?.imageB || quizData?.modifiedImage;
    
    // Get differences for spot-difference quiz
    const differences = quizData?.differences || current?.differences || [];

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
            <CardTitle className="flex items-center justify-between">
              <span>{quizType === 'emotion' ? '😊 Emotion Quiz' : 
                     quizType === 'action' ? '⚡ Action Quiz' :
                     quizType === 'scene' ? '🎬 Scene Question' :
                     quizType === 'spot-difference' ? '🔍 Spot Difference' :
                     '📸 Visual Quiz'}</span>
              <span className="text-sm px-3 py-1 bg-japanese-pink text-white rounded-full">
                {level}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Single Image Display */}
            {imageUrl && (
              <div className="rounded-xl overflow-hidden bg-gray-100">
                <img 
                  src={imageUrl} 
                  alt="Quiz" 
                  className="w-full h-64 md:h-80 object-contain bg-white"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            )}
            
            {/* Spot Difference - Two Images Side by Side */}
            {(image1 || image2) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {image1 && (
                  <div className="rounded-xl overflow-hidden bg-gray-100">
                    <p className="text-center text-sm font-medium py-2 bg-gray-200">Image A</p>
                    <img 
                      src={image1} 
                      alt="Image A" 
                      className="w-full h-48 md:h-64 object-contain bg-white"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                {image2 && (
                  <div className="rounded-xl overflow-hidden bg-gray-100">
                    <p className="text-center text-sm font-medium py-2 bg-gray-200">Image B</p>
                    <img 
                      src={image2} 
                      alt="Image B" 
                      className="w-full h-48 md:h-64 object-contain bg-white"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            )}
            
            {/* Differences List for Spot Difference */}
            {differences.length > 0 && (
              <div className="bg-yellow-50 rounded-xl p-4">
                <h4 className="font-bold mb-3 flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Differences to Find ({differences.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {differences.map((diff: any, idx: number) => (
                    <div key={idx} className="bg-white rounded-lg p-3 border border-yellow-200">
                      <div className="flex items-start gap-2">
                        <span className="bg-yellow-400 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="text-sm font-medium">{diff.description}</p>
                          {diff.descriptionJapanese && (
                            <p className="text-xs text-japanese-pink mt-1">{diff.descriptionJapanese}</p>
                          )}
                          {diff.hint && (
                            <p className="text-xs text-gray-500 mt-1">💡 {diff.hint}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Base64 Image Support */}
            {(current?.imageBase64 || current?.base64 || quizData?.imageBase64) && (
              <div className="rounded-xl overflow-hidden bg-gray-100">
                <img 
                  src={`data:image/png;base64,${current?.imageBase64 || current?.base64 || quizData?.imageBase64}`}
                  alt="Quiz" 
                  className="w-full h-64 md:h-80 object-contain bg-white"
                />
              </div>
            )}

            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-lg font-medium">{current?.question || current?.prompt || current?.text}</p>
              {(current?.questionJapanese || current?.japanese || current?.japaneseText) && (
                <p className="text-2xl mt-2 text-japanese-pink">{current.questionJapanese || current.japanese || current.japaneseText}</p>
              )}
              {current?.visualContext && (
                <p className="text-sm mt-2 text-gray-500">Context: {current.visualContext}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(current?.options || current?.choices || current?.answers)?.map((option: any, idx: number) => {
                const optionValue = typeof option === 'string' ? option : (option.text || option.value || option.answer);
                const optionImage = typeof option === 'object' ? getImageUrl(option) : null;
                const isSelected = selectedAnswer === optionValue;
                const isCorrect = optionValue === (current?.correctAnswer || current?.answer || current?.correct);
                
                return (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: showResult ? 1 : 1.02 }}
                    whileTap={{ scale: showResult ? 1 : 0.98 }}
                    onClick={() => !showResult && handleAnswer(optionValue)}
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
                    {/* Option with image */}
                    {optionImage && (
                      <div className="mb-3 rounded-lg overflow-hidden">
                        <img 
                          src={optionImage} 
                          alt={`Option ${String.fromCharCode(65 + idx)}`}
                          className="w-full h-24 object-contain bg-gray-50"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0 ${
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
                      <span className="font-medium">{optionValue}</span>
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
                {current?.explanation && (
                  <div className="bg-blue-50 rounded-xl p-4">
                    <h4 className="font-bold mb-2">💡 Explanation</h4>
                    <p className="text-sm">{current.explanation}</p>
                  </div>
                )}

                {current?.vocabulary && (
                  <div className="bg-purple-50 rounded-xl p-4">
                    <h4 className="font-bold mb-2">📚 Vocabulary</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {current.vocabulary.map((vocab: any, idx: number) => (
                        <div key={idx} className="text-sm">
                          <span className="font-medium">{vocab.word}</span>
                          <span className="text-gray-500"> - {vocab.meaning}</span>
                        </div>
                      ))}
                    </div>
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-japanese-pink" />
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-japanese-pink via-japanese-purple to-japanese-blue rounded-xl md:rounded-2xl p-4 md:p-6 text-white shadow-xl"
      >
        <div className="flex items-center gap-3 md:gap-4">
          <div className="text-3xl md:text-5xl">🎨</div>
          <div>
            <h1 className="text-xl md:text-3xl font-bold">Visual Quizzes</h1>
            <p className="opacity-90 text-xs md:text-base">Learn Japanese with images and interactive content</p>
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {quizData ? (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {renderQuiz()}
          </motion.div>
        ) : quizType === 'vocab' ? (
          <motion.div
            key="vocab"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {renderVocabCategories()}
          </motion.div>
        ) : quizType === 'emotion' ? (
          <motion.div
            key="emotion-start"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <Button variant="ghost" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <Card>
              <CardContent className="text-center py-12">
                <Smile className="w-20 h-20 mx-auto mb-4 text-japanese-yellow" />
                <h2 className="text-2xl font-bold mb-4">Emotion Quiz</h2>
                <p className="text-gray-600 mb-6">Learn to express emotions in Japanese!</p>
                <Button onClick={handleStartEmotionQuiz} size="lg">
                  Start Quiz 😊
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : quizType === 'action' ? (
          <motion.div
            key="action-start"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <Button variant="ghost" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <Card>
              <CardContent className="text-center py-12">
                <Zap className="w-20 h-20 mx-auto mb-4 text-japanese-blue" />
                <h2 className="text-2xl font-bold mb-4">Action Verb Quiz</h2>
                <p className="text-gray-600 mb-6">Master action verbs with visual learning!</p>
                <Button onClick={handleStartActionQuiz} size="lg">
                  Start Quiz ⚡
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : quizType === 'scene' ? (
          <motion.div
            key="scene"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {renderScenarios()}
          </motion.div>
        ) : quizType === 'spot-difference' ? (
          <motion.div
            key="spot"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {renderSpotDifferenceScenes()}
          </motion.div>
        ) : (
          <motion.div
            key="selection"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {renderQuizSelection()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
