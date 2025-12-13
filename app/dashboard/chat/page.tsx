'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { TextArea } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { chatAPI } from '@/lib/api/client';
import { useChatStore, useSettingsStore } from '@/lib/store';
import toast from 'react-hot-toast';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { getRandomEncouragement } from '@/lib/utils';

export default function ChatPage() {
  const [input, setInput] = useState('');
  const { messages, addMessage, isLoading, setLoading } = useChatStore();
  const { level, personality } = useSettingsStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      role: 'user' as const,
      content: input,
      timestamp: new Date(),
    };

    addMessage(userMessage);
    setInput('');
    setLoading(true);

    try {
      const response = await chatAPI.sendMessage({
        message: input,
        context: {
          level,
          personality,
        },
      });

      const assistantMessage = {
        role: 'assistant' as const,
        content: response.data.reply,
        timestamp: new Date(),
      };

      addMessage(assistantMessage);
      
      // Random encouragement
      if (Math.random() > 0.7) {
        toast.success(getRandomEncouragement());
      }
    } catch (error: any) {
      toast.error('Failed to get response. Please try again.');
      console.error('Chat error:', error);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] lg:h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 md:mb-6"
      >
        <div className="bg-gradient-to-r from-japanese-pink via-japanese-purple to-japanese-blue rounded-xl md:rounded-2xl p-4 md:p-6 text-white shadow-xl">
          <div className="flex items-center gap-3 md:gap-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-3xl md:text-5xl"
            >
              👨‍🏫
            </motion.div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl md:text-3xl font-bold">AI Sensei Chat</h1>
              <p className="opacity-90 text-xs md:text-base truncate">Level: {level} | Style: {personality}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Messages Container */}
      <Card className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-3 md:space-y-4">
          <AnimatePresence>
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 md:py-12"
              >
                <div className="text-4xl md:text-6xl mb-3 md:mb-4">💬</div>
                <h3 className="text-xl md:text-2xl font-bold text-gradient mb-2">
                  こんにちは！
                </h3>
                <p className="text-gray-600 text-sm md:text-base">
                  Start chatting with your AI Sensei!
                </p>
                <div className="mt-4 md:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 max-w-md mx-auto px-2">
                  {[
                    'こんにちは！元気ですか？',
                    'Tell me about Japanese culture',
                    'Help me with grammar',
                    'Teach me new vocabulary',
                  ].map((suggestion, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setInput(suggestion)}
                      className="p-2 md:p-3 rounded-xl bg-gradient-to-r from-japanese-pink/20 to-japanese-blue/20 hover:from-japanese-pink/30 hover:to-japanese-blue/30 text-xs md:text-sm font-medium transition-all"
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-2 md:gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-japanese-pink to-japanese-purple flex items-center justify-center text-white flex-shrink-0"
                    >
                      <Bot className="w-4 h-4 md:w-5 md:h-5" />
                    </motion.div>
                  )}

                  <div
                    className={`max-w-[80%] md:max-w-[70%] rounded-xl md:rounded-2xl p-3 md:p-4 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-japanese-blue to-japanese-green text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm md:text-base">{message.content}</p>
                    <p
                      className={`text-xs mt-1 md:mt-2 ${
                        message.role === 'user'
                          ? 'text-white/70'
                          : 'text-gray-500'
                      }`}
                    >
                      {new Date(message.timestamp).toLocaleTimeString('ja-JP', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  {message.role === 'user' && (
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-japanese-yellow to-japanese-pink flex items-center justify-center text-white flex-shrink-0">
                      <User className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-2 md:gap-3"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-japanese-pink to-japanese-purple flex items-center justify-center text-white">
                <Bot className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <div className="bg-gray-100 rounded-xl md:rounded-2xl p-3 md:p-4">
                <div className="flex gap-1">
                  <motion.div
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    className="w-2 h-2 bg-japanese-pink rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 bg-japanese-blue rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                    className="w-2 h-2 bg-japanese-purple rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-3 md:p-4 bg-gray-50">
          <form onSubmit={handleSubmit} className="flex gap-2 md:gap-3">
            <TextArea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              rows={2}
              className="flex-1 resize-none text-sm md:text-base"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-3 md:px-6"
            >
              <Send className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
