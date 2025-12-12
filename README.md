# 🌸 Japanese E-Learning Frontend

Beautiful and interactive Next.js frontend for learning Japanese with AI!

## ✨ Features

- 🎨 **Kawaii Design** - Cute Japanese-themed UI with animations
- 💬 **AI Chat** - Interactive chat with AI Sensei
- 📚 **Grammar Checker** - Real-time grammar checking
- 🔤 **Kanji Explorer** - Learn kanji with mnemonics
- 🏆 **JLPT Practice** - Mock tests for all levels
- 🎯 **Learning Path** - Personalized curriculum
- 🌙 **Dark Mode** - Coming soon!
- 📱 **Responsive** - Works on all devices

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Backend API running on http://localhost:3000

### Installation

```bash
# Extract the zip file
unzip japanese-elearning-frontend.zip
cd japanese-elearning-frontend

# Install dependencies
npm install

# Setup environment
cp .env.local.example .env.local
# Edit .env.local and set your API URL

# Run development server
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

### Production Build

```bash
npm run build
npm start
```

## 📁 Project Structure

```
japanese-elearning-fe/
├── app/                    # Next.js 14 App Router
│   ├── auth/              # Auth pages (login, register)
│   ├── dashboard/         # Dashboard pages
│   │   ├── chat/         # Chat with AI Sensei
│   │   ├── grammar/      # Grammar checker
│   │   ├── kanji/        # Kanji explorer
│   │   ├── jlpt/         # JLPT practice
│   │   └── learning-path/ # Learning path
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/            # Reusable components
│   ├── ui/               # UI components (Button, Card, Input)
│   ├── layout/           # Layout components
│   └── features/         # Feature-specific components
├── lib/                   # Utilities & configs
│   ├── api/              # API client (Axios)
│   ├── store/            # Zustand state management
│   └── utils/            # Helper functions
└── public/               # Static assets
```

## 🎨 Design System

### Colors
- **Japanese Pink** (#FFB7C5) - Primary actions
- **Japanese Blue** (#89CFF0) - Secondary actions
- **Japanese Purple** (#C3B1E1) - Accents
- **Japanese Yellow** (#FFE87C) - Highlights
- **Japanese Green** (#A8E6CF) - Success

### Animations
- Floating cherry blossoms 🌸
- Smooth page transitions
- Hover effects on cards
- Loading animations

### Components
All components use Tailwind CSS with custom Japanese-themed classes.

## 🔐 Authentication Flow

1. **Register** → `/auth/register`
2. **Login** → `/auth/login`
3. **Dashboard** → `/dashboard`

JWT tokens are stored in localStorage and managed by Zustand store.

## 📡 API Integration

The app connects to the backend API at `NEXT_PUBLIC_API_URL`.

### Available API Endpoints:

**Auth:**
- POST `/auth/register` - Register new user
- POST `/auth/login` - Login user
- GET `/auth/profile` - Get user profile
- POST `/auth/logout` - Logout user

**Chat:**
- POST `/chatbot/chat` - Send message to AI Sensei
- POST `/chatbot/chat-history` - Chat with conversation history

**Grammar:**
- POST `/grammar/check` - Check grammar
- POST `/grammar/explain` - Explain grammar pattern
- POST `/grammar/compare` - Compare sentences
- POST `/grammar/suggest` - Suggest corrections

**Kanji:**
- POST `/kanji/explore` - Explore kanji details
- POST `/kanji/recognize` - OCR from image
- POST `/kanji/mnemonic` - Generate mnemonic

**JLPT:**
- POST `/jlpt/generate` - Generate question
- POST `/jlpt/mock-test` - Generate mock test
- POST `/jlpt/analyze` - Analyze test results

**Learning Path:**
- POST `/learning-path/generate` - Generate learning path

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **State:** Zustand
- **HTTP:** Axios
- **Icons:** Lucide React
- **Notifications:** React Hot Toast

## 🎯 Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 🔧 Development

### Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
```

### Code Structure

- Use **Server Components** by default
- Add `'use client'` only when needed (state, effects, events)
- Keep components small and focused
- Use TypeScript for type safety
- Follow Next.js 14 best practices

## 🎨 Customization

### Changing Colors

Edit `tailwind.config.ts`:

```typescript
colors: {
  japanese: {
    pink: '#YOUR_COLOR',
    blue: '#YOUR_COLOR',
    // ...
  }
}
```

### Adding New Pages

1. Create folder in `app/`
2. Add `page.tsx`
3. Use the dashboard layout if needed

### Adding New API Endpoints

Edit `lib/api/client.ts` and add your endpoint.

## 📱 Responsive Design

The app is fully responsive:
- Mobile: Stack layout
- Tablet: Sidebar + main content
- Desktop: Full sidebar + expanded content

## 🐛 Troubleshooting

### API Connection Issues

**Problem:** Can't connect to backend
**Solution:** 
```bash
# Check backend is running
curl http://localhost:3000/api

# Check .env.local has correct URL
cat .env.local
```

### Authentication Issues

**Problem:** Can't login
**Solution:**
```bash
# Clear localStorage
# Open browser console:
localStorage.clear()
```

### Build Errors

**Problem:** TypeScript errors
**Solution:**
```bash
# Clean install
rm -rf node_modules .next
npm install
npm run build
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📸 Screenshots

Landing page with cherry blossoms 🌸
Dashboard with Japanese aesthetic
AI Chat with real-time responses
Grammar checker with instant feedback

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

## 📝 License

MIT License - feel free to use for your projects!

## 💖 Credits

- Design inspired by Japanese kawaii culture
- Icons from Lucide React
- Animations by Framer Motion
- Built with ❤️ and 🍵

---

**Made with 🌸 for Japanese learners worldwide**

Start your Japanese learning journey today! がんばって！ 💪
