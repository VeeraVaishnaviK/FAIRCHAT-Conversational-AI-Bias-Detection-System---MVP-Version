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
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4 sm:px-6 pointer-events-none">
      <nav className="max-w-6xl mx-auto glass-card flex items-center justify-between h-14 sm:h-16 px-4 sm:px-8 pointer-events-auto shadow-2xl" style={{
        borderRadius: 'var(--radius-full)',
        background: 'rgba(10, 14, 26, 0.7)',
      }}>
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group no-underline">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base transition-transform duration-300 group-hover:scale-110" style={{
            background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
          }}>
            ⚖️
          </div>
          <span className="text-lg font-bold gradient-text tracking-tight">
            FAIRCHAT
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1.5">
          {navLinks.map(({ to, label, icon }) => {
            const isActive = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-semibold no-underline transition-all duration-300"
                style={{
                  color: isActive ? '#ffffff' : '#94a3b8',
                  background: isActive ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'transparent',
                  boxShadow: isActive ? '0 4px 15px rgba(99, 102, 241, 0.3)' : 'none',
                }}
              >
                <span style={{ fontSize: '1.2em' }}>{icon}</span>
                {label}
              </Link>
            )
          })}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 rounded-full"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          <div className="w-5 h-0.5 rounded-full transition-all duration-300" style={{
            background: '#94a3b8',
            transform: mobileOpen ? 'rotate(45deg) translateY(6px)' : 'none',
          }} />
          <div className="w-5 h-0.5 rounded-full transition-all duration-300" style={{
            background: '#94a3b8',
            opacity: mobileOpen ? 0 : 1,
          }} />
          <div className="w-5 h-0.5 rounded-full transition-all duration-300" style={{
            background: '#94a3b8',
            transform: mobileOpen ? 'rotate(-45deg) translateY(-6px)' : 'none',
          }} />
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="md:hidden mt-3 max-w-6xl mx-auto glass-card animate-fade-in pointer-events-auto p-2" style={{
          borderRadius: 'var(--radius-xl)',
          background: 'rgba(10, 14, 26, 0.95)',
        }}>
          <div className="space-y-1">
            {navLinks.map(({ to, label, icon }) => {
              const isActive = location.pathname === to
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-semibold no-underline transition-all"
                  style={{
                    color: isActive ? '#ffffff' : '#94a3b8',
                    background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                  }}
                >
                  <span className="text-xl">{icon}</span>
                  {label}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </header>
  )
}
