import express, { Express, Request, Response, NextFunction } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import cors from 'cors'
import { createDb, getAllClips, saveClip, deleteClip as dbDeleteClip } from './database'
import { processVideo } from './videoProcessor'
import { v4 as uuidv4 } from 'uuid'

const app: Express = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

// Setup upload directory
const uploadDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`
    cb(null, uniqueName)
  },
})

const upload = multer({ storage })

// Initialize database
const db = createDb()

// Routes
app.get('/clips', (req: Request, res: Response) => {
  try {
    const clips = getAllClips(db)
    res.json(clips)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch clips' })
  }
})

app.post('/upload', upload.single('video'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const videoPath = req.file.path
    const videoUrl = `/videos/${req.file.filename}`

    res.json({
      videoUrl,
      filename: req.file.filename,
      size: req.file.size,
    })

    // Process video in background
    processVideo(videoPath).catch(console.error)
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'Failed to upload video' })
  }
})

app.post('/clips', (req: Request, res: Response) => {
  try {
    const { title, videoUrl, thumbnailUrl, duration, startTime, endTime } = req.body

    const clip = {
      id: uuidv4(),
      title,
      videoUrl,
      thumbnailUrl,
      duration,
      startTime,
      endTime,
      createdAt: new Date().toISOString(),
      status: 'processing' as const,
    }

    saveClip(db, clip)
    res.status(201).json(clip)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create clip' })
  }
})

app.delete('/clips/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params
    dbDeleteClip(db, id)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete clip' })
  }
})

app.get('/videos/:filename', (req: Request, res: Response) => {
  try {
    const { filename } = req.params
    const filepath = path.join(uploadDir, filename)

    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: 'Video not found' })
    }

    const stat = fs.statSync(filepath)
    const range = req.headers.range

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-')
      const start = parseInt(parts[0], 10)
      const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1
      const chunksize = end - start + 1

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      })

      const stream = fs.createReadStream(filepath, { start, end })
      stream.pipe(res)
    } else {
      res.writeHead(200, {
        'Content-Length': stat.size,
        'Content-Type': 'video/mp4',
      })
      fs.createReadStream(filepath).pipe(res)
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to stream video' })
  }
})

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`🎬 Clip Creator Studio running on http://localhost:${PORT}`)
})
