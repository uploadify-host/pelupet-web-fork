'use client'

import Link from 'next/link'
import { Separator } from './ui/separator'
import { Cat, MapPin, Phone, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Cat className="w-8 h-8 text-blue-400" />
              <span className="text-2xl font-bold">PeluPet</span>
            </div>
            <p className="text-slate-400">Cuidando a tus michis y peluditos con amor felino desde 2020</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Enlaces</h4>
            <div className="space-y-2">
              <Link href="/services" className="block text-slate-400 hover:text-white transition-colors">Servicios</Link>
              <Link href="/appointments" className="block text-slate-400 hover:text-white transition-colors">Agendar Cita</Link>
              <Link href="/custom-services" className="block text-slate-400 hover:text-white transition-colors">Servicios Custom</Link>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4">Contacto</h4>
            <div className="space-y-2 text-slate-400">
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Calle Rogelio Roselle, Bayona</p>
              <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> +1 829-598-1500</p>
              <p className="flex items-center gap-2"><Mail className="w-4 h-4" /> info@pelupet.com</p>
            </div>
          </div>
        </div>
        <Separator className="bg-slate-800 my-8" />
        <div className="text-center text-slate-400">
          <p>&copy; 2025 PeluPet. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
