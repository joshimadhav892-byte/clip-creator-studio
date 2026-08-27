import { useState, useRef, useEffect } from 'react'
import { FiUpload, FiArrowLeft, FiCheck } from 'react-icons/fi'
import { useClipStore } from '../store/clipStore'
import toast from 'react-hot-toast'

interface ClipEditorProps {
  onBack: () => void
}

export default function ClipEditor({ onBack }: ClipEditorProps) {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState<string>('')
  const [title, setTitle] = useState('')
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [uploading, setUploading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { uploadVideo, addClip } = useClipStore()

  const handleVideoSelect = async (file: File) => {
    setVideoFile(file)
    const url = URL.createObjectURL(file)
    setVideoUrl(url)
    toast.success('Video selected')
  }

  const handleVideoDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file?.type.startsWith('video/')) {
      handleVideoSelect(file)
    } else {
      toast.error('Please drop a video file')
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const vid = videoRef.current.duration
      setDuration(vid)
      setEndTime(vid)
    }
  }

  const handleCreateClip = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title')
      return
    }

    if (startTime >= endTime) {
      toast.error('Start time must be before end time')
      return
    }

    setUploading(true)
    try {
      if (videoFile) {
        const uploadedUrl = await uploadVideo(videoFile)

        const newClip = {
          id: Date.now().toString(),
          title,
          videoUrl: uploadedUrl,
          thumbnailUrl: uploadedUrl,
          duration: endTime - startTime,
          startTime,
          endTime,
          createdAt: new Date().toISOString(),
          status: 'processing' as const,
        }

        addClip(newClip)
        toast.success('Clip created and processing!')
        onBack()
      }
    } catch (error) {
      toast.error('Failed to create clip')
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <FiArrowLeft className="w-5 h-5" />
        Back to Dashboard
      </button>

      <div className="bg-slate-800 rounded-lg border border-slate-700 p-8">
        <h2 className="text-3xl font-bold text-white mb-8">Create New Clip</h2>

        {/* Video Upload Section */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-slate-300 mb-3">Upload Video</label>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleVideoDrop}
            className="border-2 border-dashed border-slate-600 hover:border-blue-500 rounded-lg p-8 text-center cursor-pointer transition-colors"
          >
            <input
              type="file"
              accept="video/*"
              onChange={(e) => e.target.files?.[0] && handleVideoSelect(e.target.files[0])}
              className="hidden"
              id="video-input"
            />
            <label htmlFor="video-input" className="cursor-pointer">
              <FiUpload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-white font-semibold mb-1">Drop your video here or click to upload</p>
              <p className="text-slate-400 text-sm">Supported formats: MP4, WebM, Ogg</p>
            </label>
          </div>
          {videoFile && (
            <p className="text-green-400 text-sm mt-2 flex items-center gap-2">
              <FiCheck className="w-4 h-4" />
              {videoFile.name}
            </p>
          )}
        </div>

        {/* Video Preview */}
        {videoUrl && (
          <div className="mb-8">
            <label className="block text-sm font-semibold text-slate-300 mb-3">Preview</label>
            <video
              ref={videoRef}
              src={videoUrl}
              onLoadedMetadata={handleLoadedMetadata}
              controls
              className="w-full rounded-lg bg-black"
            />
          </div>
        )}

        {/* Clip Details */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-slate-300 mb-3">Clip Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Funny moment from stream"
            className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Time Range Selection */}
        {duration > 0 && (
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">
                Start Time (seconds)
              </label>
              <input
                type="number"
                value={startTime}
                onChange={(e) => setStartTime(Math.max(0, parseFloat(e.target.value)))}
                min="0"
                max={endTime - 1}
                step="0.1"
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">
                End Time (seconds)
              </label>
              <input
                type="number"
                value={endTime}
                onChange={(e) => setEndTime(Math.min(duration, parseFloat(e.target.value)))}
                min={startTime + 1}
                max={duration}
                step="0.1"
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        )}

        {/* Clip Duration Display */}
        {duration > 0 && (
          <div className="bg-slate-700/50 rounded-lg p-4 mb-8">
            <p className="text-slate-300">
              <span className="font-semibold">Final Clip Duration:</span>{' '}
              <span className="text-blue-400 font-semibold">{(endTime - startTime).toFixed(1)}s</span>
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onBack}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg transition-all font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateClip}
            disabled={!videoFile || !title || uploading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-all font-semibold flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                Processing...
              </>
            ) : (
              <>
                <FiCheck className="w-5 h-5" />
                Create Clip
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
