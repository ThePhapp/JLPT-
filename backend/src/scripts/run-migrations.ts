import dotenv from 'dotenv'
import { runMigrations } from 'node-pg-migrate'
import path from 'node:path'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

const databaseUrl = `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`

async function migrate() {
  try {
    await runMigrations({
      databaseUrl: databaseUrl,
      migrationsTable: 'pgmigrations',
      dir: 'src/migrations',
      direction: 'up',
      verbose: true,
      logger: console.log
    })
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

migrate()