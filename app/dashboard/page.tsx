'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'
import Link from 'next/link'
import { authAPI } from '@/lib/auth'
import { petsAPI, appointmentsAPI } from '@/lib/api'
import { Pet, GroomingAppointment } from '@/lib/types'
import { formatDate, formatCurrency, getStatusColor, getStatusLabel } from '@/lib/utils'
import { PawPrint, Dog, Calendar, CheckCircle, Scissors, Sparkles, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { Navbar } from '@/components/Navbar'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(authAPI.getCurrentUser())
  const [pets, setPets] = useState<Pet[]>([])
  const [appointments, setAppointments] = useState<GroomingAppointment[]>([])
  const [loading, setLoading] = useState(true)
  const [showPetModal, setShowPetModal] = useState(false)
  const [petFormData, setPetFormData] = useState({
    name: '',
    species: 'cat',
    breed: '',
    age: ''
  })
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

  const handleAddPet = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await petsAPI.create({
        name: petFormData.name,
        species: petFormData.species,
        breed: petFormData.breed,
        age: petFormData.age,
        customer_id: user?.id || 0,
        doctor_id: 1
      })
      
      toast.success('¡Mascota agregada exitosamente!')
      setShowPetModal(false)
      setPetFormData({ name: '', species: 'cat', breed: '', age: '' })
      loadData()
    } catch (error: any) {
      console.error('Error adding pet:', error.response?.data)
      const errorMsg = error.response?.data?.message || 'Error al agregar mascota'
      toast.error(errorMsg)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <PawPrint className="w-12 h-12 mx-auto mb-4 animate-bounce text-blue-600" />
          <p className="text-slate-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-20 pt-24">
        <h1 className="text-4xl font-bold text-slate-800 mb-8">Mi Dashboard</h1>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="stats-card bg-gradient-to-br from-sky-500 to-cyan-500 rounded-2xl p-6 text-white">
            <Dog className="w-12 h-12 mb-2" />
            <div className="text-3xl font-bold mb-1">{pets.length}</div>
            <div className="text-sky-100">Mascotas Registradas</div>
          </div>
          <div className="stats-card bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl p-6 text-white">
            <Calendar className="w-12 h-12 mb-2" />
            <div className="text-3xl font-bold mb-1">{appointments.filter(a => a.status === 'scheduled').length}</div>
            <div className="text-cyan-100">Citas Programadas</div>
          </div>
          <div className="stats-card bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
            <CheckCircle className="w-12 h-12 mb-2" />
            <div className="text-3xl font-bold mb-1">{appointments.filter(a => a.status === 'completed').length}</div>
            <div className="text-blue-100">Citas Completadas</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="content-card bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <Dog className="w-6 h-6" /> Mis Mascotas
              </h2>
              <button 
                onClick={() => setShowPetModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
              >
                + Agregar
              </button>
            </div>
            {pets.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No tienes mascotas registradas</p>
            ) : (
              <div className="space-y-4">
                {pets.map((pet) => (
                  <div key={pet.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                    <PawPrint className="w-10 h-10 text-sky-600" />
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
                <Calendar className="w-6 h-6" /> Próximas Citas
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
            <Scissors className="w-12 h-12 mb-3 text-sky-600" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">Ver Servicios</h3>
            <p className="text-slate-600">Explora nuestros servicios de grooming</p>
          </Link>
          <Link href="/appointments" className="content-card bg-gradient-to-br from-cyan-50 to-blue-50 p-6 rounded-2xl hover:shadow-lg transition-shadow">
            <Calendar className="w-12 h-12 mb-3 text-cyan-600" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">Agendar Cita</h3>
            <p className="text-slate-600">Reserva una cita para tu mascota</p>
          </Link>
          <Link href="/custom-services" className="content-card bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl hover:shadow-lg transition-shadow">
            <Sparkles className="w-12 h-12 mb-3 text-blue-600" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">Servicio Custom</h3>
            <p className="text-slate-600">Solicita un servicio personalizado</p>
          </Link>
        </div>
      </main>

      {/* Modal para agregar mascota */}
      {showPetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-xl font-bold text-slate-900">Agregar Mascota</h3>
              <button 
                onClick={() => setShowPetModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddPet} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nombre</label>
                <input
                  type="text"
                  required
                  value={petFormData.name}
                  onChange={(e) => setPetFormData({ ...petFormData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                  placeholder="Nombre de tu mascota"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Especie</label>
                  <select
                    value={petFormData.species}
                    onChange={(e) => setPetFormData({ ...petFormData, species: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                  >
                    <option value="cat">Gato</option>
                    <option value="dog">Perro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Edad</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={petFormData.age}
                    onChange={(e) => setPetFormData({ ...petFormData, age: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                    placeholder="Años"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Raza</label>
                <input
                  type="text"
                  required
                  value={petFormData.breed}
                  onChange={(e) => setPetFormData({ ...petFormData, breed: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                  placeholder="Raza"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPetModal(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                >
                  Agregar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
