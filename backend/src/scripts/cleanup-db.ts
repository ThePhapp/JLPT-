import { Pool } from 'pg'
import dotenv from 'dotenv'
import path from 'node:path'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

async function cleanup() {
  if (!process.env.POSTGRES_PASSWORD) {
    throw new Error('Database password not found in environment variables')
  }

  console.log('Connecting to database with config:', {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB
  })

  const pool = new Pool({
    connectionString: `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`
  })

  try {
    // Drop existing tables
    await pool.query('DROP TABLE IF EXISTS vocab CASCADE;')
    await pool.query('DROP TABLE IF EXISTS vocabulary CASCADE;')
    await pool.query('DROP TABLE IF EXISTS pgmigrations CASCADE;')
    
    console.log('Successfully cleaned up database')
  } catch (error) {
    console.error('Error cleaning up database:', error)
  } finally {
    await pool.end()
  }
}

cleanup()