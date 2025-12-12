'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { scenariosAPI } from '@/lib/api/client';
import { useSettingsStore } from '@/lib/store';
import toast from 'react-hot-toast';
import { Coffee, ShoppingBag, Briefcase } from 'lucide-react';

type ScenarioType = 'restaurant' | 'shopping' | 'business';

export default function ScenariosPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [scenario, setScenario] = useState<any>(null);
  const [difficulty, setDifficulty] = useState<string>('medium');
  const { level } = useSettingsStore();

  const scenarios = [
    {
      type: 'restaurant' as ScenarioType,
      title: 'Restoran',
      icon: <Coffee className="w-8 h-8" />,
      color: 'from-japanese-pink to-japanese-yellow',
      description: 'Pesan makanan, minta bill, dll',
    },
    {
      type: 'shopping' as ScenarioType,
      title: 'Belanja',
      icon: <ShoppingBag className="w-8 h-8" />,
      color: 'from-japanese-blue to-japanese-green',
      description: 'Beli barang, tanya harga, fitting room',
    },
    {
      type: 'business' as ScenarioType,
      title: 'Meeting Bisnis',
      icon: <Briefcase className="w-8 h-8" />,
      color: 'from-japanese-purple to-japanese-pink',
      description: 'Presentasi, diskusi, negosiasi',
    },
  ];

  const handleGenerate = async (type: ScenarioType) => {
    setIsLoading(true);
    try {
      const response = await scenariosAPI.generate({ 
        scenario: type,
        level, 
        difficulty 
      });
      
      setScenario(response.data);
      toast.success('Scenario berhasil dibuat! 🎭');
    } catch (error) {
      toast.error('Gagal membuat scenario');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-japanese-pink via-japanese-purple to-japanese-blue rounded-2xl p-6 text-white shadow-xl"
      >
        <div className="flex items-center gap-4">
          <div className="text-5xl">🎭</div>
          <div>
            <h1 className="text-3xl font-bold">Scenarios & Roleplay</h1>
            <p className="opacity-90">Latihan percakapan dalam situasi nyata</p>
          </div>
        </div>
      </motion.div>

      {/* Difficulty Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Pilih Tingkat Kesulitan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            {['easy', 'medium', 'hard'].map((diff) => (
              <Button
                key={diff}
                variant={difficulty === diff ? 'primary' : 'outline'}
                onClick={() => setDifficulty(diff)}
              >
                {diff === 'easy' ? 'Mudah' : diff === 'medium' ? 'Sedang' : 'Sulit'}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scenario Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {scenarios.map((item, index) => (
          <motion.div
            key={item.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover>
              <CardContent className="text-center py-8">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white mx-auto mb-4`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                <Button
                  onClick={() => handleGenerate(item.type)}
                  isLoading={isLoading}
                  className="w-full"
                >
                  Generate Scenario
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Scenario Result */}
      {scenario && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Roleplay Scenario</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-japanese-pink/10 to-japanese-blue/10 rounded-xl p-6">
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap">{scenario.scenario || scenario.text}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}