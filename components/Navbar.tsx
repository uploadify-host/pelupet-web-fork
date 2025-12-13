'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { Cat, User, LogOut, Calendar, LayoutDashboard, Settings, ChevronDown } from 'lucide-react'
import { authAPI } from '@/lib/auth'

export function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const currentUser = authAPI.getCurrentUser()
    setUser(currentUser)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    authAPI.setCurrentUser(null)
    setUser(null)
    setIsDropdownOpen(false)
    router.push('/')
  }

  const getMenuItems = (): Array<{
    icon: any
    label: string
    href?: string
    onClick?: () => void
    isDanger?: boolean
  }> => {
    if (!user) return []

    const commonItems = [
      { icon: Calendar, label: 'Agendar Cita', href: '/appointments' },
      { icon: LogOut, label: 'Cerrar Sesión', onClick: handleLogout, isDanger: true },
    ]

    // Si es admin, agregar opciones de admin
    if (user.role === 'admin') {
      return [
        { icon: LayoutDashboard, label: 'Dashboard Admin', href: '/dashboard' },
        { icon: Settings, label: 'Configuración', href: '/admin/settings' },
        ...commonItems,
      ]
    }

    // Usuario normal (cliente)
    return [
      { icon: LayoutDashboard, label: 'Mi Dashboard', href: '/dashboard' },
      ...commonItems,
    ]
  }

  return (
    <nav className="fixed top-0 w-full bg-white border-b border-slate-200 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <Cat className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">PeluPet</span>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user.name?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-slate-700 hidden md:inline">
                    {user.name}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-600 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-2">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm font-medium text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                      {user.role && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                          {user.role === 'admin' ? 'Administrador' : 'Cliente'}
                        </span>
                      )}
                    </div>
                    <div className="py-1">
                      {getMenuItems().map((item, index) => (
                        item.onClick ? (
                          <button
                            key={index}
                            onClick={item.onClick}
                            className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                              item.isDanger
                                ? 'text-red-600 hover:bg-red-50'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                          </button>
                        ) : (
                          <Link
                            key={index}
                            href={item.href!}
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                          </Link>
                        )
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-sm">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm">
                    Registrarse
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
