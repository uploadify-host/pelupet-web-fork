'use client'

import { Card, CardContent } from './ui/card'
import Image from 'next/image'

export function GallerySection() {
  return (
    <section id="galeria" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-sky-100 text-cyan-700 rounded-full text-sm font-semibold mb-4">
            Galería
          </span>
          <h2 className="text-5xl font-black text-slate-900 mb-4">
            Gatitos <span className="text-cyan-600">Felices</span>
          </h2>
          <p className="text-xl text-slate-600">
            Algunos de nuestros clientes satisfechos
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="group relative aspect-square overflow-hidden border-2 hover:shadow-xl transition-all hover:scale-105">
              <CardContent className="p-0 h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                  <div className="text-6xl group-hover:scale-125 transition-transform">
                    {i === 4 ? (
                      <video width={200} height={200} controls loop autoPlay muted className="rounded-full">
                        <source src="/images/kitty-4.mp4" type="video/mp4" />
                      </video>
                    ) : (
                      <Image
                        src={`/images/kitty-${i}.webp`}
                        alt={`Gatito ${i}`}
                        width={200}
                        height={200}
                        className="rounded-full"
                      />
                    )}
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
