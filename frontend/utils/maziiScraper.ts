import axios from 'axios';

interface MaziiWord {
  word: string;
  reading: string;
  meanings: string[];
  examples: Array<{
    japanese: string;
    vietnamese: string;
  }>;
  kanji_parts?: Array<{
    kanji: string;
    meaning: string;
  }>;
}

interface MaziiResponse {
  status: number;
  data: Array<{
    word: string;
    phonetic?: string;
    reading?: string;
    means: string[];
    examples?: Array<{
      content?: string;
      japanese?: string;
      mean?: string;
      vietnamese?: string;
    }>;
  }>;
}

export async function searchMaziiWord(keyword: string): Promise<MaziiWord[]> {
  try {
    // Using Mazii's API
    const response = await axios.get<MaziiResponse>(
      `https://mazii.net/api/search?dictionary=javi&query=${encodeURIComponent(keyword)}&type=word`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Origin': 'https://mazii.net',
          'Referer': 'https://mazii.net/'
        }
      }
    );

    if (!response.data || !Array.isArray(response.data.data)) {
      throw new Error('Invalid response from Mazii');
    }

    return response.data.data.map(result => ({
      word: result.word,
      reading: result.phonetic || result.reading || result.word,
      meanings: Array.isArray(result.means) ? result.means : [result.means],
      examples: (result.examples || []).map(ex => ({
        japanese: ex.content || ex.japanese || '',
        vietnamese: ex.mean || ex.vietnamese || ''
      })),
      kanji_parts: [] // We'll add kanji analysis in a separate request
    }));

  } catch (error) {
    console.error('Error fetching from Mazii:', error);
    throw error;
  }
}

export async function getKanjiDetails(kanji: string) {
  try {
    const response = await axios.get(
      `https://mazii.net/api/kanji/${kanji}`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching kanji details:', error);
    throw error;
  }
}

export async function searchMaziiKanji(keyword: string) {
  try {
    const response = await axios.get(
      `https://mazii.net/api/kanji/search/${keyword}`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error searching kanji:', error);
    throw error;
  }
}