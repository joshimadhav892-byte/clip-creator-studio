import ffmpeg from 'fluent-ffmpeg'
import path from 'path'
import fs from 'fs'

const ffmpegPath = process.env.FFMPEG_PATH || 'ffmpeg'
const ffprobePath = process.env.FFPROBE_PATH || 'ffprobe'

ffmpeg.setFfmpegPath(ffmpegPath)
ffmpeg.setFfprobePath(ffprobePath)

export function processVideo(inputPath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const outputDir = path.join(path.dirname(inputPath), 'processed')
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    const filename = path.basename(inputPath, path.extname(inputPath))
    const outputPath = path.join(outputDir, `${filename}-processed.mp4`)

    ffmpeg(inputPath)
      .output(outputPath)
      .withVideoCodec('libx264')
      .withAudioCodec('aac')
      .withVideoFilter('scale=1280:-1')
      .withFps(30)
      .on('start', () => {
        console.log(`Processing video: ${filename}`)
      })
      .on('end', () => {
        console.log(`✓ Video processed: ${filename}`)
        resolve(outputPath)
      })
      .on('error', (err) => {
        console.error(`✗ Error processing video: ${filename}`, err)
        reject(err)
      })
      .run()
  })
}

export function generateThumbnail(videoPath: string, time: number = 5): Promise<string> {
  return new Promise((resolve, reject) => {
    const outputDir = path.join(path.dirname(videoPath), 'thumbnails')
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    const filename = path.basename(videoPath, path.extname(videoPath))
    const thumbnailPath = path.join(outputDir, `${filename}-thumb.jpg`)

    ffmpeg(videoPath)
      .on('end', () => {
        console.log(`✓ Thumbnail generated: ${filename}`)
        resolve(thumbnailPath)
      })
      .on('error', (err) => {
        console.error(`✗ Error generating thumbnail: ${filename}`, err)
        reject(err)
      })
      .seek(time)
      .output(thumbnailPath)
      .withFrames(1)
      .run()
  })
}

export function createClip(inputPath: string, startTime: number, endTime: number, outputName: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const outputDir = path.join(path.dirname(inputPath), 'clips')
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    const outputPath = path.join(outputDir, `${outputName}.mp4`)
    const duration = endTime - startTime

    ffmpeg(inputPath)
      .setStartTime(startTime)
      .duration(duration)
      .output(outputPath)
      .withVideoCodec('libx264')
      .withAudioCodec('aac')
      .withVideoFilter('scale=1280:-1')
      .withFps(30)
      .on('end', () => {
        console.log(`✓ Clip created: ${outputName}`)
        resolve(outputPath)
      })
      .on('error', (err) => {
        console.error(`✗ Error creating clip: ${outputName}`, err)
        reject(err)
      })
      .run()
  })
}
