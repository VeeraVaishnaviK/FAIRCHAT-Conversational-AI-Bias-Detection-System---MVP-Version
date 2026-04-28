import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/chat', label: 'Chat', icon: '💬' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300">
      <div className="mx-auto px-4 sm:px-8 max-w-7xl">
        <div className="mt-4 glass-panel rounded-[24px] px-6 lg:px-10 h-20 flex items-center justify-between shadow-glow">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 no-underline group">
            <div className="w-10 h-10 rounded-[14px] flex items-center justify-center text-xl transition-transform duration-300 group-hover:scale-110" style={{
              background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
            }}>
              ⚖️
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter leading-none">
                FAIR<span className="text-primary italic">CHAT</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40 mt-1">Intelligence</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map(({ to, label, icon }) => {
              const isActive = location.pathname === to
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2.5 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest no-underline transition-all duration-300 ${
                    isActive ? 'bg-primary/10 text-primary border border-primary/20' : 'text-secondary hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <span className="opacity-70">{icon}</span>
                  {label}
                </Link>
              )
            })}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col items-center justify-center w-12 h-12 rounded-2xl bg-white/5 border border-white/5"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <div className="w-6 space-y-1.5">
              <div className={`h-0.5 bg-white rounded-full transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <div className={`h-0.5 bg-white rounded-full transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
              <div className={`h-0.5 bg-white rounded-full transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden mt-2 px-4 animate-fade-in">
          <div className="glass-panel rounded-[24px] p-4 space-y-2 shadow-glow-lg border-primary/10">
            {navLinks.map(({ to, label, icon }) => {
              const isActive = location.pathname === to
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold uppercase tracking-widest no-underline transition-all ${
                    isActive ? 'bg-primary/10 text-primary border border-primary/20' : 'text-secondary'
                  }`}
                >
                  <span className="text-xl">{icon}</span>
                  {label}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </nav>
  )
}
