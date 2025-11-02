import { Pool } from 'pg'
import dotenv from 'dotenv'
import path from 'node:path'

const envPath = path.resolve(__dirname, '../../.env')
dotenv.config({ path: envPath })

console.log('Loading environment from:', envPath)
console.log('Database config:', {
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DB
})

if (!process.env.POSTGRES_PASSWORD) {
  throw new Error('Database password not set in environment variables')
}

const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: Number.parseInt(process.env.POSTGRES_PORT || '5433'),
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB || 'jlpt_db',
  ssl: false
})

// Sample vocabulary data with rich content
const sampleVocabulary = [
  {
    word: '学生',
    kanji: '学生',
    hiragana: 'がくせい',
    katakana: null,
    meanings: [
      {
        type: 'noun',
        definition: 'student; pupil; learner',
        tags: ['common', 'formal']
      }
    ],
    examples: [
      {
        japanese: '私は大学の学生です。',
        reading: 'わたしはだいがくのがくせいです。',
        meaning: 'I am a university student.'
      },
      {
        japanese: '彼は優秀な学生です。',
        reading: 'かれはゆうしゅうながくせいです。',
        meaning: 'He is an excellent student.'
      }
    ],
    components: [
      {
        kanji: '学',
        meaning: 'study, learning, science',
        reading: 'がく'
      },
      {
        kanji: '生',
        meaning: 'life, birth, raw',
        reading: 'せい'
      }
    ],
    jlpt_level: 'N5',
    tags: ['education', 'people'],
    stroke_count: 16
  },
  {
    word: '食べる',
    kanji: '食べる',
    hiragana: 'たべる',
    katakana: null,
    meanings: [
      {
        type: 'verb',
        definition: 'to eat',
        tags: ['ichidan verb', 'transitive']
      }
    ],
    examples: [
      {
        japanese: '朝ごはんを食べました。',
        reading: 'あさごはんをたべました。',
        meaning: 'I ate breakfast.'
      },
      {
        japanese: '一緒に食べましょう。',
        reading: 'いっしょにたべましょう。',
        meaning: "Let's eat together."
      }
    ],
    components: [
      {
        kanji: '食',
        meaning: 'eat, food',
        reading: 'た'
      }
    ],
    jlpt_level: 'N5',
    tags: ['daily life', 'verb'],
    stroke_count: 9
  }
]

async function seedVocabulary() {
  try {
    // Insert sample vocabulary
    for (const vocab of sampleVocabulary) {
      await pool.query(
        `
        INSERT INTO vocabulary (
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
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `,
        [
          vocab.word,
          vocab.kanji,
          vocab.hiragana,
          vocab.katakana,
          JSON.stringify(vocab.meanings),
          JSON.stringify(vocab.examples),
          JSON.stringify(vocab.components),
          vocab.jlpt_level,
          vocab.tags,
          vocab.stroke_count
        ]
      )
    }

    console.log('Sample vocabulary data inserted successfully!')
  } catch (error) {
    console.error('Error seeding vocabulary:', error)
  } finally {
    await pool.end()
  }
}

seedVocabulary()