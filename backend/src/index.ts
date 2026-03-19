import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import assignmentRoutes from './routes/assignments'
import { initSocket } from './socket/index'

const app = express()
const httpServer = createServer(app)

export const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
})

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

app.use('/api/assignments', assignmentRoutes)

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

initSocket(io)

mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err))

const PORT = process.env.PORT || 5000
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
