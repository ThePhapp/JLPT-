// src/scripts/crawlMazzi.ts
import axios from 'axios'
import { insertVocabulary } from '../models/vocabulary'
import { Vocabulary } from '../types'
import { pool } from '../config/db'

async function crawlWord(word: string): Promise<Vocabulary | null> {
  const url = `https://mazii.net/api/search?q=${encodeURIComponent(word)}&type=word&dict=jpen`
  const { data } = await axios.get(url)

  if (!data?.data?.length) return null
  const item = data.data[0]

  const vocab: Vocabulary = {
    word: item.word,
    kanji: item.word,
    hiragana: item.kana,
    meanings: [{ type: 'general', definition: item.mean }],
    examples:
      item.example?.map((ex: any) => ({
        japanese: ex.japanese,
        meaning: ex.meaning
      })) || [],
    jlpt_level: item.level || 'N/A'
  }

  return vocab
}

async function seedFromMazzi() {
  const words = ['学生', '先生', '日本', '食べる']
  for (const w of words) {
    const vocab = await crawlWord(w)
    if (!vocab) {
      console.log(`⚠️ Không tìm thấy từ: ${w}`)
      continue
    }
    await insertVocabulary(vocab)
    console.log(`✅ Đã thêm: ${vocab.word}`)
  }
  await pool.end()
}

seedFromMazzi().catch(console.error)
