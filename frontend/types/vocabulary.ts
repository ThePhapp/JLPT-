export interface Example {
  japanese: string
  reading: string
  meaning: string
}

export interface KanjiComponent {
  kanji: string
  meaning: string
  reading: string
}

export interface Meaning {
  definition: string
  type: string // e.g., 'noun', 'verb', 'adjective'
  tags?: string[] // e.g., 'formal', 'colloquial', 'honorific'
}

export interface VocabularyWord {
  id: number
  word: string
  kanji: string | null
  hiragana: string | null
  katakana: string | null
  meanings: Meaning[]
  examples: Example[]
  components: KanjiComponent[]
  jlpt_level: string
  tags: string[]
  stroke_count?: number
  created_at: string
  updated_at: string
}

export interface StudyProgress {
  wordId: number
  status: 'learning' | 'reviewing' | 'mastered'
  lastReviewed: string
  nextReview: string
  repetitions: number
  easeFactor: number
  interval: number
}

export interface ReviewSession {
  date: string
  correctCount: number
  incorrectCount: number
  words: {
    wordId: number
    correct: boolean
    timeTaken: number
  }[]
}