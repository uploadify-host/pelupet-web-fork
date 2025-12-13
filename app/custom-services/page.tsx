'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'
import Link from 'next/link'
import { customServicesAPI, customersAPI } from '@/lib/api'
import { authAPI } from '@/lib/auth'
import { Customer } from '@/lib/types'
import { PawPrint, Sparkles, Palette, Zap, Heart, User } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import toast from 'react-hot-toast'

export default function CustomServicesPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [isNewCustomer, setIsNewCustomer] = useState(true)

  const [formData, setFormData] = useState({
    customerId: '',
    serviceName: '',
    serviceDescription: '',
    estimatedPrice: '',
    estimatedDuration: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
  })

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    try {
      const response = await customersAPI.getAll()
      setCustomers(response.data)
    } catch (error) {
      console.error('Error loading customers:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!loading) {
      const ctx = gsap.context(() => {
        gsap.from('.hero-content', {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
        })

        gsap.from('.form-section', {
          y: 50,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          delay: 0.3,
          ease: 'power3.out',
        })

        gsap.from('.feature-card', {
          scale: 0.9,
          opacity: 0,
          duration: 0.6,
          stagger: 0.15,
          delay: 0.5,
          ease: 'back.out(1.7)',
        })
      }, containerRef)

      return () => ctx.revert()
    }
  }, [loading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      let customerId = formData.customerId

      if (isNewCustomer) {
        const customerRes = await customersAPI.create({
          name: formData.customerName,
          email: formData.customerEmail,
          phone: formData.customerPhone,
          address: formData.customerAddress,
        })
        customerId = customerRes.data.id.toString()
      }

      await customServicesAPI.create({
        customer_id: parseInt(customerId),
        name: formData.serviceName,
        description: formData.serviceDescription,
        price: formData.estimatedPrice,
        duration_minutes: parseInt(formData.estimatedDuration),
        status: 'pending',
      })

      setSuccess(true)
      gsap.to('.success-message', {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: 'back.out(1.7)',
      })

      setTimeout(() => {
        window.location.href = '/'
      }, 3000)
    } catch (error) {
      console.error('Error creating custom service:', error)
      alert('Error al solicitar el servicio. Por favor intente nuevamente.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <PawPrint className="w-24 h-24 mx-auto mb-4 animate-bounce text-blue-600" />
          <p className="text-xl text-slate-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="success-message text-center scale-0 opacity-0">
          <Sparkles className="w-32 h-32 mx-auto mb-6 text-blue-600" />
          <h2 className="text-4xl font-bold text-slate-800 mb-4">¡Solicitud Enviada!</h2>
          <p className="text-xl text-slate-600">Revisaremos tu solicitud y te contactaremos pronto</p>
          <p className="text-slate-500 mt-4">Redirigiendo...</p>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="hero-content text-center mb-16">
            <Sparkles className="w-20 h-20 mx-auto mb-6 text-blue-600" />
            <h1 className="text-5xl font-bold text-slate-900 mb-4">
              Servicios Personalizados
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              ¿Tu mascota necesita algo especial? Cuéntanos qué necesitas y crearemos un servicio personalizado solo para ella
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="feature-card bg-white rounded-3xl p-8 text-center shadow-lg">
              <Palette className="w-20 h-20 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-bold text-slate-800 mb-2">Tratamientos Únicos</h3>
              <p className="text-slate-600">Diseñamos servicios específicos para las necesidades de tu mascota</p>
            </div>
            <div className="feature-card bg-white rounded-3xl p-8 text-center shadow-lg">
              <Zap className="w-20 h-20 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-bold text-slate-800 mb-2">Respuesta Rápida</h3>
              <p className="text-slate-600">Revisamos tu solicitud y te respondemos en menos de 24 horas</p>
            </div>
            <div className="feature-card bg-white rounded-3xl p-8 text-center shadow-lg">
              <Heart className="w-20 h-20 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-bold text-slate-800 mb-2">Atención Especial</h3>
              <p className="text-slate-600">Cuidado individualizado con los mejores profesionales</p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="form-section bg-white rounded-3xl p-8 shadow-xl">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                  <User className="w-8 h-8 text-blue-600" />
                  Información del Cliente
                </h2>
                
                <div className="flex gap-4 mb-6">
                  <button
                    type="button"
                    onClick={() => setIsNewCustomer(true)}
                    className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                      isNewCustomer ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    Nuevo Cliente
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsNewCustomer(false)}
                    className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                      !isNewCustomer ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    Cliente Existente
                  </button>
                </div>

                {isNewCustomer ? (
                  <div className="space-y-4">
                    <input
                      required
                      type="text"
                      placeholder="Nombre completo"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className="w-full px-6 py-4 border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:outline-none"
                    />
                    <input
                      required
                      type="email"
                      placeholder="Email"
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                      className="w-full px-6 py-4 border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:outline-none"
                    />
                    <input
                      required
                      type="tel"
                      placeholder="Teléfono"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      className="w-full px-6 py-4 border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Dirección"
                      value={formData.customerAddress}
                      onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
                      className="w-full px-6 py-4 border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                ) : (
                  <select
                    required
                    value={formData.customerId}
                    onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                    className="w-full px-6 py-4 border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Selecciona un cliente</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} - {customer.email}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="form-section bg-white rounded-3xl p-8 shadow-xl">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                  <Sparkles className="w-8 h-8 text-blue-600" />
                  Detalles del Servicio
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Nombre del Servicio
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Ej: Corte estilo león, Spa de lujo, etc."
                      value={formData.serviceName}
                      onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                      className="w-full px-6 py-4 border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Descripción Detallada
                    </label>
                    <textarea
                      required
                      placeholder="Describe con detalle qué necesitas. Incluye características especiales, preferencias, condiciones de tu mascota, etc."
                      value={formData.serviceDescription}
                      onChange={(e) => setFormData({ ...formData, serviceDescription: e.target.value })}
                      rows={6}
                      className="w-full px-6 py-4 border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:outline-none resize-none"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Presupuesto Estimado ($)
                      </label>
                      <input
                        required
                        type="number"
                        step="0.01"
                        placeholder="50.00"
                        value={formData.estimatedPrice}
                        onChange={(e) => setFormData({ ...formData, estimatedPrice: e.target.value })}
                        className="w-full px-6 py-4 border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Duración Estimada (min)
                      </label>
                      <input
                        type="number"
                        placeholder="90"
                        value={formData.estimatedDuration}
                        onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })}
                        className="w-full px-6 py-4 border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-section bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-8 text-white">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">¿Listo para solicitar tu servicio personalizado?</h3>
                  <p className="text-blue-100">Revisaremos tu solicitud y nos pondremos en contacto contigo pronto</p>
                </div>
                
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-white text-blue-600 py-6 rounded-2xl text-xl font-bold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Enviando Solicitud...' : 'Solicitar Servicio Personalizado'}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-16 text-center">
            <p className="text-slate-600 mb-4">¿Prefieres un servicio estándar?</p>
            <Link
              href="/services"
              className="inline-block text-blue-600 font-semibold hover:text-blue-700 transition-colors"
            >
              Ver Servicios Regulares →
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
