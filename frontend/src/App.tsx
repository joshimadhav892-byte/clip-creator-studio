import { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import Dashboard from './pages/Dashboard'
import ClipEditor from './pages/ClipEditor'
import Header from './components/Header'
import { useClipStore } from './store/clipStore'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'editor'>('dashboard')
  const { clips, loadClips } = useClipStore()

  useEffect(() => {
    loadClips()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      
      <main className="pt-20 pb-10">
        {currentPage === 'dashboard' ? (
          <Dashboard onCreateNew={() => setCurrentPage('editor')} />
        ) : (
          <ClipEditor onBack={() => setCurrentPage('dashboard')} />
        )}
      </main>

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid #334155'
          }
        }}
      />
    </div>
  )
}

export default App
