'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Card, CardContent } from './ui/card'
import { Cat, Sparkles, Check } from 'lucide-react'

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-title', {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      })

      gsap.from('.hero-subtitle', {
        y: 50,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out',
      })

      gsap.from('.hero-cta', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.6,
        ease: 'power3.out',
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden bg-white pt-20">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-sky-50 opacity-60"></div>

      <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <div className="space-y-8">
          <Badge variant="secondary" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-blue-100 text-blue-700 border-blue-200">
            <Cat className="w-5 h-5" />
            Expertos en Cuidado Felino
          </Badge>

          <h1 className="hero-title text-6xl lg:text-7xl font-black leading-tight">
            <span className="text-slate-900">Tu Gatito</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Merece Lo Mejor
            </span>
          </h1>

          <p className="hero-subtitle text-xl text-slate-600 leading-relaxed max-w-lg">
            Servicios veterinarios y grooming especializados con <span className="font-semibold text-blue-600">amor felino</span>.
            Porque cada ronroneo cuenta
          </p>

          <div className="hero-cta flex flex-wrap gap-4">
            <Link href="/appointments">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-6 text-lg font-bold rounded-2xl shadow-lg hover:shadow-2xl transition-all">
                <span>Agendar Cita</span>
                <Cat className="w-6 h-6 ml-2" />
              </Button>
            </Link>
            <Link href="/services">
              <Button variant="outline" size="lg" className="px-8 py-6 text-lg font-bold rounded-2xl border-2 hover:border-blue-300">
                Ver Servicios →
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-8 pt-4">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white flex items-center justify-center">
                <Cat className="w-5 h-5 text-white" />
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 border-2 border-white flex items-center justify-center">
                <Cat className="w-5 h-5 text-white" />
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 border-2 border-white flex items-center justify-center">
                <Cat className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">+500 Gatitos Felices</p>
              <p className="text-xs text-slate-500">Nos confían su cuidado</p>
            </div>
          </div>
        </div>

        <div className="relative lg:ml-auto">
          <div className="relative w-full max-w-lg">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <div className="aspect-[4/5] bg-gradient-to-br from-blue-100 via-sky-100 to-cyan-100 flex items-center justify-center">
                <div className="text-center p-8">
                  <Cat className="w-32 h-32 text-blue-600 mx-auto mb-4" />
                  <p className="text-2xl font-bold text-blue-600 mb-2">Tu Gatito Aquí</p>
                  <p className="text-slate-600">Imagen principal de un gato feliz</p>
                </div>
              </div>
            </div>

            <Card className="absolute -bottom-6 -left-6 shadow-xl border-blue-100 animate-float">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">98% Satisfacción</p>
                    <p className="text-xs text-slate-500">Clientes felices</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="absolute -top-6 -right-6 shadow-xl border-blue-100 animate-float animation-delay-2000">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Atención 24/7</p>
                    <p className="text-xs text-slate-500">Siempre disponibles</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
