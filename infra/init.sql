CREATE TABLE IF NOT EXISTS vocab (
  id SERIAL PRIMARY KEY,
  word TEXT NOT NULL,
  reading TEXT,
  meaning TEXT,
  jlpt_level TEXT
);

INSERT INTO vocab (word, reading, meaning, jlpt_level) VALUES
('猫', 'ねこ', 'cat', 'N5'),
('勉強', 'べんきょう', 'study', 'N5');
