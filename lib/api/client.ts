import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { email: string; password: string; fullName: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  logout: () => api.post('/auth/logout'),
};

// Chat API
export const chatAPI = {
  sendMessage: (data: {
    message: string;
    context?: { level?: string; personality?: string };
  }) => api.post('/chatbot/chat', data),
  chatWithHistory: (data: {
    message: string;
    history: Array<{ role: string; content: string }>;
    context?: { level?: string; personality?: string };
  }) => api.post('/chatbot/chat-history', data),
};

// Grammar API
export const grammarAPI = {
  check: (data: { sentence: string; userLevel: string }) =>
    api.post('/grammar/check', data),
  explain: (data: { pattern: string; level: string }) =>
    api.post('/grammar/explain', data),
  compare: (data: {
    sentence1: string;
    sentence2: string;
    userLevel: string;
  }) => api.post('/grammar/compare', data),
  suggest: (data: { sentence: string; userLevel: string }) =>
    api.post('/grammar/suggest', data),
};

// Kanji API
export const kanjiAPI = {
  explore: (data: { kanji: string }) => 
    api.get('/kanji/explore', { params: { kanji: data.kanji, level: 'N5' } }),
  recognize: (data: { image: string }) => 
    api.post('/kanji/recognize', data),
  mnemonic: (data: { kanji: string }) => 
    api.get('/kanji/mnemonic', { params: { kanji: data.kanji } }),
};

// JLPT API
export const jlptAPI = {
  generateQuestion: (data: { level: string; type: string }) =>
    api.post('/jlpt/generate', data),
  generateMockTest: (data: { level: string; sections: string[] }) =>
    api.post('/jlpt/mock-test', data),
  analyzeResults: (data: { userId: string; answers: any[] }) =>
    api.post('/jlpt/analyze', data),
};

// Learning Path API
export const learningPathAPI = {
  generate: (data: {
    currentLevel: string;
    goals: string;
    studyTime: number;
    weakPoints?: string[];
  }) => api.post('/learning-path/generate', data),
};

export default api;

// Scenarios API
export const scenariosAPI = {
  generate: (data: { scenario: string; level: string; difficulty: string }) =>
    api.post('/scenarios/generate', data),
};

// Anime Dictionary API
export const animeAPI = {
  explainDialogue: (data: { japaneseText: string; context?: string }) =>
    api.post('/anime-dictionary/explain', { 
      text: data.japaneseText,
      context: data.context 
    }),
  explainCasualSpeech: (data: { text: string }) =>
    api.post('/anime-dictionary/explain', data),
};

// Speech API
export const speechAPI = {
  transcribeAudio: (data: { audio: File | Blob }) => {
    const formData = new FormData();
    formData.append('audio', data.audio);
    return api.post('/speech/transcribe', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  textToSpeech: (data: { text: string; voice?: string }) =>
    api.post('/speech/tts', data),
  analyzePronunciation: (data: { audio: File | Blob; expectedText: string }) => {
    const formData = new FormData();
    formData.append('audio', data.audio);
    formData.append('expectedText', data.expectedText);
    return api.post('/speech/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// User Management API
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: { fullName?: string; email?: string }) =>
    api.put('/users/profile', data),
  updateJLPTLevel: (data: { level: string }) =>
    api.put('/users/jlpt-level', data),
  updateStudyStreak: () => api.post('/users/study-streak'),
};