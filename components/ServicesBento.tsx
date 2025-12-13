'use client'

import { BentoGrid, BentoGridItem } from "./ui/bento-grid"
import Link from "next/link"
import { Button } from "./ui/button"
import { Cat, Stethoscope, Sparkles, Phone, Users, Award } from 'lucide-react'

export function ServicesBento() {
  return (
    <BentoGrid className="max-w-7xl mx-auto px-6">
      <BentoGridItem
        title="Grooming Felino Premium"
        description="Baños especializados, cortes y estilismo con técnicas suaves para gatos. Tu minino quedará radiante"
        header={
          <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 items-center justify-center">
            <Cat className="w-16 h-16 text-white" />
          </div>
        }
        icon={
          <Link href="/services">
            <Button variant="ghost" size="sm" className="mt-2">
              Ver más →
            </Button>
          </Link>
        }
        className="md:col-span-1"
        gradient="from-blue-500 to-cyan-500"
      />
      
      <BentoGridItem
        title="Veterinaria Especializada"
        description="Atención médica profesional con doctores expertos en felinos. Salud garantizada"
        header={
          <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 items-center justify-center">
            <Stethoscope className="w-16 h-16 text-white" />
          </div>
        }
        icon={
          <Link href="/appointments">
            <Button variant="ghost" size="sm" className="mt-2">
              Agendar →
            </Button>
          </Link>
        }
        className="md:col-span-1"
        gradient="from-sky-500 to-blue-500"
      />
      
      <BentoGridItem
        title="Servicios Personalizados"
        description="Tratamientos a medida para las necesidades únicas de tu gatito especial"
        header={
          <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 items-center justify-center">
            <Sparkles className="w-16 h-16 text-white" />
          </div>
        }
        icon={
          <Link href="/custom-services">
            <Button variant="ghost" size="sm" className="mt-2">
              Solicitar →
            </Button>
          </Link>
        }
        className="md:col-span-1"
        gradient="from-cyan-500 to-cyan-500"
      />
      
      <BentoGridItem
        title="Atención 24/7"
        description="Siempre disponibles para emergencias y consultas de tu mascota"
        header={
          <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-slate-500 to-slate-600 items-center justify-center">
            <Phone className="w-16 h-16 text-white" />
          </div>
        }
        icon={<div className="text-xs text-blue-600 font-bold">+1 829-598-1500</div>}
        className="md:col-span-1"
        gradient="from-slate-500 to-slate-600"
      />
      
      <BentoGridItem
        title="+500 Gatitos Felices"
        description="La confianza de cientos de familias que nos eligen para cuidar de sus michis"
        header={
          <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 items-center justify-center gap-2">
            <Cat className="w-14 h-14 text-white" />
            <Cat className="w-14 h-14 text-white" />
            <Cat className="w-14 h-14 text-white" />
          </div>
        }
        icon={<div className="text-xs text-blue-600 font-bold">98% Satisfacción</div>}
        className="md:col-span-1"
        gradient="from-blue-400 to-cyan-500"
      />
      
      <BentoGridItem
        title="Profesionales Certificados"
        description="Equipo de veterinarios y groomers con amplia experiencia en cuidado felino"
        header={
          <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 items-center justify-center">
            <Award className="w-16 h-16 text-white" />
          </div>
        }
        icon={<div className="text-xs text-slate-600 font-bold">15+ años de experiencia</div>}
        className="md:col-span-1"
        gradient="from-sky-500 to-blue-600"
      />
    </BentoGrid>
  )
}
