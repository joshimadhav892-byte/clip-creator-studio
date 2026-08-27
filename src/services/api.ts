import axios from 'axios'
import { Video, Clip } from '../store/videoStore'

const API = axios.create({
  baseURL: '/api'
})

export const videoAPI = {
  // Upload video
  uploadVideo: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await API.post<Video>('/videos/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  // Get all videos
  getVideos: async () => {
    const response = await API.get<Video[]>('/videos')
    return response.data
  },

  // Get video by ID
  getVideo: async (id: string) => {
    const response = await API.get<Video>(`/videos/${id}`)
    return response.data
  },

  // Delete video
  deleteVideo: async (id: string) => {
    await API.delete(`/videos/${id}`)
  },

  // Create clip
  createClip: async (videoId: string, clipData: {
    title: string
    startTime: number
    endTime: number
    format: 'mp4' | 'webm' | 'gif'
  }) => {
    const response = await API.post<Clip>(`/videos/${videoId}/clips`, clipData)
    return response.data
  },

  // Get clips for video
  getClips: async (videoId: string) => {
    const response = await API.get<Clip[]>(`/videos/${videoId}/clips`)
    return response.data
  },

  // Get clip status
  getClipStatus: async (clipId: string) => {
    const response = await API.get<Clip>(`/clips/${clipId}`)
    return response.data
  },

  // Download clip
  downloadClip: async (clipId: string) => {
    const response = await API.get(`/clips/${clipId}/download`, {
      responseType: 'blob'
    })
    return response.data
  }
}
