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
  ChevronRight,
  ChevronLeft,
  Volume2
} from 'lucide-react';

type Mode = 'menu' | 'manga' | 'reading' | 'cultural';

const MANGA_THEMES = [
  { id: 'daily life at home', label: '🏠 Daily Life', description: 'Everyday activities at home' },
  { id: 'school life', label: '🎒 School Life', description: 'Life in Japanese school' },
  { id: 'shopping adventure in Tokyo', label: '🛍️ Shopping', description: 'Shopping in Tokyo' },
  { id: 'making new friends', label: '👫 Friendship', description: 'Making new friends' },
];

const READING_TOPICS = [
  { id: 'my family', label: '👨‍👩‍👧 My Family', length: 'short' },
  { id: 'Japanese food culture', label: '🍜 Food Culture', length: 'medium' },
  { id: 'traveling in Japan', label: '✈️ Travel', length: 'long' },
  { id: 'Japanese seasons', label: '🌸 Seasons', length: 'medium' },
  { id: 'daily routine', label: '⏰ Daily Routine', length: 'short' },
];

const CULTURAL_TOPICS = [
  { id: 'tea ceremony', label: '🍵 Tea Ceremony', icon: '🍵' },
  { id: 'Japanese festivals', label: '🎆 Festivals', icon: '🎆' },
  { id: 'hot springs and onsen etiquette', label: '♨️ Onsen', icon: '♨️' },
  { id: 'kimono and traditional clothing', label: '👘 Kimono', icon: '👘' },
];

export default function MangaReadingPage() {
  const [mode, setMode] = useState<Mode>('menu');
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState<any>(null);
  const [currentPanel, setCurrentPanel] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showExplanations, setShowExplanations] = useState<Record<string, boolean>>({});
  const { level } = useSettingsStore();

  const handleGenerateManga = async (theme: string) => {
    setIsLoading(true);
    try {
      const response = await jlptFullAPI.manga.story({
        level: level as any,
        theme,
        panelCount: level === 'N5' ? 4 : 6,
      });
      setContent(response.data);
      setCurrentPanel(0);
      setMode('manga');
      toast.success('Manga story loaded! 📖');
    } catch (error) {
      toast.error('Failed to load manga');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReading = async (topic: string, length: string) => {
    setIsLoading(true);
    try {
      const response = await jlptFullAPI.reading.passage({
        level: level as any,
        topic,
        length: length as any,
      });
      setContent(response.data);
      setMode('reading');
      setAnswers({});
      setShowExplanations({});
      toast.success('Reading passage loaded! 📚');
    } catch (error) {
      toast.error('Failed to load reading');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateCultural = async (topic: string) => {
    setIsLoading(true);
    try {
      const response = await jlptFullAPI.reading.cultural({
        topic,
        level: level as any,
      });
      setContent(response.data);
      setMode('cultural');
      toast.success('Cultural lesson loaded! 🏯');
    } catch (error) {
      toast.error('Failed to load cultural lesson');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setMode('menu');
    setContent(null);
    setCurrentPanel(0);
    setAnswers({});
    setShowExplanations({});
  };

  const handleAnswerSelect = (questionId: string, selectedAnswer: string, correctAnswer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: selectedAnswer }));
    setShowExplanations(prev => ({ ...prev, [questionId]: true }));
    
    if (selectedAnswer === correctAnswer) {
      toast.success('正解！ Correct! 🎉');
    } else {
      toast.error('残念... Try again!');
    }
  };

  const renderMenu = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span className="text-3xl">📚</span> Manga Stories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {MANGA_THEMES.map(theme => (
            <motion.div key={theme.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card hover className="cursor-pointer h-full" onClick={() => handleGenerateManga(theme.id)}>
                <CardContent className="py-6">
                  <h3 className="text-xl font-bold mb-2">{theme.label}</h3>
                  <p className="text-sm text-gray-600">{theme.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span className="text-3xl">📖</span> Reading Passages
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {READING_TOPICS.map(topic => (
            <motion.div key={topic.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card hover className="cursor-pointer" onClick={() => handleGenerateReading(topic.id, topic.length)}>
                <CardContent className="py-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold">{topic.label}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      topic.length === 'short' ? 'bg-green-100 text-green-700' :
                      topic.length === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {topic.length}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span className="text-3xl">🏯</span> Cultural Lessons
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {CULTURAL_TOPICS.map(topic => (
            <motion.div key={topic.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card hover className="cursor-pointer h-full" onClick={() => handleGenerateCultural(topic.id)}>
                <CardContent className="text-center py-8">
                  <span className="text-5xl mb-4 block">{topic.icon}</span>
                  <h3 className="font-bold">{topic.label}</h3>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderManga = () => {
    if (!content) return null;
    const panels = content.panels || [];
    const currentPanelData = panels[currentPanel];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <div className="text-sm font-medium">Panel {currentPanel + 1} / {panels.length}</div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>📚 {content.title || 'Manga Story'}</span>
              <span className="text-sm px-3 py-1 bg-japanese-pink text-white rounded-full">{level}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-100 rounded-2xl overflow-hidden">
              {currentPanelData?.imageUrl && (
                <img src={currentPanelData.imageUrl} alt={`Panel ${currentPanel + 1}`} className="w-full h-64 md:h-96 object-cover" />
              )}
              <div className="p-6 bg-white border-t-4 border-black">
                <div className="bg-yellow-50 rounded-xl p-4 mb-4 border-2 border-black relative">
                  <div className="absolute -top-3 left-4 bg-yellow-50 px-2 text-xs font-bold">DIALOGUE</div>
                  <p className="text-2xl font-bold text-center">{currentPanelData?.japanese || currentPanelData?.dialogue}</p>
                </div>
                {currentPanelData?.romaji && <p className="text-center text-gray-500 mb-2">{currentPanelData.romaji}</p>}
                <p className="text-center text-gray-700">{currentPanelData?.english || currentPanelData?.translation}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={() => setCurrentPanel(Math.max(0, currentPanel - 1))} disabled={currentPanel === 0}>
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>
              <div className="flex gap-2">
                {panels.map((_: any, idx: number) => (
                  <button key={idx} onClick={() => setCurrentPanel(idx)} className={`w-3 h-3 rounded-full transition-colors ${idx === currentPanel ? 'bg-japanese-pink' : 'bg-gray-300'}`} />
                ))}
              </div>
              <Button variant="outline" onClick={() => setCurrentPanel(Math.min(panels.length - 1, currentPanel + 1))} disabled={currentPanel === panels.length - 1}>
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            {currentPanelData?.vocabulary && (
              <div className="bg-blue-50 rounded-xl p-4">
                <h4 className="font-bold mb-3">📚 Vocabulary</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {currentPanelData.vocabulary.map((vocab: any, idx: number) => (
                    <div key={idx} className="bg-white rounded-lg p-2 text-sm">
                      <span className="font-bold text-japanese-pink">{vocab.word}</span>
                      <span className="text-gray-500 ml-1">- {vocab.meaning}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderReading = () => {
    if (!content) return null;

    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>📖 {content.topic || 'Reading Passage'}</CardTitle>
              <span className="text-sm px-3 py-1 bg-japanese-pink text-white rounded-full">{level}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Image Section */}
            {content.imageUrl && (
              <div className="bg-gray-100 rounded-xl overflow-hidden">
                <img 
                  src={content.imageUrl} 
                  alt={content.topic || 'Reading passage illustration'} 
                  className="w-full h-64 md:h-96 object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}

            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold">Japanese Text</h4>
                <Button variant="ghost" size="sm"><Volume2 className="w-4 h-4 mr-1" /> Listen</Button>
              </div>
              <p className="text-xl leading-relaxed whitespace-pre-wrap">{content.passage || content.japanese || content.text}</p>
            </div>

            {content.vocabularyHelp && (
              <div className="bg-yellow-50 rounded-xl p-6">
                <h4 className="font-bold mb-4">📚 Key Vocabulary</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {content.vocabularyHelp.map((vocab: any, idx: number) => (
                    <div key={idx} className="bg-white rounded-lg p-3 border">
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-japanese-pink">{vocab.word}</span>
                        <span className="text-gray-500 text-sm">{vocab.reading}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{vocab.meaning}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {content.questions && (
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-bold mb-4">❓ Comprehension Questions</h4>
                <div className="space-y-4">
                  {content.questions.map((q: any, idx: number) => {
                    const isAnswered = showExplanations[q.id];
                    const selectedAnswer = answers[q.id];
                    const isCorrect = selectedAnswer === q.correctAnswer;

                    return (
                      <div key={idx} className="bg-white rounded-lg p-4 border">
                        <p className="font-medium mb-3">{idx + 1}. {q.question}</p>
                        {q.options && (
                          <div className="grid grid-cols-1 gap-2 mt-2">
                            {q.options.map((opt: string, optIdx: number) => {
                              const isSelected = selectedAnswer === opt;
                              const isCorrectOption = opt === q.correctAnswer;
                              
                              let buttonClass = "p-3 text-sm rounded border transition-all text-left ";
                              
                              if (isAnswered) {
                                if (isSelected && isCorrect) {
                                  buttonClass += "border-green-500 bg-green-50 text-green-900";
                                } else if (isSelected && !isCorrect) {
                                  buttonClass += "border-red-500 bg-red-50 text-red-900";
                                } else if (isCorrectOption) {
                                  buttonClass += "border-green-500 bg-green-50 text-green-900";
                                } else {
                                  buttonClass += "border-gray-200 bg-gray-50 text-gray-500";
                                }
                              } else {
                                buttonClass += "border-gray-300 hover:border-japanese-pink hover:bg-japanese-pink/10 cursor-pointer";
                              }

                              return (
                                <button 
                                  key={optIdx} 
                                  className={buttonClass}
                                  onClick={() => !isAnswered && handleAnswerSelect(q.id, opt, q.correctAnswer)}
                                  disabled={isAnswered}
                                >
                                  <span className="font-medium">{String.fromCharCode(65 + optIdx)}.</span> {opt}
                                  {isAnswered && isCorrectOption && (
                                    <span className="ml-2 text-green-600">✓</span>
                                  )}
                                  {isAnswered && isSelected && !isCorrect && (
                                    <span className="ml-2 text-red-600">✗</span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                        {isAnswered && q.explanation && (
                          <div className={`mt-3 p-3 rounded text-sm ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'}`}>
                            <span className="font-medium">💡 Explanation: </span>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderCultural = () => {
    if (!content) return null;

    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>🏯 {content.title || 'Cultural Lesson'}</CardTitle>
              <span className="text-sm px-3 py-1 bg-japanese-purple text-white rounded-full">{level}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {content.introduction && (
              <div className="bg-gradient-to-r from-japanese-pink/10 to-japanese-purple/10 rounded-xl p-6">
                <p className="text-lg leading-relaxed">{content.introduction}</p>
              </div>
            )}

            {content.japanese && (
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold">🇯🇵 Japanese</h4>
                  <Button variant="ghost" size="sm"><Volume2 className="w-4 h-4 mr-1" /> Listen</Button>
                </div>
                <p className="text-xl leading-relaxed whitespace-pre-wrap">{content.japanese}</p>
              </div>
            )}

            <div className="bg-blue-50 rounded-xl p-6">
              <h4 className="font-bold mb-4">📖 Explanation</h4>
              <p className="text-lg leading-relaxed whitespace-pre-wrap">{content.english || content.explanation}</p>
            </div>

            {content.vocabulary && (
              <div className="bg-yellow-50 rounded-xl p-6">
                <h4 className="font-bold mb-4">📚 Cultural Vocabulary</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {content.vocabulary.map((vocab: any, idx: number) => (
                    <div key={idx} className="bg-white rounded-lg p-3 border">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-japanese-pink">{vocab.word}</span>
                        {vocab.reading && <span className="text-gray-500 text-sm">({vocab.reading})</span>}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{vocab.meaning}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {content.tips && (
              <div className="bg-green-50 rounded-xl p-6">
                <h4 className="font-bold mb-4">💡 Cultural Tips</h4>
                <ul className="space-y-2">
                  {content.tips.map((tip: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>{tip}</span>
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
          <p className="text-gray-600">Loading content...</p>
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
        <div className="flex items-center gap-4">
          <div className="text-5xl">📚</div>
          <div>
            <h1 className="text-3xl font-bold">Manga & Reading</h1>
            <p className="opacity-90">Learn Japanese through stories and cultural content</p>
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {mode === 'menu' && (
          <motion.div key="menu" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            {renderMenu()}
          </motion.div>
        )}
        {mode === 'manga' && (
          <motion.div key="manga" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            {renderManga()}
          </motion.div>
        )}
        {mode === 'reading' && (
          <motion.div key="reading" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            {renderReading()}
          </motion.div>
        )}
        {mode === 'cultural' && (
          <motion.div key="cultural" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            {renderCultural()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}