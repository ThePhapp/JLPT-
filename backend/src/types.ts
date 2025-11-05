// src/types.ts
export interface Meaning {
  type: string
  definition: string
}

export interface Example {
  japanese: string
  meaning: string
}

export interface Vocabulary {
  id?: number
  word: string
  kanji: string
  hiragana: string
  meanings: Meaning[]
  examples: Example[]
  jlpt_level: string
}
