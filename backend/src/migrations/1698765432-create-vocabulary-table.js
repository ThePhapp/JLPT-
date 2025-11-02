/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  // Create the vocabulary table
  pgm.createTable('vocabulary', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    word: {
      type: 'text',
      notNull: true,
    },
    kanji: {
      type: 'text',
      notNull: false,
    },
    hiragana: {
      type: 'text',
      notNull: false,
    },
    katakana: {
      type: 'text',
      notNull: false,
    },
    meanings: {
      type: 'jsonb',
      notNull: true,
      default: '[]',
    },
    examples: {
      type: 'jsonb',
      notNull: true,
      default: '[]',
    },
    components: {
      type: 'jsonb',
      notNull: true,
      default: '[]',
    },
    jlpt_level: {
      type: 'text',
      notNull: true,
    },
    tags: {
      type: 'text[]',
      notNull: true,
      default: '{}',
    },
    stroke_count: {
      type: 'integer',
      notNull: false,
    },
    created_at: {
      type: 'timestamp with time zone',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp with time zone',
      notNull: true,
      default: pgm.func('current_timestamp'),
    }
  });

  // Create indexes
  pgm.createIndex('vocabulary', 'jlpt_level');
  pgm.createIndex('vocabulary', 'tags', { method: 'gin' });
  pgm.createIndex('vocabulary', ['word', 'kanji', 'hiragana', 'katakana'], { 
    name: 'vocabulary_search_idx'
  });

  // Create updated_at trigger
  pgm.createFunction(
    'update_updated_at_column',
    [],
    {
      returns: 'trigger',
      language: 'plpgsql',
      replace: true,
    },
    `
    BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    `
  );

  pgm.createTrigger('vocabulary', 'update_updated_at_trigger', {
    when: 'BEFORE',
    operation: 'UPDATE',
    level: 'ROW',
    function: 'update_updated_at_column',
  });
};

exports.down = pgm => {
  pgm.dropTrigger('vocabulary', 'update_updated_at_trigger');
  pgm.dropFunction('update_updated_at_column', []);
  pgm.dropTable('vocabulary');
};