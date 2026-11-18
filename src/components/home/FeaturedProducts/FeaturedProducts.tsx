import { useEffect, useState } from 'react'
import type { Product } from '../../../types/product'

const money = (value: number) => `$${value.toLocaleString('es-AR')}`

export default function FeaturedProducts({ products }: { products: Product[] }) {
  const featured = [products[0], products[2], products[4], products[7], products[8]]
  const [slide, setSlide] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setInterval(() => setSlide(value => (value + 1) % featured.length), 3000)
    return () => window.clearInterval(timer)
  }, [featured.length])
  return <section id="packs" className="bg-[#e8ebe4] px-5 py-16 sm:px-8 lg:px-14">
    <div className="mx-auto max-w-[1328px]">
      <p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-[#e0b800]">Los esenciales · Temporada 2027</p>
      <h2 className="mb-8 text-4xl font-medium tracking-tight sm:text-5xl">Tu aventura, bien equipada.</h2>
      <div className="relative h-[540px] overflow-hidden rounded-[2rem] bg-[#17372d] text-white">
        {featured.map((product, index) => <div key={product.name} aria-hidden={slide !== index} className={`absolute inset-0 overflow-hidden transition-opacity duration-1000 motion-reduce:transition-none ${slide === index ? 'opacity-100' : 'opacity-0'}`}>
          {product.name === 'Enterito adulto' && <img src={product.image} alt="" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-30 blur-xl" />}
          <img src={product.image} alt={product.name} className={product.name === 'Enterito adulto' ? 'absolute right-0 h-full w-full object-contain object-right sm:w-3/5' : 'h-full w-full object-cover object-center'} />
        </div>)}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
        <div className="absolute bottom-20 left-7 right-7 sm:left-12">
          <span className="text-xs font-semibold uppercase tracking-[.2em] text-[#fdd72d]">{featured[slide].tag}</span>
          <h3 className="mt-3 text-4xl font-medium tracking-tight sm:text-6xl">{featured[slide].name}</h3>
          <p className="mt-3 text-white/70">{featured[slide].type}</p>
          <p className="mt-5 text-2xl font-semibold">{featured[slide].price === null ? 'Precio a consultar' : <>{money(featured[slide].price)} <span className="text-xs font-normal">ARS / día</span></>}</p>
          <p className="mt-2 text-xs text-white/70">El alquiler se cobra por día y por unidad.</p>
          <a href="#/productos" className="mt-6 inline-flex rounded-full bg-black/50 px-7 py-3.5 text-sm font-semibold ring-1 ring-white/30 hover:bg-black/80">Consultar · Ver todos los productos</a>
        </div>
        <div className="absolute bottom-5 left-7 flex items-center gap-3 sm:left-12">
          {featured.map((product, index) => <button key={product.name} onClick={() => setSlide(index)} aria-label={`Ver ${product.name}`} aria-pressed={slide === index} className="py-3"><span className={`block h-1 rounded-full ${slide === index ? 'w-10 bg-[#fdd72d]' : 'w-6 bg-white/40'}`} /></button>)}
        </div>
      </div>
    </div>
  </section>
}

