/* eslint-disable @typescript-eslint/no-var-requires */
exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.createTable('vocab', {
    id: { type: 'serial', primaryKey: true },
    word: { type: 'text', notNull: true },
    reading: { type: 'text' },
    meaning: { type: 'text' },
    jlpt_level: { type: 'text' }
  })

  pgm.sql("INSERT INTO vocab (word, reading, meaning, jlpt_level) VALUES ('猫','ねこ','cat','N5'), ('勉強','べんきょう','study','N5');")
}

exports.down = (pgm) => {
  pgm.dropTable('vocab')
}
