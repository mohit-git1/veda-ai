# VedaAI — AI Assessment Creator

## Live Demo
- Frontend: https://veda-ai-iota.vercel.app
- Backend: https://veda-ai-backend-okmj.onrender.com

## Tech Stack
- Frontend: Next.js 14, TypeScript, Tailwind CSS, Zustand, Socket.io-client
- Backend: Node.js, Express, TypeScript, MongoDB, Redis, BullMQ, Socket.io
- AI: NVIDIA API (meta/llama-3.1-8b-instruct)

## Architecture
1. Teacher submits assignment form → POST /api/assignments
2. Assignment saved to MongoDB → Job added to BullMQ queue
3. Worker picks up job → Builds structured prompt → Calls LLM
4. LLM response validated with Zod → Result saved to MongoDB
5. WebSocket emits generation:complete → Frontend updates live

## Local Setup

### Backend
cd backend
cp .env.example .env
# Fill in your values
npm install
npm run dev        # Terminal 1 - API server
npm run dev:worker # Terminal 2 - BullMQ worker

### Frontend
cd frontend
cp .env.local.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:5000
npm install
npm run dev        # Terminal 3

## Environment Variables

### Backend (.env)
PORT=5000
MONGODB_URI=your_atlas_connection_string
REDIS_URL=your_upstash_redis_url
NVIDIA_API_KEY=your_nvidia_api_key
FRONTEND_URL=http://localhost:3000
NODE_ENV=development

### Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:5000