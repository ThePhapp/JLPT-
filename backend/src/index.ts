import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import healthRouter from './routes/health'
import vocabRouter from './routes/vocab'
import vocabularyRouter from './routes/vocabulary'
import authRouter from './routes/auth'
import { authMiddleware } from './middleware/auth'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const app = express()
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())

app.use('/api/health', healthRouter)
app.use('/api/vocab', vocabRouter)
app.use('/api/auth', authRouter)
app.use('/api/vocabulary', authMiddleware, vocabularyRouter)

const port = Number(process.env.PORT ?? 4000)
app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`)
})
