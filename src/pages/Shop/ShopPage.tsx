import { useEffect, useRef, useState } from 'react'
import type { Product } from '../../types/product'
import { WHATSAPP_NUMBER } from '../../data/whatsapp'

const money = (value: number) => `$${value.toLocaleString('es-AR')}`

export default function ShopPage({ products }: { products: Product[] }) {
  const [cart, setCart] = useState<Record<string, number>>({})
  const [notice, setNotice] = useState('')
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => {
    if (noticeTimer.current !== null) clearTimeout(noticeTimer.current)
  }, [])
  const detailRef = useRef<HTMLDialogElement>(null)
  const [pickupBranch, setPickupBranch] = useState('')
  const [returnBranch, setReturnBranch] = useState('')
  const branchOptions = ['Mendoza Capital', 'Bariloche', 'Malargüe']
  const branchesReady = Boolean(pickupBranch && returnBranch)
  const daysFor = (key: string) => Number(key.split(' | ')[1]) || 1
  const selected = Object.entries(cart).filter(([, quantity]) => quantity > 0).flatMap(([key]) => {
    const label = key.split(' | ')[0]
    const product = products.find(item => item.name === label.split(' · Talle ')[0])
    return product ? [{ ...product, name: key, label }] : []
  })
  const addProduct = (product: Product, form: HTMLFormElement) => {
    if (!branchesReady) return
    const data = new FormData(form)
    const days = Number(data.get('days'))
    const quantity = Number(data.get('quantity'))
    const size = String(data.get('size') || '')
    if (!Number.isInteger(days) || days < 1 || days > 365 || !Number.isInteger(quantity) || quantity < 1 || quantity > 99 || (product.sizes && !product.sizes.includes(size))) return
    const label = product.name + (size ? ` · Talle ${size}` : '')
    const key = `${label} | ${days}`
    setCart(current => ({ ...current, [key]: (current[key] || 0) + quantity }))
    setNotice(`${quantity} × ${label} por ${days} día(s) agregado al pedido.`)
    if (noticeTimer.current !== null) clearTimeout(noticeTimer.current)
    noticeTimer.current = setTimeout(() => setNotice(''), 2000)
    form.reset()
  }
  const total = selected.reduce((sum, product) => sum + (product.price ?? 0) * cart[product.name] * daysFor(product.name), 0)
  const discount = Math.round(total * 0.15)
  const discountedTotal = total - discount
  const pending = selected.some(product => product.price === null)
  const message = ['Hola SNOW SKI, quiero consultar este pedido de pretemporada 2027:', `Sucursal de retiro: ${pickupBranch}`, `Sucursal de devolución: ${returnBranch}`, ...(pickupBranch !== returnBranch ? ['Quiero consultar si es posible devolver en una sucursal diferente y si tiene costo adicional.'] : []), '', ...selected.map(product => `${product.label} × ${cart[product.name]} × ${daysFor(product.name)} día(s) — ${product.price === null ? 'precio a consultar' : `${money(product.price)} por día/unidad; importe: ${money(product.price * cart[product.name] * daysFor(product.name))}`}`), '', `Subtotal: ${money(total)} ARS`, `Descuento pretemporada 2027 (15%): -${money(discount)} ARS`, `${pending ? 'Subtotal con descuento (faltan productos a cotizar)' : 'Total con descuento'}: ${money(discountedTotal)} ARS`, ...(pending ? ['Falta cotizar los productos sin precio; no están incluidos en este cálculo.'] : []), `¿Me confirman disponibilidad de estos productos y talles en ${pickupBranch}, y las condiciones de devolución?`, 'Quisiera coordinar el despacho y el pago: seña con link de Mercado Pago para reservar, o pago en sucursal al retirar.'].join('\n')
  return <main className="min-h-screen bg-[#f5f5ef] text-[#10271f]">
    <div role="status" aria-live="polite" className="fixed right-4 top-4 z-50 max-w-[calc(100%-2rem)]">{notice && <div className="flex items-start gap-4 rounded-2xl bg-[#fdd72d] p-4 text-sm font-medium shadow-xl"><span>{notice}</span><button onClick={() => setNotice('')} aria-label="Cerrar aviso">×</button></div>}</div>
    <button onClick={() => detailRef.current?.showModal()} aria-label="Abrir detalle del carrito" className="fixed bottom-6 right-5 z-40 flex items-center gap-3 rounded-full bg-[#17372d] px-5 py-4 text-white shadow-2xl ring-1 ring-white/20">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden="true"><path d="M2 3h3l3 12h11l3-9H6" /><circle cx="9" cy="20" r="1" /><circle cx="19" cy="20" r="1" /></svg>
      <span>Mi pedido</span><span className="rounded-full bg-[#fdd72d] px-2.5 py-1 text-xs font-bold text-[#10271f]">{Object.values(cart).reduce((sum, quantity) => sum + quantity, 0)}</span>
    </button>
    <dialog ref={detailRef} aria-labelledby="order-detail-title" className="fixed inset-0 m-auto max-h-[85vh] w-[min(600px,calc(100%-2rem))] overflow-y-auto rounded-3xl bg-[#f5f5ef] p-6 text-[#10271f] shadow-2xl backdrop:bg-black/60 sm:p-8">
      <div className="flex items-center justify-between gap-4"><h2 id="order-detail-title" className="text-2xl font-semibold">Detalle de tu pedido</h2><button autoFocus onClick={() => detailRef.current?.close()} aria-label="Cerrar detalle" className="rounded-full bg-black/10 px-3 py-2">×</button></div>
      {!selected.length ? <p className="py-8">Tu pedido está vacío. Agregá productos para continuar.</p> : <>
        <p className="mt-5 text-sm">Retiro: <strong>{pickupBranch}</strong><br />Devolución: <strong>{returnBranch}</strong></p>
        <ul className="my-5 divide-y divide-black/10">{selected.map(product => <li key={product.name} className="py-4"><p className="font-semibold">{product.label}</p><p className="mt-1 text-sm text-[#63736c]">{cart[product.name]} unidad(es) × {daysFor(product.name)} día(s) · {product.price === null ? 'A cotizar' : `${money(product.price)} por día`}</p><div className="mt-2 flex justify-between"><strong>{product.price === null ? 'A cotizar' : money(product.price * cart[product.name] * daysFor(product.name))}</strong><button onClick={() => setCart(current => ({ ...current, [product.name]: 0 }))} className="text-xs underline">Eliminar</button></div></li>)}</ul>
        <div className="space-y-2 border-t border-black/15 pt-4 text-sm"><p className="flex justify-between">Subtotal <span>{money(total)} ARS</span></p><p className="flex justify-between">Descuento 15% <span>−{money(discount)} ARS</span></p><p className="flex justify-between text-lg font-bold">{pending ? 'Subtotal con descuento' : 'Total'} <span>{money(discountedTotal)} ARS</span></p></div>
        {pending && <p className="mt-3 text-xs">Los productos sin precio se cotizan aparte y no están incluidos.</p>}
        <p className="mt-5 text-xs leading-5 text-[#63736c]">Esto es una consulta, no una reserva confirmada. SNOW SKI confirma stock, despacho y pago por WhatsApp. Podés abonar una seña con link de Mercado Pago o pagar al retirar. {pickupBranch !== returnBranch && 'La devolución en otra sucursal requiere confirmación y puede tener cargos adicionales.'}</p>
        <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer" className="mt-6 block rounded-full bg-[#17372d] px-5 py-4 text-center text-sm font-semibold text-white">Confirmar consulta y enviar por WhatsApp</a>
      </>}
      <button onClick={() => detailRef.current?.close()} className="mt-4 w-full rounded-full border border-black/20 px-5 py-3 text-sm">Seguir eligiendo productos</button>
    </dialog>
    <header className="bg-[#17372d] text-white"><div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-6 lg:px-14"><a href="#home" className="text-xl font-bold tracking-wider">SNOW SKI</a><a href="#home" className="text-sm">← Volver al inicio</a><a href="#pedido" className="rounded-full bg-black/50 px-4 py-3 text-sm">Mi pedido ({Object.values(cart).reduce((a, b) => a + b, 0)})</a></div></header>
    <div className="mx-auto max-w-[1440px] px-5 py-14 lg:px-14">
      <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#e0b800]">Mendoza · Temporada 2027</p>
      <h1 className="mt-3 text-4xl font-medium tracking-tight sm:text-6xl">Armá tu próximo viaje.</h1>
      <p className="mt-5 max-w-xl leading-7 text-[#63736c]">Primero elegí dónde retirás y dónde devolvés. Después armá tu pedido para coordinar disponibilidad, despacho y pago con SNOW SKI por WhatsApp.</p>
      <p className="mt-4 text-sm font-semibold text-[#10271f]">Alquiler por día y por unidad. Importe = precio diario × cantidad × días de alquiler.</p>
      <p className="mt-6 w-fit rounded-2xl bg-[#fdd72d] px-5 py-4 text-sm font-semibold">Pretemporada 2027 · 15% de descuento en tu pedido de alquiler.</p>
      <section aria-labelledby="branch-selection" className="mt-10 rounded-3xl border border-[#d6ddd6] bg-white p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#e0b800]">Paso 1 · Tus sucursales</p>
        <h2 id="branch-selection" className="mt-3 text-2xl font-medium">¿Dónde empieza y termina tu aventura?</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium">Sucursal de retiro<select required value={pickupBranch} disabled={selected.length > 0} onChange={event => setPickupBranch(event.target.value)} className="rounded-xl border border-[#ccd3ce] bg-[#f5f5ef] px-4 py-4 outline-none focus:border-[#e0b800] disabled:opacity-60"><option value="">Elegí dónde retirás</option>{branchOptions.map(branch => <option key={branch}>{branch}</option>)}</select></label>
          <label className="flex flex-col gap-2 text-sm font-medium">Sucursal de devolución<select required value={returnBranch} onChange={event => setReturnBranch(event.target.value)} className="rounded-xl border border-[#ccd3ce] bg-[#f5f5ef] px-4 py-4 outline-none focus:border-[#e0b800]"><option value="">Elegí dónde devolvés</option>{branchOptions.map(branch => <option key={branch}>{branch}</option>)}</select></label>
        </div>
        <p className="mt-4 text-sm leading-6 text-[#63736c]">Los productos se solicitan en la sucursal de retiro. El stock y los talles se confirman por WhatsApp; el catálogo no indica disponibilidad en tiempo real.</p>
        {pickupBranch && returnBranch && pickupBranch !== returnBranch && <p className="mt-3 rounded-xl bg-[#fdd72d]/20 p-3 text-sm">La devolución en otra sucursal queda sujeta a confirmación y posibles cargos adicionales.</p>}
        {selected.length > 0 && <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-[#63736c]"><span>Para cambiar la sucursal de retiro, primero vaciá tu pedido.</span><button onClick={() => { if (window.confirm('¿Vaciar el pedido para cambiar de sucursal de retiro?')) { setCart({}); setNotice(''); setPickupBranch('') } }} className="rounded-full bg-black/50 px-4 py-2 text-white">Vaciar y cambiar sucursal</button></div>}
      </section>
      {!branchesReady && <p className="mt-8 rounded-2xl bg-[#e8ebe4] p-6 text-center text-sm" role="status">Seleccioná ambas sucursales para ver los productos y comenzar tu pedido.</p>}
      {branchesReady && <p className="mt-10 text-sm font-semibold">Paso 2 · Productos para retirar en {pickupBranch}</p>}
      <div hidden={!branchesReady}>
      <div className="mt-12 grid items-start gap-10 xl:grid-cols-[1fr_350px]">
        <div className="grid gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2">
          {products.map(product => <article key={product.name} className="overflow-hidden rounded-3xl bg-white">
            <div className="overflow-hidden bg-[#e8ebe4]"><img src={product.image} alt={product.name} className={`h-80 w-full transition-transform duration-700 motion-safe:hover:scale-105 ${product.name.startsWith('Enterito') ? 'object-contain' : 'object-cover'}`} /></div>
            <div className="p-5"><p className="text-xs uppercase tracking-wider text-[#63736c]">{product.tag}</p><h2 className="mt-2 text-xl font-semibold">{product.name}</h2><p className="mt-1 text-sm text-[#63736c]">{product.type}</p><p className="mt-4 text-xl font-semibold">{product.price === null ? 'Precio a consultar' : `${money(product.price)} ARS / día`}</p>
              <form className="mt-5 space-y-4" onSubmit={event => { event.preventDefault(); addProduct(product, event.currentTarget) }}>
                {product.sizes && <label className="flex flex-col gap-2 text-sm font-medium">Elegí tu talle<select name="size" required defaultValue="" className="rounded-xl border border-[#ccd3ce] bg-[#f5f5ef] px-3 py-3"><option value="" disabled>Seleccioná un talle</option>{product.sizes.map(size => <option key={size}>{size}</option>)}</select></label>}
                <div className="grid grid-cols-2 gap-3">{[['days', 'Días de alquiler', 365], ['quantity', 'Cantidad', 99]].map(([name, label, max]) => <label key={name} className="flex flex-col gap-2 text-sm font-medium">{label}<input name={String(name)} type="number" required min="1" max={max} step="1" defaultValue="1" className="min-w-0 rounded-xl border border-[#ccd3ce] bg-[#f5f5ef] px-3 py-3" /></label>)}</div>
                <button className="w-full rounded-full bg-black/50 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-black/70">Agregar al pedido</button>
              </form>
            </div>
          </article>)}
        </div>
        <aside id="pedido" className="rounded-3xl bg-[#17372d] p-7 text-white xl:sticky xl:top-6">
          <p className="text-xs uppercase tracking-widest text-[#fdd72d]">Coordinamos por WhatsApp</p><h2 className="mt-3 text-3xl font-medium">Tu pedido</h2>
          <div className="mt-5 space-y-2 rounded-xl bg-white/5 p-4 text-xs leading-5"><p><span className="text-white/50">Retiro:</span> {pickupBranch}</p><p><span className="text-white/50">Devolución:</span> {returnBranch}</p></div>
          {!selected.length ? <p className="my-8 text-sm leading-6 text-white/60">Todavía no agregaste productos. Elegí talle, cantidad y días, y presioná “Agregar al pedido”.</p> : <ul className="my-6 divide-y divide-white/15">{selected.map(product => <li key={product.name} className="py-4"><div className="flex justify-between gap-3 text-sm"><span>{product.label} × {cart[product.name]} · {daysFor(product.name)} día(s)</span><strong>{product.price === null ? 'A cotizar' : money(product.price * cart[product.name] * daysFor(product.name))}</strong></div><button onClick={() => setCart(current => ({ ...current, [product.name]: 0 }))} className="mt-2 text-xs text-white/50 underline">Eliminar</button></li>)}</ul>}
          <div className="space-y-3 border-t border-white/20 pt-5">
            <div className="flex justify-between text-sm text-white/60"><span>Subtotal</span><span>{money(total)} ARS</span></div>
            <div className="flex justify-between gap-3 text-sm text-[#fdd72d]"><span>Pretemporada 2027 · −15%</span><span>−{money(discount)} ARS</span></div>
            <div className="flex justify-between gap-3 border-t border-white/15 pt-4"><span>{pending ? 'Subtotal con descuento' : 'Total con descuento'}</span><strong className="text-xl text-[#fdd72d]">{money(discountedTotal)} ARS</strong></div>
          </div>
          {pending && <p className="mt-3 text-xs leading-5 text-[#fdd72d]">El subtotal no incluye los productos con precio a consultar. Se cotizan por WhatsApp.</p>}
          <p className="mt-4 text-xs leading-5 text-white/60">Sujeto a disponibilidad y confirmación del comercio. No es una reserva confirmada.</p>
          <div className="mt-5 rounded-2xl border border-white/15 bg-white/5 p-4 text-xs leading-6 text-white/75">
            <h3 className="mb-2 text-sm font-semibold text-white">¿Cómo reservás y pagás?</h3>
            <p>SNOW SKI gestiona tu pedido y coordina el despacho por WhatsApp.</p>
            <ul className="mt-2 list-disc space-y-2 pl-4"><li>Podés reservar con una seña: la empresa te envía un link de Mercado Pago por WhatsApp.</li><li>También podés pagar en la sucursal cuando retires.</li></ul>
            <p className="mt-2 text-white/50">El importe de la seña y las condiciones se confirman con la empresa. No se realizan cobros en esta web.</p>
          </div>
          <button disabled={!selected.length} onClick={() => detailRef.current?.showModal()} className="mt-6 w-full rounded-full bg-black/50 px-5 py-4 text-sm font-semibold ring-1 ring-white/20 disabled:opacity-40">Ver detalle y confirmar</button>
          {!WHATSAPP_NUMBER && <p className="mt-3 text-xs leading-5 text-white/50">Por ahora, WhatsApp te permitirá elegir el destinatario. Falta configurar el número de SNOW SKI.</p>}
        </aside>
      </div>
      </div>
    </div>
  </main>
}
