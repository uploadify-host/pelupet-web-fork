'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'
import Link from 'next/link'
import { authAPI } from '@/lib/auth'
import { petsAPI, appointmentsAPI } from '@/lib/api'
import { Pet, GroomingAppointment } from '@/lib/types'
import { formatDate, formatCurrency, getStatusColor, getStatusLabel } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(authAPI.getCurrentUser())
  const [pets, setPets] = useState<Pet[]>([])
  const [appointments, setAppointments] = useState<GroomingAppointment[]>([])
  const [loading, setLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [petsRes, apptRes] = await Promise.all([
        petsAPI.getAll(),
        appointmentsAPI.getAll()
      ])
      setPets(petsRes.data.filter((p: Pet) => p.customer_id === user?.id))
      setAppointments(apptRes.data.filter((a: GroomingAppointment) => a.customer_id === user?.id))
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!loading) {
      const ctx = gsap.context(() => {
        gsap.from('.stats-card', { y: 30, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' })
        gsap.from('.content-card', { y: 40, opacity: 0, duration: 0.6, stagger: 0.15, delay: 0.3, ease: 'power3.out' })
      }, containerRef)
      return () => ctx.revert()
    }
  }, [loading])

  const handleLogout = () => {
    authAPI.setCurrentUser(null)
    toast.success('Sesión cerrada')
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🐾</div>
          <p className="text-xl text-slate-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="text-3xl">🐾</div>
              <span className="text-2xl font-bold text-sky-600">PeluPet</span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-slate-700">Hola, <strong>{user?.name}</strong></span>
              <button onClick={handleLogout} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors">
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-slate-800 mb-8">Mi Dashboard</h1>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="stats-card bg-gradient-to-br from-sky-500 to-cyan-500 rounded-2xl p-6 text-white">
            <div className="text-4xl mb-2">🐕</div>
            <div className="text-3xl font-bold mb-1">{pets.length}</div>
            <div className="text-sky-100">Mascotas Registradas</div>
          </div>
          <div className="stats-card bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl p-6 text-white">
            <div className="text-4xl mb-2">📅</div>
            <div className="text-3xl font-bold mb-1">{appointments.filter(a => a.status === 'scheduled').length}</div>
            <div className="text-cyan-100">Citas Programadas</div>
          </div>
          <div className="stats-card bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
            <div className="text-4xl mb-2">✅</div>
            <div className="text-3xl font-bold mb-1">{appointments.filter(a => a.status === 'completed').length}</div>
            <div className="text-blue-100">Citas Completadas</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="content-card bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <span>🐕</span> Mis Mascotas
              </h2>
              <Link href="/appointments" className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm hover:bg-sky-700">
                + Agregar
              </Link>
            </div>
            {pets.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No tienes mascotas registradas</p>
            ) : (
              <div className="space-y-4">
                {pets.map((pet) => (
                  <div key={pet.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                    <div className="text-4xl">🐾</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800">{pet.name}</h3>
                      <p className="text-sm text-slate-600">{pet.species} - {pet.age} años</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="content-card bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <span>📅</span> Próximas Citas
              </h2>
              <Link href="/appointments" className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm hover:bg-sky-700">
                + Agendar
              </Link>
            </div>
            {appointments.filter(a => a.status === 'scheduled').length === 0 ? (
              <p className="text-slate-500 text-center py-8">No tienes citas programadas</p>
            ) : (
              <div className="space-y-4">
                {appointments.filter(a => a.status === 'scheduled').slice(0, 3).map((appt) => (
                  <div key={appt.id} className="p-4 bg-slate-50 rounded-xl">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-slate-800">{appt.service?.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(appt.status)}`}>
                        {getStatusLabel(appt.status)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-1">{appt.pet?.name}</p>
                    <p className="text-xs text-slate-500">{formatDate(appt.appointment_date)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Link href="/services" className="content-card bg-gradient-to-br from-sky-50 to-cyan-50 p-6 rounded-2xl hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-3">💇</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Ver Servicios</h3>
            <p className="text-slate-600">Explora nuestros servicios de grooming</p>
          </Link>
          <Link href="/appointments" className="content-card bg-gradient-to-br from-cyan-50 to-blue-50 p-6 rounded-2xl hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-3">📅</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Agendar Cita</h3>
            <p className="text-slate-600">Reserva una cita para tu mascota</p>
          </Link>
          <Link href="/custom-services" className="content-card bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-3">✨</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Servicio Custom</h3>
            <p className="text-slate-600">Solicita un servicio personalizado</p>
          </Link>
        </div>
      </main>
    </div>
  )
}
