import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const JLPT_LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'] as const;

export const PERSONALITY_TYPES = [
  { value: 'friendly', label: '😊 Friendly', emoji: '🌸' },
  { value: 'professional', label: '👔 Professional', emoji: '📚' },
  { value: 'patient', label: '😌 Patient', emoji: '🧘' },
  { value: 'encouraging', label: '💪 Encouraging', emoji: '⭐' },
] as const;

export const getLevelColor = (level: string) => {
  const colors = {
    N5: 'bg-green-100 text-green-800',
    N4: 'bg-blue-100 text-blue-800',
    N3: 'bg-yellow-100 text-yellow-800',
    N2: 'bg-orange-100 text-orange-800',
    N1: 'bg-red-100 text-red-800',
  };
  return colors[level as keyof typeof colors] || colors.N5;
};

export const formatDate = (date: Date | string) => {
  const d = new Date(date);
  return d.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'おはようございます！';
  if (hour < 18) return 'こんにちは！';
  return 'こんばんは！';
};

export const encouragementMessages = [
  'がんばって！ Keep going!',
  'すごい！ Amazing!',
  '上手です！ Great job!',
  'よくできました！ Well done!',
  '素晴らしい！ Excellent!',
];

export const getRandomEncouragement = () => {
  return encouragementMessages[
    Math.floor(Math.random() * encouragementMessages.length)
  ];
};
