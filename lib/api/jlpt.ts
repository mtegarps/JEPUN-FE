import { api } from './client';

// Types
export interface QuestionGenerateRequest {
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  type: 'vocabulary' | 'grammar' | 'kanji_reading' | 'kanji_meaning' | 'reading';
  difficulty?: 'easy' | 'medium' | 'hard';
  withImage?: boolean;
}

export interface AdaptiveQuestionRequest {
  targetLevel: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  preferredType?: string;
}

export interface VisualVocabQuizRequest {
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  category: 'food' | 'animals' | 'daily_life' | 'transportation' | 'body_parts';
  count?: number;
}

export interface EmotionQuizRequest {
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  count?: number;
}

export interface ActionQuizRequest {
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  count?: number;
}

export interface SceneQuestionRequest {
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  scenario: string;
  imageStyle?: 'anime' | 'illustration' | 'realistic';
}

export interface SpotDifferenceRequest {
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  scene: string;
  differenceCount?: number;
}

export interface KanjiMnemonicRequest {
  kanji: string;
  customHint?: string;
}

export interface KanjiQuizRequest {
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  count?: number;
  withMnemonics?: boolean;
  type?: 'kanji_meaning' | 'kanji_reading';
}

export interface MangaStoryRequest {
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  theme: string;
  panelCount?: number;
}

export interface ReadingPassageRequest {
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  topic: string;
  length?: 'short' | 'medium' | 'long';
}

export interface CulturalLessonRequest {
  topic: string;
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
}

export interface QuickTestRequest {
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  questionCount?: number;
  types?: string[];
}

export interface CustomMockTestRequest {
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  sections: ('moji_goi' | 'bunpou' | 'dokkai')[];
  questionsPerSection?: number;
  timedMode?: boolean;
}

export interface FullMockTestRequest {
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  includeListening?: boolean;
}

export interface AdaptiveTestRequest {
  startLevel: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  questionCount?: number;
}

export interface AnswerItem {
  questionId: string;
  userAnswer: string;
  correctAnswer: string;
  questionType: string;
  timeSpentSeconds?: number;
  grammarPoint?: string;
}

export interface AnalyzeAnswersRequest {
  userId: string;
  answers: AnswerItem[];
  testLevel: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  sessionId?: string;
}

export interface SubmitAnswerRequest {
  questionId: string;
  userAnswer: string;
  correctAnswer: string;
  questionType: string;
  timeSpentSeconds?: number;
}

export interface ReviewUpdateRequest {
  userId: string;
  questionId: string;
  wasCorrect: boolean;
  confidenceLevel?: number;
}

export interface StartSessionRequest {
  userId: string;
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  focusAreas?: string[];
  durationMinutes?: number;
}

// JLPT API Module
export const jlptFullAPI = {
  // ============ CORE QUESTIONS ============
  question: {
    generate: (data: QuestionGenerateRequest) =>
      api.post('/jlpt/question/generate', data),
    adaptive: (data: AdaptiveQuestionRequest) =>
      api.post('/jlpt/question/adaptive', data),
  },

  // ============ VISUAL QUIZZES ============
  visual: {
    vocabQuiz: (data: VisualVocabQuizRequest) =>
      api.post('/jlpt/visual/vocab-quiz', data),
    emotionQuiz: (data: EmotionQuizRequest) =>
      api.post('/jlpt/visual/emotion-quiz', data),
    actionQuiz: (data: ActionQuizRequest) =>
      api.post('/jlpt/visual/action-quiz', data),
    sceneQuestion: (data: SceneQuestionRequest) =>
      api.post('/jlpt/visual/scene-question', data),
    spotDifference: (data: SpotDifferenceRequest) =>
      api.post('/jlpt/visual/spot-difference', data),
  },

  // ============ KANJI ============
  kanji: {
    mnemonic: (data: KanjiMnemonicRequest) =>
      api.post('/jlpt/kanji/mnemonic', data),
    quiz: (data: KanjiQuizRequest) =>
      api.post('/jlpt/kanji/quiz', data),
  },

  // ============ MANGA & READING ============
  manga: {
    story: (data: MangaStoryRequest) =>
      api.post('/jlpt/manga/story', data),
  },
  reading: {
    passage: (data: ReadingPassageRequest) =>
      api.post('/jlpt/reading/passage', data),
    cultural: (data: CulturalLessonRequest) =>
      api.post('/jlpt/reading/cultural', data),
  },

  // ============ MOCK TESTS ============
  mockTest: {
    quick: (data: QuickTestRequest) =>
      api.post('/jlpt/mock-test/quick', data),
    custom: (data: CustomMockTestRequest) =>
      api.post('/jlpt/mock-test/custom', data),
    full: (data: FullMockTestRequest) =>
      api.post('/jlpt/mock-test/full', data),
    adaptive: (data: AdaptiveTestRequest) =>
      api.post('/jlpt/mock-test/adaptive', data),
  },

  // ============ ANALYSIS & PROGRESS ============
  analyze: (data: AnalyzeAnswersRequest) =>
    api.post('/jlpt/analyze', data),
  submitAnswer: (data: SubmitAnswerRequest) =>
    api.post('/jlpt/submit-answer', data),
  getProgress: (level?: string) =>
    api.get('/jlpt/progress', { params: level ? { level } : {} }),
  getWeakness: (recentQuestions?: number) =>
    api.get('/jlpt/weakness', { params: { recentQuestions: recentQuestions || 50 } }),
  predictLevel: () =>
    api.get('/jlpt/predict-level'),

  // ============ ACHIEVEMENTS ============
  achievements: {
    getAll: () => api.get('/jlpt/achievements'),
    check: () => api.post('/jlpt/achievements/check'),
  },

  // ============ SPACED REPETITION ============
  review: {
    getDue: (count?: number) =>
      api.get('/jlpt/review/due', { params: { count: count || 10 } }),
    update: (data: ReviewUpdateRequest) =>
      api.post('/jlpt/review/update', data),
  },

  // ============ STUDY TOOLS ============
  getDailyChallenge: (level: string) =>
    api.get('/jlpt/daily-challenge', { params: { level } }),
  startSession: (data: StartSessionRequest) =>
    api.post('/jlpt/session/start', data),
  getStudyPlan: (level: string) =>
    api.get('/jlpt/study-plan', { params: { level } }),

  // ============ CATEGORIES & INFO ============
  categories: {
    vocabulary: () => api.get('/jlpt/categories/vocabulary'),
    scenarios: () => api.get('/jlpt/categories/scenarios'),
    cultural: () => api.get('/jlpt/categories/cultural'),
  },
  getLevelsInfo: () => api.get('/jlpt/levels'),
};

export default jlptFullAPI;
