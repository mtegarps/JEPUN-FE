'use client';

import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useSettingsStore } from '@/lib/store';
import { JLPT_LEVELS, PERSONALITY_TYPES, getLevelColor } from '@/lib/utils';
import { Settings as SettingsIcon, User, Palette } from 'lucide-react';

export default function SettingsPage() {
  const { level, personality, setLevel, setPersonality } = useSettingsStore();

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-japanese-pink to-japanese-purple rounded-2xl p-6 text-white shadow-xl"
      >
        <div className="flex items-center gap-4">
          <SettingsIcon className="w-12 h-12" />
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="opacity-90">Customize your learning experience</p>
          </div>
        </div>
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle>
            <User className="w-5 h-5 inline mr-2" />
            Learning Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-bold mb-3">JLPT Level</h3>
            <div className="flex flex-wrap gap-3">
              {JLPT_LEVELS.map((lvl) => (
                <Button
                  key={lvl}
                  variant={level === lvl ? 'primary' : 'outline'}
                  onClick={() => setLevel(lvl)}
                  className={level === lvl ? '' : getLevelColor(lvl)}
                >
                  {lvl}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-3">AI Sensei Personality</h3>
            <div className="grid grid-cols-2 gap-3">
              {PERSONALITY_TYPES.map((type) => (
                <motion.div
                  key={type.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPersonality(type.value)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    personality === type.value
                      ? 'border-japanese-pink bg-japanese-pink/10'
                      : 'border-gray-200 hover:border-japanese-pink/50'
                  }`}
                >
                  <div className="text-2xl mb-2">{type.emoji}</div>
                  <div className="font-medium">{type.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <Palette className="w-5 h-5 inline mr-2" />
            Theme (Coming Soon)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Dark mode coming soon!</p>
        </CardContent>
      </Card>
    </div>
  );
}
