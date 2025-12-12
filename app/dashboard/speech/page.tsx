'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { TextArea } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { speechAPI } from '@/lib/api/client';
import toast from 'react-hot-toast';
import { Mic, Volume2, Activity } from 'lucide-react';

type TabType = 'transcribe' | 'tts' | 'analyze';

export default function SpeechPage() {
  const [activeTab, setActiveTab] = useState<TabType>('tts');
  const [isLoading, setIsLoading] = useState(false);
  
  const [ttsText, setTtsText] = useState('');
  const [audioUrl, setAudioUrl] = useState<string>('');

  const tabs = [
    { id: 'transcribe' as TabType, label: 'Transcribe Audio', icon: Mic },
    { id: 'tts' as TabType, label: 'Text to Speech', icon: Volume2 },
    { id: 'analyze' as TabType, label: 'Analyze Pronunciation', icon: Activity },
  ];

  const handleTTS = async () => {
    if (!ttsText.trim()) return;
    setIsLoading(true);
    try {
      const response = await speechAPI.textToSpeech({ text: ttsText });
      if (response.data.audioUrl) {
        setAudioUrl(response.data.audioUrl);
        toast.success('Audio berhasil dibuat! 🔊');
      }
    } catch (error) {
      toast.error('Gagal membuat audio');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-japanese-blue via-japanese-green to-japanese-purple rounded-2xl p-6 text-white shadow-xl"
      >
        <div className="flex items-center gap-4">
          <div className="text-5xl">🎤</div>
          <div>
            <h1 className="text-3xl font-bold">Speech & Pronunciation</h1>
            <p className="opacity-90">Latih pronunciation dengan AI</p>
          </div>
        </div>
      </motion.div>

      <div className="flex gap-2 overflow-x-auto">
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

      {activeTab === 'transcribe' && (
        <Card>
          <CardHeader>
            <CardTitle>Transcribe Audio (Whisper)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <Mic className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-2">Audio upload coming soon!</p>
              <p className="text-sm text-gray-500">
                Upload audio untuk di-transcribe ke teks Jepang
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'tts' && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <Card>
            <CardHeader>
              <CardTitle>Text to Speech</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <TextArea
                label="Teks Jepang"
                placeholder="Masukkan teks Jepang yang ingin diucapkan..."
                value={ttsText}
                onChange={(e) => setTtsText(e.target.value)}
                rows={4}
              />
              <Button onClick={handleTTS} isLoading={isLoading}>
                <Volume2 className="w-4 h-4 mr-2" />
                Generate Audio
              </Button>

              {audioUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-japanese-pink/10 to-japanese-blue/10 rounded-xl p-6"
                >
                  <audio controls className="w-full">
                    <source src={audioUrl} type="audio/mpeg" />
                  </audio>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {activeTab === 'analyze' && (
        <Card>
          <CardHeader>
            <CardTitle>Analyze Pronunciation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <Activity className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-2">Pronunciation analysis coming soon!</p>
              <p className="text-sm text-gray-500">
                Record audio dan bandingkan dengan pronunciation yang benar
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
