import { Router } from 'express'
import db from '../db'
import { AuthenticatedRequest } from '../middleware/auth'

const router = Router()

// GET /api/vocabulary
router.get('/', async (req: AuthenticatedRequest, res) => {
  try {
    const { search, level } = req.query
    let query = 'SELECT * FROM vocabulary WHERE 1=1'
    const params: any[] = []

    if (typeof search === 'string') {
      query += ' AND (word ILIKE $1 OR kanji ILIKE $1 OR hiragana ILIKE $1 OR katakana ILIKE $1)'
      params.push(`%${search}%`)
    }

    if (level) {
      query += ` AND jlpt_level = $${params.length + 1}`
      params.push(level)
    }

    query += ' ORDER BY word ASC'

    const { rows } = await db.query(query, params)
    res.json(rows)
  } catch (error) {
    console.error('Error fetching vocabulary:', error)
    res.status(500).json({ error: 'Failed to fetch vocabulary' })
  }
})

// GET /api/vocabulary/:id
router.get('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params
    const { rows } = await db.query('SELECT * FROM vocabulary WHERE id = $1', [id])
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Vocabulary not found' })
    }

    res.json(rows[0])
  } catch (error) {
    console.error('Error fetching vocabulary item:', error)
    res.status(500).json({ error: 'Failed to fetch vocabulary item' })
  }
})

// POST /api/vocabulary
router.post('/', async (req: AuthenticatedRequest, res) => {
  try {
    const {
      word,
      kanji,
      hiragana,
      katakana,
      meanings,
      examples,
      components,
      jlpt_level,
      tags,
      stroke_count,
    } = req.body

    const { rows } = await db.query(
      `INSERT INTO vocabulary (
        word,
        kanji,
        hiragana,
        katakana,
        meanings,
        examples,
        components,
        jlpt_level,
        tags,
        stroke_count
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        word,
        kanji,
        hiragana,
        katakana,
        meanings,
        examples,
        components,
        jlpt_level,
        tags,
        stroke_count,
      ]
    )

    res.status(201).json(rows[0])
  } catch (error) {
    console.error('Error creating vocabulary item:', error)
    res.status(500).json({ error: 'Failed to create vocabulary item' })
  }
})

// PUT /api/vocabulary/:id
router.put('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params
    const {
      word,
      kanji,
      hiragana,
      katakana,
      meanings,
      examples,
      components,
      jlpt_level,
      tags,
      stroke_count,
    } = req.body

    const { rows } = await db.query(
      `UPDATE vocabulary SET
        word = $1,
        kanji = $2,
        hiragana = $3,
        katakana = $4,
        meanings = $5,
        examples = $6,
        components = $7,
        jlpt_level = $8,
        tags = $9,
        stroke_count = $10,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $11 RETURNING *`,
      [
        word,
        kanji,
        hiragana,
        katakana,
        meanings,
        examples,
        components,
        jlpt_level,
        tags,
        stroke_count,
        id,
      ]
    )

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Vocabulary not found' })
    }

    res.json(rows[0])
  } catch (error) {
    console.error('Error updating vocabulary item:', error)
    res.status(500).json({ error: 'Failed to update vocabulary item' })
  }
})

// DELETE /api/vocabulary/:id
router.delete('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params
    const { rows } = await db.query('DELETE FROM vocabulary WHERE id = $1 RETURNING id', [id])
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Vocabulary not found' })
    }

    res.status(204).send()
  } catch (error) {
    console.error('Error deleting vocabulary item:', error)
    res.status(500).json({ error: 'Failed to delete vocabulary item' })
  }
})

export default router