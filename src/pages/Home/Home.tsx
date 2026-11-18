import { useEffect, useRef, useState } from 'react'
import FeaturedProducts from '../../components/home/FeaturedProducts/FeaturedProducts'
import ExperienceStats from '../../components/home/ExperienceStats/ExperienceStats'
import { Icon } from '../../components/ui/Icon'
import { products } from '../../data/products'
import { branches } from '../../data/branches'
import { categories } from '../../data/categories'
import { heroPhotos } from '../../data/heroPhotos'
import { heroMessages } from '../../data/heroMessages'
import { WHATSAPP_NUMBER } from '../../data/whatsapp'
import { subscribe } from '../../services/subscriptionService'

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activePhoto, setActivePhoto] = useState(0)
  const [activeBranch, setActiveBranch] = useState(0)
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [subscriptionMessage, setSubscriptionMessage] = useState('')
  const subscriptionInFlight = useRef(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const interval = window.setInterval(() => setActivePhoto((current) => (current + 1) % heroPhotos.length), 7000)
    return () => window.clearInterval(interval)
  }, [])

  return (
    <main id="home" className="min-h-screen overflow-hidden bg-[#f5f5ef] text-[#10271f]">
      <section id="reservar" className="relative min-h-[760px] overflow-hidden rounded-b-[2rem] bg-[#17372d] text-white lg:min-h-[820px] lg:rounded-b-[3.5rem]">
        {heroPhotos.map((photo, index) => (
          <img key={photo.src} className={`absolute inset-0 h-full w-full object-cover object-[62%_center] transition-opacity duration-1000 motion-reduce:transition-none ${activePhoto === index ? 'opacity-80' : 'opacity-0'}`} src={photo.src} alt={photo.alt} aria-hidden={activePhoto !== index} />
        ))}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,31,24,.88)_0%,rgba(9,31,24,.58)_42%,rgba(9,31,24,.08)_78%)]" />
        <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14">
          <header className="flex h-24 items-center justify-between border-b border-white/20">
            <a href="#home" className="flex h-12 w-36 items-center justify-center overflow-hidden rounded-xl bg-white" aria-label="Snow Ski, ir al inicio">
              <img src="/assets/snow-ski-logo-wide.png" alt="Snow Ski" className="h-full w-full object-contain p-1" />
            </a>
            <nav className="hidden items-center gap-9 text-sm font-medium lg:flex">
              <a className="transition hover:text-[#fdd72d]" href="#home">HOME</a>
              <a className="transition hover:text-[#fdd72d]" href="#contacto">RESERVAR</a>
              <a className="transition hover:text-[#fdd72d]" href="#contacto">CONTACTO</a>
              <a className="transition hover:text-[#fdd72d]" href="#nosotros">NOSOTROS</a>
            </nav>
            <button onClick={() => setMenuOpen(!menuOpen)} className="grid h-11 w-11 place-items-center rounded-full border border-white/30 lg:hidden" aria-label="Abrir menú">
              <Icon name={menuOpen ? 'close' : 'menu'} />
            </button>
          </header>
          {menuOpen && <div className="absolute left-5 right-5 top-24 z-20 rounded-3xl bg-white p-6 text-[#10271f] shadow-2xl lg:hidden">
            <nav className="flex flex-col gap-5 font-medium">
              <a onClick={() => setMenuOpen(false)} href="#home">HOME</a>
              <a onClick={() => setMenuOpen(false)} href="#contacto">RESERVAR</a>
              <a onClick={() => setMenuOpen(false)} href="#contacto">CONTACTO</a>
              <a onClick={() => setMenuOpen(false)} href="#nosotros">NOSOTROS</a>
            </nav>
          </div>}

          <div className="max-w-3xl pt-20 sm:pt-28 lg:pt-36">
            <a href="#/productos" className="mb-6 inline-flex max-w-xl items-center gap-3 rounded-2xl border border-[#fdd72d]/40 bg-black/50 px-4 py-3 text-sm leading-5 text-[#fdd72d] transition hover:bg-black/70">
              <span className="text-2xl font-bold">−15%</span>
              <span><strong className="block font-semibold">Aprovechá tu descuento de pretemporada</strong><span className="text-xs text-white/80">Antes del inicio de la temporada 2027 · Ver productos</span></span>
            </a>
            <p className="mb-5 flex min-h-8 items-center gap-3 text-xs font-semibold uppercase tracking-[.24em] text-[#fdd72d]"><span className="h-px w-8 shrink-0 bg-current" /> {heroMessages[activePhoto].eyebrow}</p>
            <h1 className="min-h-[3.3em] text-4xl font-medium leading-[1.1] tracking-[-.04em] sm:min-h-[2.2em] sm:text-5xl lg:text-6xl">{heroMessages[activePhoto].title}</h1>
            <p className="mt-7 min-h-[7em] max-w-xl text-base leading-7 text-white/75 sm:min-h-[5em] sm:text-lg">{heroMessages[activePhoto].description}</p>
          </div>

          <p className="mt-9 text-xs font-semibold uppercase tracking-[.15em] text-[#fdd72d]">Salidas en colectivo o particulares</p>
          <form onSubmit={(event) => {
            event.preventDefault()
            const data = new FormData(event.currentTarget)
            const date = String(data.get('date')).split('-').reverse().join('/')
            const message = `Hola SNOW SKI. Quiero ver si hay disponibilidad para mis viajes la fecha ${date} y la cantidad de personas: ${data.get('people')}.\nDestino: ${data.get('destination')}.\nTipo de salida: ${data.get('transport')}.\n¿Me confirman disponibilidad y precio?`
            window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
          }} className="mt-4 grid max-w-6xl gap-2 rounded-[1.7rem] bg-white p-2 text-[#10271f] shadow-2xl sm:grid-cols-2 lg:grid-cols-[1fr_1fr_.8fr_1fr_auto] lg:rounded-full">
            <label className="flex items-center gap-3 px-4 py-3">
              <Icon name="pin" className="h-5 w-5 text-[#668076]" />
              <span className="flex min-w-0 flex-col"><span className="text-[10px] font-semibold uppercase tracking-wider text-[#84938e]">Destino</span><select name="destination" required className="w-full cursor-pointer bg-transparent text-sm font-semibold outline-none"><option>Las Leñas</option><option>Los Puquios</option><option>Vallecitos</option><option>Penitentes</option><option>Cerro Catedral</option><option>Cerro Otto</option></select></span>
            </label>
            <label className="flex items-center gap-3 border-[#dfe5e1] px-4 py-3 sm:border-l">
              <Icon name="calendar" className="h-5 w-5 text-[#668076]" />
              <span className="flex min-w-0 flex-col"><span className="text-[10px] font-semibold uppercase tracking-wider text-[#84938e]">Fecha de salida</span><input name="date" required aria-label="Fecha de salida" type="date" min="2027-01-01" max="2027-12-31" defaultValue="2027-07-17" className="w-full bg-transparent text-sm font-semibold outline-none" /></span>
            </label>
            <label className="flex items-center gap-3 border-[#dfe5e1] px-4 py-3 lg:border-l">
              <Icon name="users" className="h-5 w-5 text-[#668076]" />
              <span className="flex min-w-0 flex-col"><span className="text-[10px] font-semibold uppercase tracking-wider text-[#84938e]">Personas</span><input name="people" aria-label="Cantidad de personas" type="number" required min="1" max="100" step="1" defaultValue="2" className="w-full bg-transparent text-sm font-semibold outline-none" /></span>
            </label>
            <label className="flex flex-col justify-center border-[#dfe5e1] px-4 py-3 lg:border-l"><span className="text-[10px] font-semibold uppercase tracking-wider text-[#84938e]">Tipo de salida</span><select name="transport" className="bg-transparent text-sm font-semibold outline-none"><option>Colectivo</option><option>Particular</option></select></label>
            <button className="flex items-center justify-center gap-2 rounded-[1.2rem] bg-black/50 px-7 py-4 text-sm font-bold text-white transition hover:bg-black/70 lg:rounded-full">Consultar salidas <Icon name="arrow" className="h-4 w-4" /></button>
          </form>
          <div className="flex items-center gap-3 pb-6 pt-6" aria-label="Controles de fotos del fondo">
            {heroPhotos.map((photo, index) => <button key={photo.src} onClick={() => setActivePhoto(index)} aria-label={`Ver foto ${index + 1}`} aria-pressed={activePhoto === index} className="flex h-8 items-center px-1"><span className={`h-1 rounded-full transition-all ${activePhoto === index ? 'w-9 bg-[#fdd72d]' : 'w-5 bg-white/40'}`} /></button>)}
          </div>
        </div>
      </section>

      <FeaturedProducts products={products} />
      <ExperienceStats />

      <section id="coleccion" className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-14 lg:py-28">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div><p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-[#e0b800]">Explorá la colección</p><h2 className="max-w-2xl text-4xl font-medium leading-tight tracking-[-.04em] sm:text-5xl">Todo lo que necesitás.<br />Nada que cargar.</h2></div>
          <a href="#/productos" className="hidden items-center gap-2 border-b border-[#10271f] pb-1 text-sm font-semibold sm:flex">Ver todo <Icon name="arrow" className="h-4 w-4" /></a>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {categories.map((category) => <a href="#/productos" key={category.title} className="group relative h-[430px] overflow-hidden rounded-[1.8rem] bg-[#17372d]">
            <img src={category.image} alt={`Ropa de nieve para ${category.title.toLowerCase()}`} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b2019]/85 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-7 text-white">
              <div><p className="mb-1 text-sm text-white/70">{category.subtitle}</p><h3 className="text-3xl font-medium">{category.title}</h3></div>
              <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-[#10271f] transition group-hover:bg-[#fdd72d]"><Icon name="arrow" /></span>
            </div>
          </a>)}
        </div>
      </section>

      <section id="nosotros" className="mx-auto grid max-w-[1440px] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:px-14 lg:py-28">
        <div className="relative min-h-[500px] overflow-hidden rounded-[2rem]">
          <img src="https://images.unsplash.com/photo-1636581563786-accb300ddcdc?auto=format&fit=crop&w=1200&q=85" alt="Snowboarder disfrutando de la nieve" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/92 p-5 backdrop-blur">
            <p className="flex items-center gap-2 text-sm font-semibold"><Icon name="star" className="h-4 w-4 fill-[#fdd72d]" /> Expertos en nieve y montaña</p>
          </div>
        </div>
        <div className="flex flex-col justify-center lg:pl-12">
          <p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-[#e0b800]">Así de fácil</p>
          <h2 className="text-4xl font-medium tracking-[-.04em] sm:text-5xl">Tú eliges la pista.<br />Nosotros hacemos el resto.</h2>
          <div className="mt-10 space-y-7">
            {[['01', 'Consultá tu salida', 'Elegí destino, fecha y cantidad de viajeros para conocer las opciones de 2027.'], ['02', 'Reservá tu equipo', 'Seleccioná las prendas y talles para cada persona antes de viajar.'], ['03', 'Disfrutá Mendoza', 'Recibí todo listo y ocupate solamente de disfrutar la montaña.']].map(([number, title, text]) => <div key={number} className="grid grid-cols-[48px_1fr] gap-4 border-b border-[#ccd3ce] pb-7">
              <span className="text-sm font-bold text-[#83a097]">{number}</span><div><h3 className="mb-2 text-xl font-semibold">{title}</h3><p className="text-sm leading-6 text-[#63736c]">{text}</p></div>
            </div>)}
          </div>
          <a href="#reservar" className="mt-9 flex w-fit items-center gap-2 rounded-full bg-black/50 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-black/70">Consultá una salida <Icon name="arrow" className="h-4 w-4" /></a>
        </div>
      </section>

      <section id="sucursales" className="bg-[#e8ebe4] py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14">
          <p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-[#e0b800]">Encontranos cerca de tu aventura</p>
          <h2 className="text-4xl font-medium tracking-[-.04em] sm:text-5xl">Nuestras sucursales</h2>
          <p className="mt-5 max-w-xl text-sm leading-6 text-[#5c6d66]">Seleccioná una sucursal para ver su ubicación y cómo llegar.</p>
          <div className="mt-10 grid gap-6 lg:grid-cols-[.8fr_1.6fr]">
            <div className="flex flex-col gap-3">
              {branches.map((branch, index) => (
                <button key={branch.name} onClick={() => setActiveBranch(index)} aria-pressed={activeBranch === index} className={`flex items-start gap-4 rounded-2xl border p-6 text-left transition ${activeBranch === index ? 'border-[#fdd72d] bg-[#17372d] text-white shadow-lg' : 'border-[#d6ddd6] bg-[#f5f5ef] text-[#10271f] hover:border-[#e0b800]'}`}>
                  <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${activeBranch === index ? 'bg-[#fdd72d] text-[#10271f]' : 'bg-[#e8ebe4]'}`}><Icon name="pin" /></span>
                  <span><span className="block text-lg font-semibold">{branch.name}</span><span className={`mt-2 block text-xs leading-5 ${activeBranch === index ? 'text-white/65' : 'text-[#63736c]'}`}>{branch.address}</span></span>
                </button>
              ))}
              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branches[activeBranch].address)}`} target="_blank" rel="noopener noreferrer" className="mt-2 flex items-center justify-center gap-2 rounded-full bg-black/50 px-6 py-4 text-sm font-semibold text-white transition hover:bg-black/70">Cómo llegar a {branches[activeBranch].name}<Icon name="arrow" className="h-4 w-4" /></a>
            </div>
            <div className="overflow-hidden rounded-[2rem] border border-[#d6ddd6] bg-white">
              <iframe key={activeBranch} title={`Mapa de la sucursal ${branches[activeBranch].name}`} src={`https://maps.google.com/maps?q=${encodeURIComponent(branches[activeBranch].address)}&z=16&output=embed`} className="h-[420px] w-full border-0 lg:h-full lg:min-h-[460px]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
            </div>
          </div>
        </div>
      </section>

      <section id="contacto" className="mx-5 mb-5 mt-10 overflow-hidden rounded-[2rem] bg-[#17372d] text-white sm:mx-8 lg:mx-auto lg:mb-8 lg:max-w-[calc(100%-4rem)] lg:rounded-[3rem]">
        <div className="relative isolate px-6 py-16 lg:px-12 lg:py-24">
          <img src={heroPhotos[2].src} alt="" loading="lazy" className="absolute inset-0 -z-20 h-full w-full object-cover" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#091f18]/60 via-[#091f18]/80 to-[#17372d]" />
          <div className="mx-auto max-w-3xl">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[.2em] text-[#fdd72d]">Contanos tu próxima aventura</p>
            <h2 className="text-4xl font-medium leading-tight tracking-[-.04em] sm:text-6xl">Menos equipaje.<br />Más montaña.</h2>
            <p className="mt-5 max-w-xl leading-7 text-white/75">Escribinos por ropa, equipos o salidas. Coordinamos los detalles con vos directamente por WhatsApp.</p>
            <form onSubmit={(event) => {
              event.preventDefault()
              const data = new FormData(event.currentTarget)
              const message = `Hola SNOW SKI, soy ${String(data.get('firstName')).trim()} ${String(data.get('lastName')).trim()}.\nMi correo: ${data.get('email')}.\nConsulta: ${String(data.get('description')).trim()}`
              window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
            }} className="mt-10 grid gap-5 rounded-[1.7rem] border border-white/20 bg-white/10 p-6 backdrop-blur-md sm:grid-cols-2 sm:p-8">
              {[['firstName', 'Nombre', 'given-name'], ['lastName', 'Apellido', 'family-name'], ['email', 'Correo electrónico', 'email']].map(([name, label, autoComplete]) => <label key={name} className={`flex flex-col gap-2 text-sm ${name === 'email' ? 'sm:col-span-2' : ''}`}><span>{label}</span><input name={name} type={name === 'email' ? 'email' : 'text'} autoComplete={autoComplete} required maxLength={150} className="rounded-xl border border-white/25 bg-black/25 px-4 py-3 text-white outline-none focus:border-[#fdd72d]" /></label>)}
              <label className="flex flex-col gap-2 text-sm sm:col-span-2"><span>Descripción</span><textarea name="description" required maxLength={2000} rows={4} placeholder="Contanos qué necesitás, para qué fecha y cuántas personas viajan…" className="resize-y rounded-xl border border-white/25 bg-black/25 px-4 py-3 text-white outline-none placeholder:text-white/45 focus:border-[#fdd72d]" /></label>
              <div className="sm:col-span-2"><button className="flex items-center gap-3 rounded-full bg-black/50 px-7 py-4 text-sm font-semibold ring-1 ring-white/20 hover:bg-black/70">Enviar consulta por WhatsApp <Icon name="arrow" className="h-4 w-4" /></button><p className="mt-4 text-xs leading-5 text-white/60">Se abrirá WhatsApp con tus datos y el mensaje listo para enviar. No se guarda en esta página.</p></div>
            </form>
          </div>
        </div>
        <footer className="mx-6 border-t border-white/15 lg:mx-12">
          <div className="grid gap-10 border-b border-white/15 py-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[.2em] text-[#fdd72d]">La próxima temporada empieza acá</p>
              <h3 className="text-3xl font-medium tracking-tight sm:text-4xl">No te pierdas la próxima nevada.</h3>
              <p className="mt-4 max-w-md text-sm leading-6 text-white/60">Recibí promociones, novedades de equipos y noticias de las próximas temporadas de SNOW SKI.</p>
            </div>
            <form aria-busy={subscriptionStatus === 'loading'} onSubmit={async (event) => {
              event.preventDefault()
              if (subscriptionInFlight.current) return
              const form = event.currentTarget
              if (!form.reportValidity()) return
              const data = new FormData(form)
              const email = String(data.get('email') || '').trim()
              if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                setSubscriptionStatus('error')
                setSubscriptionMessage('Ingresá un email válido, por ejemplo nombre@dominio.com.')
                return
              }
              subscriptionInFlight.current = true
              setSubscriptionStatus('loading')
              setSubscriptionMessage('Procesando tu suscripción…')
              try {
                await subscribe(email)
                setSubscriptionStatus('success')
                setSubscriptionMessage('¡Gracias! Tu suscripción fue registrada correctamente.')
                form.reset()
              } catch (error) {
                setSubscriptionStatus('error')
                setSubscriptionMessage(error instanceof Error ? error.message : 'No pudimos confirmar tu suscripción. Intentá nuevamente.')
              } finally {
                subscriptionInFlight.current = false
              }
            }} className="self-center">
              <label htmlFor="newsletter-email" className="mb-3 block text-sm font-medium">Tu email</label>
              <div className="flex flex-col gap-2 rounded-2xl border border-white/20 bg-white/5 p-2 sm:flex-row sm:rounded-full">
                <input id="newsletter-email" name="email" type="email" autoComplete="email" required maxLength={254} disabled={subscriptionStatus === 'loading'} aria-describedby="newsletter-status" aria-invalid={subscriptionStatus === 'error' ? true : undefined} placeholder="nombre@email.com" onChange={() => { setSubscriptionStatus('idle'); setSubscriptionMessage('') }} className="min-w-0 flex-1 rounded-full bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:ring-2 focus:ring-[#fdd72d] disabled:opacity-60" />
                <button type="submit" disabled={subscriptionStatus === 'loading'} className="flex items-center justify-center gap-2 rounded-full bg-black/50 px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/70 disabled:cursor-wait disabled:opacity-60">{subscriptionStatus === 'loading' ? 'Enviando…' : subscriptionStatus === 'error' ? 'Volver a intentar' : 'Suscribirme'} <Icon name="arrow" className="h-4 w-4" /></button>
              </div>
              <label className="mt-4 flex items-start gap-3 text-xs leading-5 text-white/60"><input name="consent" type="checkbox" required disabled={subscriptionStatus === 'loading'} className="mt-1 accent-[#fdd72d]" />Acepto recibir promociones y novedades de SNOW SKI por email.</label>
              <p id="newsletter-status" className="mt-3 min-h-5 text-xs text-[#fdd72d]" role="status" aria-live="polite">{subscriptionMessage}</p>
            </form>
          </div>
          <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1fr_.7fr_1.5fr]">
            <div>
              <a href="#home" className="block h-14 w-40 overflow-hidden rounded-xl bg-white"><img src="/assets/snow-ski-logo-wide.png" alt="SNOW SKI" className="h-full w-full object-contain p-1" /></a>
              <p className="mt-5 max-w-xs text-sm leading-6 text-white/60">Tu próxima aventura empieza en la nieve. Indumentaria, equipos y montaña.</p>
              <span className="mt-5 inline-block rounded-full border border-[#fdd72d]/30 px-3 py-1.5 text-xs text-[#fdd72d]">Temporada 2027</span>
            </div>
            <nav aria-label="Enlaces del pie de página" className="flex flex-col items-start gap-3 text-sm text-white/60">
              <h4 className="mb-2 font-semibold text-white">Explorá SNOW SKI</h4>
              <a href="#/productos" className="hover:text-[#fdd72d]">Productos y precios</a>
              <a href="#reservar" className="hover:text-[#fdd72d]">Consultar salidas</a>
              <a href="#nosotros" className="hover:text-[#fdd72d]">Nosotros</a>
              <a href="#sucursales" className="hover:text-[#fdd72d]">Ver sucursales</a>
            </nav>
            <div>
              <h4 className="mb-5 text-sm font-semibold">Nuestras sucursales</h4>
              <div className="space-y-4">{branches.map(branch => <a key={branch.name} href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.address)}`} target="_blank" rel="noopener noreferrer" className="flex gap-3 text-sm transition hover:text-[#fdd72d]"><Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-[#fdd72d]" /><span className="font-medium">{branch.name}<span className="mt-1 block text-xs font-normal leading-5 text-white/50">{branch.address}</span></span></a>)}</div>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-3 border-t border-white/15 py-6 text-xs text-white/45 sm:flex-row">
            <p>© 2027 SNOW SKI · Todos los derechos reservados.</p>
            <a href="#home" className="flex items-center gap-2 hover:text-[#fdd72d]">Volver al inicio <Icon name="arrow" className="h-3 w-3 -rotate-90" /></a>
          </div>
        </footer>
      </section>
    </main>
  )
}
