'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authAPI } from '@/lib/auth'
import toast from 'react-hot-toast'
import { Cat } from 'lucide-react'
import { Navbar } from '@/components/Navbar'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loginData, setLoginData] = useState({ email: '', password: '' })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await authAPI.login(loginData)
      const { user, token } = response.data
      
      authAPI.setCurrentUser(user, token)
      toast.success(`¡Bienvenido/a ${user.name}!`)
      
      router.push(user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al iniciar sesión'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Cat className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Iniciar Sesión</h1>
            <p className="text-slate-600">Accede a tu cuenta de PeluPet</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Contraseña</label>
                <input
                  type="password"
                  required
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                ¿No tienes cuenta?{' '}
                <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                  Regístrate
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
