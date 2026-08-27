import { useEffect } from 'react'
import { FiPlay, FiTrash2, FiDownload, FiPlus, FiFilm } from 'react-icons/fi'
import { useClipStore } from '../store/clipStore'
import toast from 'react-hot-toast'

interface DashboardProps {
  onCreateNew: () => void
}

export default function Dashboard({ onCreateNew }: DashboardProps) {
  const { clips, loading, loadClips, deleteClip } = useClipStore()

  useEffect(() => {
    loadClips()
  }, [])

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this clip?')) {
      deleteClip(id)
      toast.success('Clip deleted successfully')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Your Clips</h2>
          <p className="text-slate-400">Manage and organize your video clips</p>
        </div>
        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all font-semibold"
        >
          <FiPlus className="w-5 h-5" />
          Create New Clip
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : clips.length === 0 ? (
        <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-12 text-center">
          <FiFilm className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-300 mb-2">No clips yet</h3>
          <p className="text-slate-400 mb-6">Create your first video clip to get started</p>
          <button
            onClick={onCreateNew}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all"
          >
            Create Clip
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clips.map((clip) => (
            <div
              key={clip.id}
              className="bg-slate-800 rounded-lg overflow-hidden hover:shadow-lg transition-all group cursor-pointer"
            >
              <div className="relative overflow-hidden bg-slate-900 h-40">
                {clip.thumbnailUrl && (
                  <img
                    src={clip.thumbnailUrl}
                    alt={clip.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                )}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-center justify-center">
                  <FiPlay className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-2 truncate">{clip.title}</h3>
                <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                  <span>{clip.duration.toFixed(1)}s</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    clip.status === 'completed'
                      ? 'bg-green-900 text-green-200'
                      : clip.status === 'processing'
                      ? 'bg-yellow-900 text-yellow-200'
                      : 'bg-red-900 text-red-200'
                  }`}>
                    {clip.status}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded transition-all">
                    <FiDownload className="w-4 h-4" />
                    Download
                  </button>
                  <button
                    onClick={() => handleDelete(clip.id)}
                    className="flex items-center justify-center gap-2 bg-red-900/30 hover:bg-red-900/60 text-red-300 py-2 px-4 rounded transition-all"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
