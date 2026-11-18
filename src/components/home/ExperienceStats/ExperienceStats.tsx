import { useEffect, useRef, useState } from 'react'

export default function ExperienceStats() {
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    if (!visible) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setProgress(1)
      return
    }
    let frame = 0
    const start = performance.now()
    const animate = (now: number) => {
      const elapsed = Math.min((now - start) / 1800, 1)
      setProgress(1 - Math.pow(1 - elapsed, 3))
      if (elapsed < 1) frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [visible])
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        observer.disconnect()
      }
    }, { threshold: 0.2 })
    observer.observe(section)
    return () => observer.disconnect()
  }, [])
  return <section ref={sectionRef} aria-label="Nuestra experiencia" className="relative isolate overflow-hidden bg-[#17372d] bg-cover bg-center px-5 py-24 text-white sm:px-8 lg:bg-fixed lg:px-14 lg:py-36 motion-reduce:bg-scroll" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1636581563786-accb300ddcdc?auto=format&fit=crop&w=2000&q=90')" }}>
    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#091f18]/95 via-[#091f18]/75 to-[#091f18]/50" />
    <div className={`mx-auto grid max-w-[1328px] items-center gap-10 transition-all duration-1000 motion-reduce:transform-none motion-reduce:opacity-100 motion-reduce:transition-none md:grid-cols-[1fr_1fr_1fr] ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
      <div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#fdd72d]">SNOW SKI · Desde el primer día</p><h2 className="mt-4 text-3xl font-medium leading-tight tracking-tight">La confianza se construye<br />aventura a aventura.</h2><span className="mt-6 block h-1 w-14 rounded-full bg-[#fdd72d]" /></div>
      <div className="border-t border-white/25 pt-6 md:border-l md:border-t-0 md:pl-10 md:pt-0"><p aria-label="Más de 34" className="text-6xl font-semibold tabular-nums tracking-[-.06em] text-[#fdd72d] lg:text-7xl"><span aria-hidden="true">+{Math.round(34 * progress)}</span></p><p className="mt-3 text-sm font-medium text-white/80">años de experiencia</p></div>
      <div className="border-t border-white/25 pt-6 md:border-l md:border-t-0 md:pl-10 md:pt-0"><p aria-label="Más de 14.000" className="text-6xl font-semibold tabular-nums tracking-[-.06em] text-[#fdd72d] lg:text-7xl"><span aria-hidden="true">+{Math.round(14000 * progress).toLocaleString('es-AR')}</span></p><p className="mt-3 text-sm font-medium text-white/80">personas contentas</p></div>
    </div>
  </section>
}

