'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { TextArea, Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { animeAPI } from '@/lib/api/client';
import toast from 'react-hot-toast';
import { Tv, MessageSquare } from 'lucide-react';

type TabType = 'dialogue' | 'casual';

export default function AnimePage() {
  const [activeTab, setActiveTab] = useState<TabType>('dialogue');
  const [isLoading, setIsLoading] = useState(false);
  
  const [dialogueText, setDialogueText] = useState('');
  const [context, setContext] = useState('');
  const [dialogueResult, setDialogueResult] = useState<any>(null);

  const [casualText, setCasualText] = useState('');
  const [casualResult, setCasualResult] = useState<any>(null);

  const handleExplainDialogue = async () => {
    if (!dialogueText.trim()) return;
    setIsLoading(true);
    try {
      const response = await animeAPI.explainDialogue({
        japaneseText: dialogueText,
        context: context || undefined,
      });
      
      console.log('Response:', response.data); // Debug log
      setDialogueResult(response.data);
      toast.success('Dialog dijelaskan! 📺');
    } catch (error: any) {
      console.error('Error:', error);
      toast.error('Gagal menjelaskan dialog');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExplainCasual = async () => {
    if (!casualText.trim()) return;
    setIsLoading(true);
    try {
      const response = await animeAPI.explainCasualSpeech({
        text: casualText,
      });
      
      console.log('Response:', response.data); // Debug log
      setCasualResult(response.data);
      toast.success('Casual speech dijelaskan! 💬');
    } catch (error: any) {
      console.error('Error:', error);
      toast.error('Gagal menjelaskan casual speech');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-japanese-purple via-japanese-pink to-japanese-yellow rounded-2xl p-6 text-white shadow-xl"
      >
        <div className="flex items-center gap-4">
          <div className="text-5xl">📺</div>
          <div>
            <h1 className="text-3xl font-bold">Anime Dictionary</h1>
            <p className="opacity-90">Belajar dari dialog anime favorit kamu</p>
          </div>
        </div>
      </motion.div>

      <div className="flex gap-2">
        <Button
          variant={activeTab === 'dialogue' ? 'primary' : 'outline'}
          onClick={() => setActiveTab('dialogue')}
        >
          <Tv className="w-4 h-4 mr-2" />
          Explain Dialogue
        </Button>
        <Button
          variant={activeTab === 'casual' ? 'primary' : 'outline'}
          onClick={() => setActiveTab('casual')}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Casual Speech
        </Button>
      </div>

      {activeTab === 'dialogue' && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <Card>
            <CardHeader>
              <CardTitle>Analisa Dialog Anime</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <TextArea
                label="Dialog Jepang"
                placeholder='Contoh: "おい、待てよ！"'
                value={dialogueText}
                onChange={(e) => setDialogueText(e.target.value)}
                rows={3}
              />
              <Input
                label="Konteks (opsional)"
                placeholder="Misal: Dari anime Naruto, episode 5"
                value={context}
                onChange={(e) => setContext(e.target.value)}
              />
              <Button onClick={handleExplainDialogue} isLoading={isLoading}>
                Jelaskan Dialog
              </Button>
            </CardContent>
          </Card>

          {dialogueResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Penjelasan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-r from-japanese-pink/10 to-japanese-blue/10 rounded-xl p-6">
                    <div className="whitespace-pre-wrap">
                      {/* Try multiple possible response formats */}
                      {dialogueResult.explanation || 
                       dialogueResult.text || 
                       dialogueResult.dialog ||
                       dialogueResult.result ||
                       JSON.stringify(dialogueResult, null, 2)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      )}

      {activeTab === 'casual' && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <Card>
            <CardHeader>
              <CardTitle>Jelaskan Casual Speech</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <TextArea
                label="Casual Japanese Text"
                placeholder='Contoh: "めっちゃやばい！"'
                value={casualText}
                onChange={(e) => setCasualText(e.target.value)}
                rows={3}
              />
              <Button onClick={handleExplainCasual} isLoading={isLoading}>
                Jelaskan Casual Speech
              </Button>
            </CardContent>
          </Card>

          {casualResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Penjelasan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-r from-japanese-purple/10 to-japanese-pink/10 rounded-xl p-6">
                    <div className="whitespace-pre-wrap">
                      {/* Try multiple possible response formats */}
                      {casualResult.explanation || 
                       casualResult.text || 
                       casualResult.result ||
                       JSON.stringify(casualResult, null, 2)}
                    </div>
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