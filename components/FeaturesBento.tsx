'use client'

import { BentoGrid, BentoGridItem } from "./ui/bento-grid"
import { Target, Calendar, Heart, Building2 } from 'lucide-react'

export function FeaturesBento() {
  const features = [
    {
      title: "Atención Personalizada",
      description: "Cada mascota recibe cuidado individualizado según sus necesidades específicas",
      icon: Target,
      gradient: "from-blue-500 to-sky-500",
    },
    {
      title: "Sistema de Reservas",
      description: "Agenda tu cita online de manera fácil y rápida desde cualquier dispositivo",
      icon: Calendar,
      gradient: "from-green-500 to-blue-500",
    },
    {
      title: "Amor por los Animales",
      description: "Tratamos a cada mascota con el cariño que se merece, como si fuera nuestra",
      icon: Heart,
      gradient: "from-blue-500 to-sky-500",
    },
    {
      title: "Instalaciones Modernas",
      description: "Equipamiento de última generación para el mejor cuidado de tu mascota",
      icon: Building2,
      gradient: "from-blue-500 to-cyan-500",
    },
  ]

  return (
    <BentoGrid className="max-w-7xl mx-auto px-6 md:auto-rows-[15rem]">
      {features.map((feature, i) => (
        <BentoGridItem
          key={i}
          title={feature.title}
          description={feature.description}
          header={
            <div className={`flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br ${feature.gradient} items-center justify-center`}>
              <feature.icon className="w-16 h-16 text-white" />
            </div>
          }
          className={i === 0 ? "md:col-span-2" : "md:col-span-1"}
          gradient={feature.gradient}
        />
      ))}
    </BentoGrid>
  )
}
