import React, { useState, useCallback, useEffect } from 'react';
import { searchMaziiWord, getKanjiDetails } from '@/utils/maziiScraper';
import debounce from 'lodash/debounce';
import { FiSearch, FiVolume2 } from 'react-icons/fi';

interface KanjiDetail {
  kanji: string;
  mean: string;
  kun: string;
  on: string;
  strokes: number;
  components?: string[];
}

interface WordResult {
  word: string;
  reading: string;
  meanings: string[];
  examples?: Array<{
    japanese: string;
    vietnamese: string;
  }>;
}

export default function MaziiStyle() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<WordResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedWord, setSelectedWord] = useState<WordResult | null>(null);
  const [kanjiDetails, setKanjiDetails] = useState<Record<string, KanjiDetail>>({});

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (term: string) => {
      if (!term) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const words = await searchMaziiWord(term) as WordResult[];
        setResults(words);

        // Fetch kanji details for any kanji in the results
        const kanjiSet = new Set<string>();
        for (const word of words) {
          if (word.word) {
            for (const char of word.word) {
              if (/[\u4e00-\u9faf]/.test(char)) {
                kanjiSet.add(char);
              }
            }
          }
        }

        const kanjiDetailsMap: Record<string, KanjiDetail> = {};
        for (const kanji of kanjiSet) {
          try {
            const details = await getKanjiDetails(kanji) as KanjiDetail;
            kanjiDetailsMap[kanji] = details;
          } catch (error) {
            console.error(`Error fetching details for kanji ${kanji}:`, error);
          }
        }
        setKanjiDetails(kanjiDetailsMap);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, debouncedSearch]);

  const playAudio = async (word: string) => {
    try {
      const audio = new Audio(`https://mazii.net/audio/${word}.mp3`);
      await audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const renderResults = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      );
    }

    if (results.length > 0) {
      return results.map((word) => (
        <button
          key={`word-${word.word}-${word.reading}`}
          className={`w-full text-left p-4 bg-white dark:bg-gray-800 rounded-lg shadow transition-colors ${
            selectedWord === word ? 'ring-2 ring-indigo-500' : ''
          }`}
          onClick={() => setSelectedWord(word)}
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {word.word}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {word.reading}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                playAudio(word.word);
              }}
              aria-label="Phát âm"
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <FiVolume2 className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            {word.meanings.map((meaning, meaningIndex) => (
              <div key={`${word.word}-meaning-${meaningIndex}`} className="mb-1">
                {meaning}
              </div>
            ))}
          </div>
        </button>
      ));
    }

    if (searchTerm && !loading) {
      return (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Không tìm thấy kết quả
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Search Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Tìm từ vựng..."
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Results List */}
          <div className="space-y-4">
            {renderResults()}
          </div>

          {/* Word Details */}
          {selectedWord && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedWord.word}
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    {selectedWord.reading}
                  </p>
                </div>
                <button
                  onClick={() => playAudio(selectedWord.word)}
                  aria-label="Phát âm"
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <FiVolume2 className="h-6 w-6" />
                </button>
              </div>

              {/* Meanings */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Ý nghĩa
                </h3>
                {selectedWord.meanings.map((meaning, meaningIndex) => (
                  <div
                    key={`${selectedWord.word}-detail-meaning-${meaningIndex}`}
                    className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    {meaning}
                  </div>
                ))}
              </div>

              {/* Kanji Analysis */}
              {selectedWord.word && /[\u4e00-\u9faf]/.test(selectedWord.word) && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Phân tích Kanji
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[...selectedWord.word]
                      .filter((char) => /[\u4e00-\u9faf]/.test(char))
                      .map((char) => (
                        <div
                          key={`${selectedWord.word}-kanji-${char}`}
                          className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                        >
                          <div className="text-2xl mb-2 text-gray-900 dark:text-white">
                            {char}
                          </div>
                          {kanjiDetails[char] && (
                            <>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Nghĩa: {kanjiDetails[char].mean}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Âm Kun: {kanjiDetails[char].kun}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Âm On: {kanjiDetails[char].on}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Số nét: {kanjiDetails[char].strokes}
                              </p>
                            </>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Examples */}
              {selectedWord.examples && selectedWord.examples.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Ví dụ
                  </h3>
                  {selectedWord.examples.map((example, exampleIndex) => (
                    <div
                      key={`${selectedWord.word}-example-${exampleIndex}`}
                      className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-2"
                    >
                      <p className="text-gray-900 dark:text-white">
                        {example.japanese}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">
                        {example.vietnamese}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MaziiStyle() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<WordResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedWord, setSelectedWord] = useState<WordResult | null>(null);
  const [kanjiDetails, setKanjiDetails] = useState<Record<string, KanjiDetail>>({});

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (term: string) => {
      if (!term) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const words = await searchMaziiWord(term) as WordResult[];
        setResults(words);

        // Fetch kanji details for any kanji in the results
        const kanjiSet = new Set<string>();
        for (const word of words) {
          if (word.word) {
            for (const char of [...word.word]) {
              if (/[\u4e00-\u9faf]/.test(char)) {
                kanjiSet.add(char);
              }
            }
          }
        }

        const kanjiDetailsMap: Record<string, KanjiDetail> = {};
        for (const kanji of kanjiSet) {
          try {
            const details = await getKanjiDetails(kanji) as KanjiDetail;
            kanjiDetailsMap[kanji] = details;
          } catch (error) {
            console.error(`Error fetching details for kanji ${kanji}:`, error);
          }
        }
        setKanjiDetails(kanjiDetailsMap);

      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, debouncedSearch]);

  const playAudio = async (word: string) => {
    try {
      const audio = new Audio(`https://mazii.net/audio/${word}.mp3`);
      await audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const renderResults = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      );
    }

    if (results.length > 0) {
      return results.map((word) => (
        <button
          key={`word-${word.word}-${word.reading}`}
          className={`w-full text-left p-4 bg-white dark:bg-gray-800 rounded-lg shadow transition-colors ${
            selectedWord === word ? 'ring-2 ring-indigo-500' : ''
          }`}
          onClick={() => setSelectedWord(word)}
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {word.word}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {word.reading}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                playAudio(word.word);
              }}
              aria-label="Phát âm"
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <FiVolume2 className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            {word.meanings.map((meaning, meaningIndex) => (
              <div key={`${word.word}-meaning-${meaningIndex}`} className="mb-1">
                {meaning}
              </div>
            ))}
          </div>
        </button>
      ));
    }

    if (searchTerm && !loading) {
      return (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Không tìm thấy kết quả
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Search Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Tìm từ vựng..."
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Results List */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
              </div>
            ) : results.length > 0 ? (
              results.map((word, index) => (
                <div
                  key={index}
                  className={`p-4 bg-white dark:bg-gray-800 rounded-lg shadow cursor-pointer transition-colors ${
                    selectedWord === word ? 'ring-2 ring-indigo-500' : ''
                  }`}
                  onClick={() => setSelectedWord(word)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {word.word}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {word.reading}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playAudio(word.word);
                      }}
                      className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                    >
                      <FiVolume2 className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                    {word.meanings.map((meaning: string, i: number) => (
                      <div key={i} className="mb-1">
                        {meaning}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : searchTerm && !loading ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                Không tìm thấy kết quả
              </div>
            ) : null}
          </div>

          {/* Word Details */}
          {selectedWord && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedWord.word}
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    {selectedWord.reading}
                  </p>
                </div>
                <button
                  onClick={() => playAudio(selectedWord.word)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <FiVolume2 className="h-6 w-6" />
                </button>
              </div>

              {/* Meanings */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Ý nghĩa
                </h3>
                {selectedWord.meanings.map((meaning: string, i: number) => (
                  <div
                    key={i}
                    className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    {meaning}
                  </div>
                ))}
              </div>

              {/* Kanji Analysis */}
              {selectedWord.word && /[\u4e00-\u9faf]/.test(selectedWord.word) && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Phân tích Kanji
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[...selectedWord.word].map(
                      (char: string, i: number) =>
                        /[\u4e00-\u9faf]/.test(char) && (
                          <div
                            key={i}
                            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                          >
                            <div className="text-2xl mb-2 text-gray-900 dark:text-white">
                              {char}
                            </div>
                            {kanjiDetails[char] && (
                              <>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Nghĩa: {kanjiDetails[char].mean}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Âm Kun: {kanjiDetails[char].kun}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Âm On: {kanjiDetails[char].on}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Số nét: {kanjiDetails[char].strokes}
                                </p>
                              </>
                            )}
                          </div>
                        )
                    )}
                  </div>
                </div>
              )}

              {/* Examples */}
              {selectedWord.examples && selectedWord.examples.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Ví dụ
                  </h3>
                  {selectedWord.examples.map((example: any, i: number) => (
                    <div
                      key={i}
                      className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-2"
                    >
                      <p className="text-gray-900 dark:text-white">
                        {example.japanese}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">
                        {example.vietnamese}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}