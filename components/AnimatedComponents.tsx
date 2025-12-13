'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface AnimatedCardProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function AnimatedCard({ children, className = '', delay = 0 }: AnimatedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (cardRef.current) {
      gsap.from(cardRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        delay,
        ease: 'power3.out',
      })
    }
  }, [delay])

  return (
    <div ref={cardRef} className={className}>
      {children}
    </div>
  )
}

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'danger'
}

export function AnimatedButton({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}: AnimatedButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (buttonRef.current) {
      const button = buttonRef.current
      
      const handleMouseEnter = () => {
        gsap.to(button, { scale: 1.05, duration: 0.2 })
      }
      
      const handleMouseLeave = () => {
        gsap.to(button, { scale: 1, duration: 0.2 })
      }

      button.addEventListener('mouseenter', handleMouseEnter)
      button.addEventListener('mouseleave', handleMouseLeave)

      return () => {
        button.removeEventListener('mouseenter', handleMouseEnter)
        button.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [])

  const variants = {
    primary: 'bg-sky-600 hover:bg-sky-700 text-white',
    secondary: 'bg-slate-200 hover:bg-slate-300 text-slate-800',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  }

  return (
    <button
      ref={buttonRef}
      className={`px-6 py-3 rounded-xl font-semibold transition-colors ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
