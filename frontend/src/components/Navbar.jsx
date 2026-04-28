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
    <nav className="fixed top-0 left-0 right-0 z-50" style={{
      background: 'rgba(10, 14, 26, 0.8)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 no-underline">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{
              background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
            }}>
              ⚖️
            </div>
            <span className="text-xl font-bold gradient-text tracking-tight">
              FAIRCHAT
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon }) => {
              const isActive = location.pathname === to
              return (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium no-underline transition-all duration-200"
                  style={{
                    color: isActive ? '#818cf8' : '#94a3b8',
                    background: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                    border: isActive ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid transparent',
                  }}
                >
                  <span>{icon}</span>
                  {label}
                </Link>
              )
            })}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            <span className="block w-5 h-0.5 rounded-full transition-all duration-300" style={{
              background: '#94a3b8',
              transform: mobileOpen ? 'rotate(45deg) translate(2px, 4px)' : 'none',
            }} />
            <span className="block w-5 h-0.5 rounded-full transition-all duration-300" style={{
              background: '#94a3b8',
              opacity: mobileOpen ? 0 : 1,
            }} />
            <span className="block w-5 h-0.5 rounded-full transition-all duration-300" style={{
              background: '#94a3b8',
              transform: mobileOpen ? 'rotate(-45deg) translate(2px, -4px)' : 'none',
            }} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden animate-fade-in" style={{
          background: 'rgba(10, 14, 26, 0.95)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(({ to, label, icon }) => {
              const isActive = location.pathname === to
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium no-underline transition-all"
                  style={{
                    color: isActive ? '#818cf8' : '#94a3b8',
                    background: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                  }}
                >
                  <span className="text-lg">{icon}</span>
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
