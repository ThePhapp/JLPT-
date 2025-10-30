const dotenv = require('dotenv')
const { Client } = require('pg')
const path = require('path')

dotenv.config({ path: path.resolve(__dirname, '../.env') })

async function run() {
  const client = new Client({
    host: process.env.POSTGRES_HOST || 'localhost',
    port: Number(process.env.POSTGRES_PORT || 5432),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  })
  await client.connect()
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS vocab (
        id SERIAL PRIMARY KEY,
        word TEXT NOT NULL,
        reading TEXT,
        meaning TEXT,
        jlpt_level TEXT
      );
    `)
    const res = await client.query('SELECT count(*)::int as cnt FROM vocab')
    const cnt = res.rows?.[0]?.cnt || 0
    if (cnt === 0) {
      await client.query(`INSERT INTO vocab (word, reading, meaning, jlpt_level) VALUES ($1,$2,$3,$4),($5,$6,$7,$8)` , ['猫','ねこ','cat','N5','勉強','べんきょう','study','N5'])
      console.log('Seeded vocab table')
    } else {
      console.log('Vocab table already has rows, skipping seed')
    }
  } catch (err) {
    console.error('Seed failed', err)
    process.exitCode = 1
  } finally {
    await client.end()
  }
}

run()
