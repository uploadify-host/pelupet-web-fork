'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Navbar } from '@/components/Navbar'
import { HeroSection } from '@/components/HeroSection'
import { ServicesBento } from '@/components/ServicesBento'
import { GallerySection } from '@/components/GallerySection'
import { FeaturesBento } from '@/components/FeaturesBento'
import { CTASection } from '@/components/CTASection'
import { Footer } from '@/components/Footer'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Cat } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  const servicesRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.service-card', {
        scrollTrigger: {
          trigger: servicesRef.current,
          start: 'top 80%',
        },
        y: 80,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
      })

      gsap.from('.feature-card', {
        scrollTrigger: {
          trigger: featuresRef.current,
          start: 'top 80%',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="min-h-screen">
      <Navbar />

      <main>
        <HeroSection />

        <section id="servicios" ref={servicesRef} className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-semibold mb-4">
                Nuestros Servicios
              </Badge>
              <h2 className="text-5xl font-black text-slate-900 mb-4">
                Cuidado Integral Para Tu <span className="text-blue-600">Michifuz</span>
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Servicios especializados pensados en el bienestar de tu compañero felino
              </p>
            </div>

            <div className="service-card">
              <ServicesBento />
            </div>
          </div>
        </section>

        <GallerySection />

        <section id="nosotros" ref={featuresRef} className="py-24 bg-gradient-to-br from-slate-50 to-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="px-4 py-2 bg-sky-100 text-cyan-700 text-sm font-semibold mb-4">
                ¿Por qué elegirnos?
              </Badge>
              <h2 className="text-5xl font-bold text-slate-800 mb-6">
                Experiencia y <span className="text-cyan-600">Dedicación</span>
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Más de 15 años cuidando a tus mascotas con amor y profesionalismo
              </p>
            </div>

            <div className="feature-card">
              <FeaturesBento />
            </div>

            <div className="mt-12 flex justify-center feature-card">
              <Card className="bg-gradient-to-br from-sky-400 to-cyan-500 border-0 max-w-2xl w-full">
                <div className="rounded-3xl p-12 text-white text-center">
                  <Cat className="w-32 h-32 mx-auto mb-6 text-white" />
                  <h3 className="text-4xl font-bold mb-4">+1000 mascotas felices</h3>
                  <p className="text-sky-50 text-lg">Confianza y experiencia que nos respaldan</p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <CTASection />
        <Footer />
      </main>
    </div>
  )
}
