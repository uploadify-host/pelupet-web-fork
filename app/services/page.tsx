'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import { servicesAPI } from '@/lib/api'
import { Service } from '@/lib/types'
import { Navbar } from '@/components/Navbar'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid'
import { cn, formatCurrency } from '@/lib/utils'
import { Scissors, Stethoscope, GraduationCap, Sparkles, PawPrint, Cat } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const categoryColors = {
  grooming: 'from-sky-500 to-cyan-500',
  veterinary: 'from-cyan-500 to-blue-500',
  training: 'from-blue-500 to-cyan-500',
  other: 'from-blue-500 to-red-500',
}

const categoryIcons = {
  grooming: Scissors,
  veterinary: Stethoscope,
  training: GraduationCap,
  other: Sparkles,
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    try {
      const response = await servicesAPI.getAll()
      setServices(response.data)
    } catch (error) {
      console.error('Error loading services:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!loading && services.length > 0) {
      const ctx = gsap.context(() => {
        gsap.from('.page-title', {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
        })

        gsap.from('.category-filter', {
          y: 30,
          opacity: 0,
          duration: 0.6,
          delay: 0.2,
          stagger: 0.1,
          ease: 'power3.out',
        })

        gsap.from('.service-item', {
          scrollTrigger: {
            trigger: '.services-grid',
            start: 'top 80%',
          },
          y: 60,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
        })
      }, containerRef)

      return () => ctx.revert()
    }
  }, [loading, services, selectedCategory])

  const filteredServices = selectedCategory === 'all'
    ? services
    : services.filter(s => s.category === selectedCategory)

  const categories = ['all', ...Array.from(new Set(services.map(s => s.category)))]

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="px-4 py-2 bg-sky-100 text-sky-700 text-sm font-semibold mb-4">
              Catálogo de Servicios
            </Badge>
            <h1 className="page-title text-6xl font-bold text-slate-800 mb-4">
              Nuestros <span className="text-sky-600">Servicios</span>
            </h1>
            <p className="text-xl text-slate-600">
              Servicios profesionales para el cuidado integral de tu mascota
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((cat) => (
              <Button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                variant={selectedCategory === cat ? "default" : "outline"}
                className={cn(
                  "category-filter rounded-full font-semibold transition-all",
                  selectedCategory === cat && "bg-sky-600 hover:bg-sky-700"
                )}
              >
                {cat === 'all' ? 'Todos' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-20">
              <PawPrint className="w-24 h-24 mx-auto mb-4 animate-bounce text-blue-600" />
              <p className="text-xl text-slate-600">Cargando servicios...</p>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-20">
              <Cat className="w-24 h-24 mx-auto mb-4 text-slate-400" />
              <p className="text-xl text-slate-600">No hay servicios disponibles</p>
            </div>
          ) : (
            <BentoGrid className="services-grid">
              {filteredServices.map((service, index) => (
                <BentoGridItem
                  key={service.id}
                  className="service-item md:col-span-1"
                  title={service.name}
                  description={service.description || 'Servicio profesional de alta calidad'}
                  gradient={categoryColors[service.category]}
                  header={
                    <div className={cn(
                      "flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br items-center justify-center",
                      categoryColors[service.category]
                    )}>
                      <div className="text-center">
                        {(() => {
                          const Icon = categoryIcons[service.category]
                          return <Icon className="w-16 h-16 text-white mb-2 mx-auto" />
                        })()}
                        <Badge variant="secondary" className="mt-2 bg-white/20 backdrop-blur-sm text-white border-0">
                          {service.category}
                        </Badge>
                      </div>
                    </div>
                  }
                  icon={
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs text-slate-500">Precio</p>
                          <p className="text-2xl font-bold text-sky-600">
                            {formatCurrency(service.price)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-500">Duración</p>
                          <p className="text-sm font-semibold text-slate-700">
                            {service.duration_minutes} min
                          </p>
                        </div>
                      </div>
                      <Link href={`/appointments?service=${service.id}`}>
                        <Button className="w-full bg-sky-600 hover:bg-sky-700 rounded-full">
                          Agendar Ahora
                        </Button>
                      </Link>
                    </div>
                  }
                />
              ))}
            </BentoGrid>
          )}

          <div className="mt-16">
            <Card className="bg-gradient-to-r from-sky-600 to-cyan-600 border-0 text-white overflow-hidden">
              <CardContent className="p-12 text-center">
                <Sparkles className="w-24 h-24 mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-4">¿No encuentras lo que buscas?</h2>
                <p className="text-xl text-sky-50 mb-8">
                  Solicita un servicio personalizado adaptado a las necesidades de tu mascota
                </p>
                <Link href="/custom-services">
                  <Button size="lg" variant="secondary" className="rounded-full text-lg font-semibold">
                    Solicitar Servicio Custom
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
