'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { kanjiAPI } from '@/lib/api/client';
import toast from 'react-hot-toast';
import { Brain, Camera, Lightbulb } from 'lucide-react';

type TabType = 'explore' | 'recognize' | 'mnemonic';

export default function KanjiPage() {
  const [activeTab, setActiveTab] = useState<TabType>('explore');
  const [isLoading, setIsLoading] = useState(false);

  const [kanji, setKanji] = useState('');
  const [result, setResult] = useState<any>(null);

  const [mnemonicKanji, setMnemonicKanji] = useState('');
  const [mnemonic, setMnemonic] = useState<any>(null);

  const handleExplore = async () => {
    if (!kanji.trim()) return;
    setIsLoading(true);
    try {
      const response = await kanjiAPI.explore({ kanji });
      setResult(response.data);
      toast.success('Kanji berhasil dieksplor! 🔤');
    } catch (error) {
      toast.error('Gagal eksplor kanji');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMnemonic = async () => {
    if (!mnemonicKanji.trim()) return;
    setIsLoading(true);
    try {
      const response = await kanjiAPI.mnemonic({ kanji: mnemonicKanji });
      setMnemonic(response.data);
      toast.success('Mnemonic berhasil dibuat! 💡');
    } catch (error) {
      toast.error('Gagal membuat mnemonic');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'explore' as TabType, label: 'Explore Kanji', icon: Brain },
    { id: 'recognize' as TabType, label: 'Recognize Image', icon: Camera },
    { id: 'mnemonic' as TabType, label: 'Mnemonic', icon: Lightbulb },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-japanese-purple via-japanese-pink to-japanese-yellow rounded-2xl p-6 text-white shadow-xl"
      >
        <div className="flex items-center gap-4">
          <div className="text-5xl">🔤</div>
          <div>
            <h1 className="text-3xl font-bold">Kanji Explorer</h1>
            <p className="opacity-90">Belajar kanji dengan mnemonic kreatif</p>
          </div>
        </div>
      </motion.div>

      <div className="flex gap-2">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'primary' : 'outline'}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </Button>
        ))}
      </div>

      {activeTab === 'explore' && (
        <Card>
          <CardHeader>
            <CardTitle>Explore Kanji Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Kanji Character"
              placeholder="contoh: 食"
              value={kanji}
              onChange={(e) => setKanji(e.target.value)}
              maxLength={1}
            />
            <Button onClick={handleExplore} isLoading={isLoading}>
              Explore Kanji
            </Button>

            {result && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gradient-to-r from-japanese-pink/10 to-japanese-blue/10 rounded-xl p-6 mt-4"
              >
                <div className="text-center mb-4">
                  <div className="text-8xl font-bold">{result.kanji}</div>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <p className="whitespace-pre-wrap">{result.explanation}</p>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'recognize' && (
        <Card>
          <CardHeader>
            <CardTitle>Recognize Kanji from Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <Camera className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Fitur upload gambar segera hadir!</p>
              <p className="text-sm text-gray-500 mt-2">Upload gambar dengan kanji untuk mengenalinya</p>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'mnemonic' && (
        <Card>
          <CardHeader>
            <CardTitle>Generate Creative Mnemonic</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Kanji Character"
              placeholder="contoh: 食"
              value={mnemonicKanji}
              onChange={(e) => setMnemonicKanji(e.target.value)}
              maxLength={1}
            />
            <Button onClick={handleMnemonic} isLoading={isLoading}>
              <Lightbulb className="w-4 h-4 mr-2" />
              Generate Mnemonic
            </Button>

            {mnemonic && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-yellow-50 rounded-xl p-6"
              >
                <div className="text-center mb-4">
                  <div className="text-6xl font-bold">{mnemonic.kanji}</div>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <p className="text-lg">{mnemonic.mnemonic}</p>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}