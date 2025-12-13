'use client'

import Link from 'next/link'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Cat, Phone } from 'lucide-react'

export function CTASection() {
  return (
    <section id="contacto" className="py-24 bg-gradient-to-br from-blue-600 to-cyan-600 text-white relative overflow-hidden">
      <div className="absolute top-10 right-10 opacity-10">
        <Cat className="w-32 h-32" />
      </div>
      <div className="absolute bottom-10 left-10 opacity-10">
        <Cat className="w-32 h-32" />
      </div>
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <Cat className="w-28 h-28 mx-auto mb-6" />
        <h2 className="text-5xl font-bold mb-6">¿Listo para mimar a tu minino?</h2>
        <p className="text-xl text-blue-100 mb-12">Agenda tu cita hoy y descubre por qué ronroneamos de felicidad</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/appointments">
            <Button size="lg" variant="secondary" className="px-8 py-6 rounded-full text-lg font-semibold shadow-lg hover:scale-105 transition-all flex items-center gap-2">
              <Cat className="w-5 h-5" /> Agendar Ahora
            </Button>
          </Link>
          <a href="tel:+8295981500">
            <Button size="lg" variant="outline" className="px-8 py-6 rounded-full text-lg font-semibold bg-blue-700 bg-opacity-50 backdrop-blur text-white border-2 border-white border-opacity-30 hover:bg-opacity-70 hover:scale-105 transition-all flex items-center gap-2">
              <Phone className="w-5 h-5" /> Llamar: +1 829 598 1500
            </Button>
          </a>
        </div>
      </div>
    </section>
  )
}
