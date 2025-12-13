'use client'

import { useEffect, useRef, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import gsap from 'gsap'
import { servicesAPI, petsAPI, appointmentsAPI } from '@/lib/api'
import { authAPI } from '@/lib/auth'
import { Service, Pet } from '@/lib/types'
import { PawPrint, Scissors, Calendar, FileText, CheckCircle, Dog } from 'lucide-react'
import toast from 'react-hot-toast'
import { Navbar } from '@/components/Navbar'

function AppointmentsForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const preSelectedService = searchParams.get('service')
  
  const [services, setServices] = useState<Service[]>([])
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [user, setUser] = useState<any>(null)

  const [isNewPet, setIsNewPet] = useState(true)

  const [formData, setFormData] = useState({
    serviceId: preSelectedService || '',
    petId: '',
    appointmentDate: '',
    notes: '',
    petName: '',
    petSpecies: 'cat',
    petBreed: '',
    petAge: '',
  })

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    checkAuthAndLoadData()
  }, [])

  const checkAuthAndLoadData = async () => {
    const currentUser = authAPI.getCurrentUser()
    
    if (!currentUser) {
      toast.error('Debes iniciar sesión para agendar una cita')
      router.push('/login')
      return
    }

    setUser(currentUser)
    await loadData()
  }

  const loadData = async () => {
    try {
      const [servicesRes, petsRes] = await Promise.all([
        servicesAPI.getAll(),
        petsAPI.getAll(),
      ])
      setServices(servicesRes.data)
      
      const currentUser = authAPI.getCurrentUser()
      if (currentUser?.customer_id) {
        const userPets = petsRes.data.filter((pet: Pet) => pet.customer_id === currentUser.customer_id)
        setPets(userPets)
      } else {
        setPets(petsRes.data)
      }
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!loading) {
      const ctx = gsap.context(() => {
        gsap.from('.form-section', {
          y: 50,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
        })
      }, containerRef)

      return () => ctx.revert()
    }
  }, [loading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user?.customer_id) {
      toast.error('Error: No se encontró información del cliente')
      return
    }

    setSubmitting(true)

    try {
      let petId = formData.petId

      if (isNewPet) {
        if (!formData.petName || !formData.petSpecies || !formData.petAge) {
          toast.error('Por favor completa todos los campos de la mascota')
          setSubmitting(false)
          return
        }

        const petRes = await petsAPI.create({
          name: formData.petName,
          species: formData.petSpecies,
          breed: formData.petBreed || 'Desconocido',
          age: parseInt(formData.petAge),
          customer_id: user.customer_id,
          doctor_id: 1,
        })
        petId = petRes.data.id.toString()
        toast.success(`Mascota ${formData.petName} registrada exitosamente`)
      }

      if (!petId) {
        toast.error('Por favor selecciona o registra una mascota')
        setSubmitting(false)
        return
      }

      const selectedService = services.find(s => s.id === parseInt(formData.serviceId))
      
      await appointmentsAPI.create({
        pet_id: parseInt(petId),
        customer_id: user.customer_id,
        service_id: parseInt(formData.serviceId),
        appointment_date: formData.appointmentDate,
        total_price: selectedService?.price || '0',
        notes: formData.notes || '',
        status: 'scheduled',
      })

      setSuccess(true)
      toast.success('¡Cita agendada exitosamente!')
      
      gsap.to('.success-message', {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: 'back.out(1.7)',
      })

      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (error: any) {
      console.error('Error creating appointment:', error)
      const errorMessage = error.response?.data?.message || 'Error al crear la cita'
      toast.error(errorMessage)
    } finally {
      setSubmitting(false)
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

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="success-message text-center scale-0 opacity-0 max-w-md">
          <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-200">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">¡Cita Agendada!</h2>
            <p className="text-slate-600 mb-4">Tu cita ha sido registrada exitosamente</p>
            <p className="text-sm text-slate-500">Redirigiendo al dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-20 pb-8">
        <div className="max-w-3xl mx-auto px-6">
          {/* Header Clean */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Agendar Cita
            </h1>
            <p className="text-slate-600">Completa el formulario para reservar una cita</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Servicio */}
            <div className="form-section bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Scissors className="w-5 h-5 text-blue-600" />
                Servicio
              </h2>
              <select
                required
                value={formData.serviceId}
                onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              >
                <option value="">Selecciona un servicio</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} - ${service.price}
                  </option>
                ))}
              </select>
            </div>

            {/* Mascota */}
            <div className="form-section bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Dog className="w-5 h-5 text-blue-600" />
                Mascota
              </h2>
              
              <div className="flex gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsNewPet(true)
                    setFormData({ ...formData, petId: '', petName: '', petSpecies: 'cat', petBreed: '', petAge: '' })
                  }}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all ${
                    isNewPet 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Nueva Mascota
                </button>
                {pets.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsNewPet(false)
                      setFormData({ ...formData, petId: '', petName: '', petSpecies: 'cat', petBreed: '', petAge: '' })
                    }}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all ${
                      !isNewPet 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Mis Mascotas
                  </button>
                )}
              </div>

              {isNewPet ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre *</label>
                    <input
                      required
                      type="text"
                      placeholder="Nombre de tu mascota"
                      value={formData.petName}
                      onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Especie *</label>
                      <select
                        required
                        value={formData.petSpecies}
                        onChange={(e) => setFormData({ ...formData, petSpecies: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      >
                        <option value="cat">Gato</option>
                        <option value="dog">Perro</option>
                        <option value="other">Otro</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Edad *</label>
                      <input
                        required
                        type="number"
                        min="0"
                        max="30"
                        placeholder="Años"
                        value={formData.petAge}
                        onChange={(e) => setFormData({ ...formData, petAge: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Raza (opcional)</label>
                    <input
                      type="text"
                      placeholder="Raza de tu mascota"
                      value={formData.petBreed}
                      onChange={(e) => setFormData({ ...formData, petBreed: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Selecciona una mascota</label>
                  <select
                    required={!isNewPet}
                    value={formData.petId}
                    onChange={(e) => setFormData({ ...formData, petId: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  >
                    <option value="">Selecciona una mascota</option>
                    {pets.map((pet) => (
                      <option key={pet.id} value={pet.id}>
                        {pet.name} - {pet.species} ({pet.age} años)
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Fecha y Hora */}
            <div className="form-section bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Fecha y Hora
              </h2>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Fecha y hora *</label>
                <input
                  required
                  type="datetime-local"
                  value={formData.appointmentDate}
                  onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>
            </div>

            {/* Notas */}
            <div className="form-section bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Notas (opcional)
              </h2>
              <textarea
                placeholder="Información adicional..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
              />
            </div>

            {/* Botón Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <PawPrint className="w-5 h-5 animate-bounce" />
                  Agendando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Agendar Cita
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

export default function AppointmentsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <PawPrint className="w-24 h-24 mx-auto mb-4 animate-bounce text-blue-600" />
          <p className="text-xl text-slate-600">Cargando...</p>
        </div>
      </div>
    }>
      <AppointmentsForm />
    </Suspense>
  )
}
