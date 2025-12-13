'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authAPI } from '@/lib/auth'
import { customersAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import { PawPrint } from 'lucide-react'
import { Navbar } from '@/components/Navbar'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    password_confirmation: '',
    role: 'owner' as const
  })

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (registerData.password !== registerData.password_confirmation) {
      toast.error('Las contraseñas no coinciden')
      return
    }

    if (registerData.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)

    try {
      const customerData = {
        name: registerData.name,
        email: registerData.email,
        phone: registerData.phone,
        address: registerData.address
      }
      
      const customerResponse = await customersAPI.create(customerData)
      const customerId = customerResponse.data.id

      const userRegisterData = {
        ...registerData,
        customer_id: customerId
      }

      const response = await authAPI.register(userRegisterData)
      const { user, token } = response.data
      
      authAPI.setCurrentUser(user, token)
      toast.success(`¡Registro exitoso! Bienvenido/a ${user.name}`)
      
      router.push('/dashboard')
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al registrar usuario'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <PawPrint className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Crear Cuenta</h1>
            <p className="text-slate-600">Regístrate en PeluPet</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <form onSubmit={handleRegister} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Nombre completo</label>
                  <input
                    type="text"
                    required
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    placeholder="Juan Pérez"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Teléfono</label>
                  <input
                    type="tel"
                    required
                    value={registerData.phone}
                    onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    placeholder="123-456-7890"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Dirección</label>
                <input
                  type="text"
                  required
                  value={registerData.address}
                  onChange={(e) => setRegisterData({ ...registerData, address: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  placeholder="Calle Principal #123"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Contraseña</label>
                  <input
                    type="password"
                    required
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    placeholder="••••••••"
                    minLength={6}
                  />
                  <p className="text-xs text-slate-500 mt-1">Mínimo 6 caracteres</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Confirmar contraseña</label>
                  <input
                    type="password"
                    required
                    value={registerData.password_confirmation}
                    onChange={(e) => setRegisterData({ ...registerData, password_confirmation: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    placeholder="••••••••"
                    minLength={6}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {loading ? 'Registrando...' : 'Crear cuenta'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                ¿Ya tienes cuenta?{' '}
                <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Inicia sesión
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
