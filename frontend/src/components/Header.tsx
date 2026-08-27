import { FiFilm, FiHome, FiGithub } from 'react-icons/fi'

interface HeaderProps {
  currentPage: 'dashboard' | 'editor'
  onNavigate: (page: 'dashboard' | 'editor') => void
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-slate-900/95 backdrop-blur border-b border-slate-700 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
          <FiFilm className="w-8 h-8 text-blue-500" />
          <h1 className="text-2xl font-bold text-white">Clip Creator Studio</h1>
        </div>

        <nav className="flex items-center gap-8">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              currentPage === 'dashboard'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FiHome className="w-5 h-5" />
            Dashboard
          </button>

          <button
            onClick={() => onNavigate('editor')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              currentPage === 'editor'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FiFilm className="w-5 h-5" />
            Create Clip
          </button>

          <a
            href="https://github.com/joshimadhav892-byte/clip-creator-studio"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-white transition-colors"
          >
            <FiGithub className="w-5 h-5" />
          </a>
        </nav>
      </div>
    </header>
  )
}
