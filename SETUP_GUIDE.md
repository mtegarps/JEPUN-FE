# 🚀 Setup Guide - Japanese E-Learning Frontend

## Prerequisites

Sebelum mulai, pastikan sudah install:
- ✅ **Node.js 18+** (check: `node --version`)
- ✅ **npm** atau **yarn** (check: `npm --version`)
- ✅ **Backend API** running di `http://localhost:3000`

---

## 📦 Step 1: Extract & Install

```bash
# Extract ZIP file
unzip japanese-elearning-frontend-complete.zip

# Masuk ke folder project
cd japanese-elearning-fe

# Install dependencies
npm install
# atau
yarn install
```

**Expected output:**
```
added 500+ packages in 30s
```

---

## ⚙️ Step 2: Configure Environment

File `.env.local` sudah ada dengan konfigurasi default:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NODE_ENV=development
```

### Jika Backend Port Berbeda:

Jika backend kamu running di port lain (misal 4000), edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

---

## 🏃 Step 3: Run Development Server

```bash
npm run dev
# atau
yarn dev
```

**Expected output:**
```
▲ Next.js 14.0.4
- Local:        http://localhost:3000
- Network:      http://192.168.1.x:3000

✓ Ready in 2.5s
```

### Jika Port 3000 Sudah Dipakai (Backend):

Next.js akan otomatis pakai port 3001:
```
- Local:        http://localhost:3001
```

Atau set manual di `package.json`:
```json
"scripts": {
  "dev": "next dev -p 3001"
}
```

---

## 🌐 Step 4: Open Browser

Buka browser dan akses:
```
http://localhost:3000
# atau
http://localhost:3001
```

---

## ✅ Step 5: Test Features

### 1. Register Account
- Klik "始めましょう！" atau "新規登録"
- Isi:
  - Full Name: `山田太郎`
  - Email: `test@example.com`
  - Password: `Test123456`
- Klik "アカウント作成"

### 2. Login
- Email: `test@example.com`
- Password: `Test123456`
- Klik "ログイン"

### 3. Test Dashboard Features
- ✅ Chat dengan AI Sensei
- ✅ Grammar checker
- ✅ Kanji explorer
- ✅ JLPT practice
- ✅ Learning path generator

---

## 🔧 Troubleshooting

### Problem 1: Can't Connect to Backend

**Error:**
```
Network Error
Failed to connect to API
```

**Solution:**
```bash
# 1. Check backend is running
curl http://localhost:3000/api/auth/profile
# Should return 401 (unauthorized) - ini normal!

# 2. Check backend logs
cd ../e-learning-jepang
npm run start:dev

# 3. Check .env.local
cat .env.local | grep API_URL
```

### Problem 2: CORS Error

**Error in Browser Console:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
Di backend (`e-learning-jepang/main.ts`), pastikan CORS enabled:

```typescript
app.enableCors({
  origin: 'http://localhost:3001', // atau port frontend kamu
  credentials: true,
});
```

Restart backend:
```bash
npm run start:dev
```

### Problem 3: Module Not Found

**Error:**
```
Module not found: Can't resolve 'framer-motion'
```

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Problem 4: Port Already in Use

**Error:**
```
Port 3000 is already in use
```

**Solution:**
```bash
# Option 1: Kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Option 2: Use different port
npm run dev -- -p 3001
```

### Problem 5: Authentication Issues

**Error:**
```
Login failed
Invalid credentials
```

**Solution:**
```bash
# Clear browser localStorage
# Open browser console (F12):
localStorage.clear()
location.reload()

# Try register new account
```

---

## 📁 Project Structure

```
japanese-elearning-fe/
├── app/                    # Pages (Next.js 14 App Router)
│   ├── page.tsx           # Landing page
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   ├── auth/
│   │   ├── login/         # Login page
│   │   └── register/      # Register page
│   └── dashboard/
│       ├── layout.tsx     # Dashboard layout
│       ├── page.tsx       # Dashboard home
│       ├── chat/          # AI Chat
│       ├── grammar/       # Grammar checker
│       ├── kanji/         # Kanji explorer
│       ├── jlpt/          # JLPT practice
│       ├── learning-path/ # Learning path
│       └── settings/      # Settings
│
├── components/
│   └── ui/                # Reusable UI components
│       ├── Button.tsx
│       ├── Card.tsx
│       └── Input.tsx
│
├── lib/
│   ├── api/
│   │   └── client.ts      # Axios API client
│   ├── store/
│   │   └── index.ts       # Zustand state management
│   └── utils/
│       └── index.ts       # Helper functions
│
├── public/                # Static assets
├── .env.local             # Environment variables
├── package.json           # Dependencies
├── tailwind.config.ts     # Tailwind CSS config
└── next.config.js         # Next.js config
```

---

## 🎨 Available Scripts

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)

# Production
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Custom port
npm run dev -- -p 3001
```

---

## 🔑 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3000/api` |
| `NODE_ENV` | Environment | `development` |

---

## 🚀 Deploy to Production

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Set environment variable
vercel env add NEXT_PUBLIC_API_URL production
# Enter: https://your-backend-domain.com/api
```

### Docker

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
RUN npm ci --only=production

ENV NODE_ENV production
ENV PORT 3000
EXPOSE 3000

CMD ["npm", "start"]
```

Build & Run:
```bash
docker build -t japanese-elearning-fe .
docker run -p 3000:3000 japanese-elearning-fe
```

---

## 📝 API Endpoints Used

### Authentication
- POST `/auth/register` - Register new user
- POST `/auth/login` - Login user
- GET `/auth/profile` - Get user profile
- POST `/auth/logout` - Logout user
- POST `/auth/refresh` - Refresh token

### Chatbot
- POST `/chatbot/chat` - Send message
- POST `/chatbot/chat-history` - Chat with history

### Grammar
- POST `/grammar/check` - Check grammar
- POST `/grammar/explain` - Explain pattern
- POST `/grammar/compare` - Compare sentences
- POST `/grammar/suggest` - Get suggestions

### Kanji
- POST `/kanji/explore` - Explore kanji
- POST `/kanji/recognize` - OCR from image
- POST `/kanji/mnemonic` - Generate mnemonic

### JLPT
- POST `/jlpt/generate` - Generate question
- POST `/jlpt/mock-test` - Generate mock test
- POST `/jlpt/analyze` - Analyze results

### Learning Path
- POST `/learning-path/generate` - Generate path

---

## 🐛 Common Issues & Solutions

### 1. White Screen / Page Not Loading

```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

### 2. Styles Not Loading

```bash
# Rebuild Tailwind
npm run dev
# Press Ctrl+C and restart
```

### 3. API Calls Failing

Check browser console (F12) → Network tab:
- Status 404: Wrong API URL
- Status 401: Not logged in / token expired
- Status 500: Backend error

### 4. Token Expired

Frontend will auto-refresh token. If still fails:
```javascript
// Browser console:
localStorage.clear()
location.reload()
```

---

## 📊 Development Tips

### 1. Hot Reload

Next.js auto-reloads on file changes. Jika tidak:
```bash
# Restart dev server
Ctrl+C
npm run dev
```

### 2. Debug API Calls

Check browser console (F12) → Network tab untuk lihat:
- Request URL
- Request headers
- Response data
- Status codes

### 3. Check State

Di browser console:
```javascript
// Check auth state
localStorage.getItem('accessToken')

// Check settings
localStorage.getItem('settings-storage')
```

---

## 🎉 Next Steps

After setup success:

1. ✅ Test all features
2. ✅ Customize colors in `tailwind.config.ts`
3. ✅ Add more pages if needed
4. ✅ Deploy to production

---

## 📞 Need Help?

Issues? Check:
1. Backend logs: `npm run start:dev` di folder backend
2. Frontend logs: Browser console (F12)
3. Network tab: Check API calls

---

**Happy Learning! がんばって！ 🌸💪**
