import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

interface Clip {
  id: string
  title: string
  videoUrl: string
  thumbnailUrl: string
  duration: number
  startTime: number
  endTime: number
  createdAt: string
  status: 'processing' | 'completed' | 'failed'
}

const dbPath = path.join(process.cwd(), 'data', 'clips.db')

// Ensure data directory exists
const dataDir = path.dirname(dbPath)
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

export function createDb(): Database.Database {
  const db = new Database(dbPath)
  db.pragma('journal_mode = WAL')

  db.exec(`
    CREATE TABLE IF NOT EXISTS clips (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      videoUrl TEXT NOT NULL,
      thumbnailUrl TEXT,
      duration REAL NOT NULL,
      startTime REAL NOT NULL,
      endTime REAL NOT NULL,
      createdAt TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'processing',
      updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)

  return db
}

export function getAllClips(db: Database.Database): Clip[] {
  const stmt = db.prepare('SELECT * FROM clips ORDER BY createdAt DESC')
  return stmt.all() as Clip[]
}

export function saveClip(db: Database.Database, clip: Clip): void {
  const stmt = db.prepare(`
    INSERT INTO clips (id, title, videoUrl, thumbnailUrl, duration, startTime, endTime, createdAt, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  stmt.run(
    clip.id,
    clip.title,
    clip.videoUrl,
    clip.thumbnailUrl,
    clip.duration,
    clip.startTime,
    clip.endTime,
    clip.createdAt,
    clip.status
  )
}

export function updateClipStatus(db: Database.Database, id: string, status: string): void {
  const stmt = db.prepare(`
    UPDATE clips SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?
  `)
  stmt.run(status, id)
}

export function deleteClip(db: Database.Database, id: string): void {
  const stmt = db.prepare('DELETE FROM clips WHERE id = ?')
  stmt.run(id)
}

export function getClip(db: Database.Database, id: string): Clip | undefined {
  const stmt = db.prepare('SELECT * FROM clips WHERE id = ?')
  return stmt.get(id) as Clip | undefined
}
