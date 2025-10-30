import express from 'express'
import dotenv from 'dotenv'
import healthRouter from './routes/health'
import vocabRouter from './routes/vocab'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const app = express()
app.use(express.json())

app.use('/api/health', healthRouter)
app.use('/api/vocab', vocabRouter)

const port = Number(process.env.PORT ?? 4000)
app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`)
})
