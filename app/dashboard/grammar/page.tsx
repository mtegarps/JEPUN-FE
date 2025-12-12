'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input, TextArea } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { grammarAPI } from '@/lib/api/client';
import { useSettingsStore } from '@/lib/store';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, BookOpen, GitCompare, Lightbulb } from 'lucide-react';

type TabType = 'check' | 'explain' | 'compare' | 'suggest';

export default function GrammarPage() {
  const [activeTab, setActiveTab] = useState<TabType>('check');
  const [isLoading, setIsLoading] = useState(false);
  const { level } = useSettingsStore();

  // Check Grammar State
  const [sentence, setSentence] = useState('');
  const [checkResult, setCheckResult] = useState<any>(null);

  // Explain Grammar State
  const [pattern, setPattern] = useState('');
  const [explanation, setExplanation] = useState<any>(null);

  // Compare Grammar State
  const [sentence1, setSentence1] = useState('');
  const [sentence2, setSentence2] = useState('');
  const [comparison, setComparison] = useState<any>(null);

  // Suggest State
  const [suggestSentence, setSuggestSentence] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleCheckGrammar = async () => {
    if (!sentence.trim()) return;
    setIsLoading(true);
    try {
      const response = await grammarAPI.check({ sentence, userLevel: level });
      setCheckResult(response.data);
      toast.success('Grammar checked! ✅');
    } catch (error) {
      toast.error('Failed to check grammar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExplain = async () => {
    if (!pattern.trim()) return;
    setIsLoading(true);
    try {
      const response = await grammarAPI.explain({ pattern, level });
      setExplanation(response.data);
      toast.success('Explanation ready! 📚');
    } catch (error) {
      toast.error('Failed to explain grammar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompare = async () => {
    if (!sentence1.trim() || !sentence2.trim()) return;
    setIsLoading(true);
    try {
      const response = await grammarAPI.compare({ 
        sentence1, 
        sentence2, 
        userLevel: level 
      });
      setComparison(response.data);
      toast.success('Comparison ready! 🔍');
    } catch (error) {
      toast.error('Failed to compare sentences');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggest = async () => {
    if (!suggestSentence.trim()) return;
    setIsLoading(true);
    try {
      const response = await grammarAPI.suggest({ 
        sentence: suggestSentence, 
        userLevel: level 
      });
      setSuggestions(response.data);
      toast.success('Suggestions generated! 💡');
    } catch (error) {
      toast.error('Failed to generate suggestions');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'check' as TabType, label: 'Check Grammar', icon: CheckCircle },
    { id: 'explain' as TabType, label: 'Explain Pattern', icon: BookOpen },
    { id: 'compare' as TabType, label: 'Compare Sentences', icon: GitCompare },
    { id: 'suggest' as TabType, label: 'Get Suggestions', icon: Lightbulb },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-japanese-blue via-japanese-green to-japanese-purple rounded-2xl p-6 text-white shadow-xl"
      >
        <div className="flex items-center gap-4">
          <div className="text-5xl">📚</div>
          <div>
            <h1 className="text-3xl font-bold">Grammar Checker</h1>
            <p className="opacity-90">Check, explain, and improve your Japanese grammar</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'primary' : 'outline'}
            onClick={() => setActiveTab(tab.id)}
            className="whitespace-nowrap"
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Check Grammar Tab */}
      {activeTab === 'check' && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <Card>
            <CardHeader>
              <CardTitle>Check Your Sentence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <TextArea
                label="Japanese Sentence"
                placeholder="Enter your Japanese sentence..."
                value={sentence}
                onChange={(e) => setSentence(e.target.value)}
                rows={3}
              />
              <Button onClick={handleCheckGrammar} isLoading={isLoading}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Check Grammar
              </Button>
            </CardContent>
          </Card>

          {checkResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    {checkResult.isCorrect ? (
                      <>
                        <CheckCircle className="w-8 h-8 text-green-500" />
                        <div>
                          <h3 className="text-xl font-bold text-green-600">Correct! ✨</h3>
                          <p className="text-gray-600">Your grammar is perfect!</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-8 h-8 text-red-500" />
                        <div>
                          <h3 className="text-xl font-bold text-red-600">Needs Improvement</h3>
                          <p className="text-gray-600">Severity: {checkResult.severity}</p>
                        </div>
                      </>
                    )}
                  </div>

                  {checkResult.corrections && checkResult.corrections.length > 0 && (
                    <div className="bg-red-50 rounded-xl p-4">
                      <h4 className="font-bold mb-2">Corrections:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {checkResult.corrections.map((correction: string, idx: number) => (
                          <li key={idx} className="text-sm">{correction}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="bg-blue-50 rounded-xl p-4">
                    <h4 className="font-bold mb-2">Explanation:</h4>
                    <p className="whitespace-pre-wrap text-sm">{checkResult.explanation}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Explain Pattern Tab */}
      {activeTab === 'explain' && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <Card>
            <CardHeader>
              <CardTitle>Explain Grammar Pattern</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Grammar Pattern"
                placeholder="e.g., ～ている, ～たい, ～ば"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
              />
              <Button onClick={handleExplain} isLoading={isLoading}>
                <BookOpen className="w-4 h-4 mr-2" />
                Explain Pattern
              </Button>
            </CardContent>
          </Card>

          {explanation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Pattern: {explanation.pattern}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-purple-50 rounded-xl p-4">
                    <h4 className="font-bold mb-2">Explanation:</h4>
                    <p className="whitespace-pre-wrap">{explanation.explanation}</p>
                  </div>

                  {explanation.examples && explanation.examples.length > 0 && (
                    <div className="bg-blue-50 rounded-xl p-4">
                      <h4 className="font-bold mb-2">Examples:</h4>
                      <ul className="space-y-2">
                        {explanation.examples.map((example: string, idx: number) => (
                          <li key={idx} className="text-sm">{example}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Compare Sentences Tab */}
      {activeTab === 'compare' && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <Card>
            <CardHeader>
              <CardTitle>Compare Two Sentences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <TextArea
                label="Sentence 1"
                placeholder="First Japanese sentence..."
                value={sentence1}
                onChange={(e) => setSentence1(e.target.value)}
                rows={2}
              />
              <TextArea
                label="Sentence 2"
                placeholder="Second Japanese sentence..."
                value={sentence2}
                onChange={(e) => setSentence2(e.target.value)}
                rows={2}
              />
              <Button onClick={handleCompare} isLoading={isLoading}>
                <GitCompare className="w-4 h-4 mr-2" />
                Compare Sentences
              </Button>
            </CardContent>
          </Card>

          {comparison && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-pink-50 rounded-xl p-4">
                      <h4 className="font-bold mb-2">Sentence 1:</h4>
                      <p>{comparison.sentence1}</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4">
                      <h4 className="font-bold mb-2">Sentence 2:</h4>
                      <p>{comparison.sentence2}</p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 rounded-xl p-4">
                    <h4 className="font-bold mb-2">Differences:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {comparison.differences.map((diff: string, idx: number) => (
                        <li key={idx} className="text-sm">{diff}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-green-50 rounded-xl p-4">
                    <h4 className="font-bold mb-2">Recommendation:</h4>
                    <p className="whitespace-pre-wrap text-sm">{comparison.recommendation}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Suggestions Tab */}
      {activeTab === 'suggest' && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <Card>
            <CardHeader>
              <CardTitle>Get Alternative Suggestions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <TextArea
                label="Your Sentence"
                placeholder="Enter your Japanese sentence..."
                value={suggestSentence}
                onChange={(e) => setSuggestSentence(e.target.value)}
                rows={3}
              />
              <Button onClick={handleSuggest} isLoading={isLoading}>
                <Lightbulb className="w-4 h-4 mr-2" />
                Get Suggestions
              </Button>
            </CardContent>
          </Card>

          {suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Alternative Ways to Say It</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {suggestions.map((suggestion, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-gradient-to-r from-japanese-pink/10 to-japanese-blue/10 rounded-xl p-4 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">💡</span>
                          <p className="flex-1">{suggestion}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}
