import { Router } from 'express'
import db from '../db'
const router = Router()

router.get('/', async (_req, res) => {
  try {
    const result = await db.query('SELECT id, word, reading, meaning, jlpt_level FROM vocab ORDER BY id ASC')
    if (result.rowCount > 0) return res.json(result.rows)
    // fallback
    return res.json([
      { id: 1, word: '猫', reading: 'ねこ', meaning: 'cat', jlpt_level: 'N5' }
    ])
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'db error' })
  }
})

export default router
