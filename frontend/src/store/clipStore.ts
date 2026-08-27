import { create } from 'zustand'
import axios from 'axios'

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

interface ClipStore {
  clips: Clip[]
  loading: boolean
  error: string | null
  loadClips: () => Promise<void>
  addClip: (clip: Clip) => void
  updateClip: (id: string, updates: Partial<Clip>) => void
  deleteClip: (id: string) => void
  uploadVideo: (file: File) => Promise<string>
}

export const useClipStore = create<ClipStore>((set) => ({
  clips: [],
  loading: false,
  error: null,

  loadClips: async () => {
    set({ loading: true })
    try {
      const response = await axios.get('/api/clips')
      set({ clips: response.data, error: null })
    } catch (error) {
      set({ error: 'Failed to load clips' })
    } finally {
      set({ loading: false })
    }
  },

  addClip: (clip) => {
    set((state) => ({ clips: [clip, ...state.clips] }))
  },

  updateClip: (id, updates) => {
    set((state) => ({
      clips: state.clips.map((clip) =>
        clip.id === id ? { ...clip, ...updates } : clip
      ),
    }))
  },

  deleteClip: async (id) => {
    set((state) => ({
      clips: state.clips.filter((clip) => clip.id !== id),
    }))
    try {
      await axios.delete(`/api/clips/${id}`)
    } catch (error) {
      console.error('Failed to delete clip', error)
    }
  },

  uploadVideo: async (file) => {
    const formData = new FormData()
    formData.append('video', file)
    const response = await axios.post('/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data.videoUrl
  },
}))
