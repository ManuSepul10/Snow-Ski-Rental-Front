import type { Product } from '../types/product'

export const products: Product[] = [
  { name: 'Enterito adulto', price: 25000, type: 'Indumentaria térmica unisex', image: '/assets/enteritos-adultos.png', tag: 'Indumentaria', sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'] },
  { name: 'Enterito infantil', price: 20000, type: 'Abrigo integral para niños', image: '/assets/enterito-nino.png', tag: 'Niños', sizes: ['2', '4', '6', '8', '10'] },
  { name: 'Cadenas para camioneta', price: 15000, type: 'Seguridad para tu vehículo', image: '/assets/cadenas-nieve.jpg', tag: 'Vehículos' },
  { name: 'Esquís y bastones', price: 25000, type: 'Equipo completo para pista', image: 'https://images.unsplash.com/photo-1678986435406-eda0435d1b6a?auto=format&fit=crop&w=900&q=85', tag: 'Esquí' },
  { name: 'Snowboard', price: 25000, type: 'Tabla lista para la montaña', image: 'https://images.unsplash.com/photo-1647644768239-6e937d5e9743?auto=format&fit=crop&w=900&q=85', tag: 'Equipamiento' },
  { name: 'Antiparras de nieve', price: 10000, type: 'Protección y visión en pista', image: 'https://images.unsplash.com/photo-1700482249920-441d18133829?auto=format&fit=crop&w=900&q=85', tag: 'Accesorios' },
  { name: 'Casco', price: 15000, type: 'Protección para la montaña', image: 'https://images.unsplash.com/photo-1529774848151-535301a504f7?auto=format&fit=crop&w=900&q=85', tag: 'Seguridad' },
  { name: 'Campera de nieve', price: null, type: 'Abrigo técnico para tus aventuras', image: 'https://images.unsplash.com/photo-1594383815406-39916a2a5be8?auto=format&fit=crop&w=900&q=85', tag: 'Indumentaria' },
  { name: 'Pantalón de nieve', price: null, type: 'Comodidad y protección en pista', image: 'https://images.unsplash.com/photo-1646297226339-febd1eaee532?auto=format&fit=crop&w=900&q=85', tag: 'Indumentaria' },
  { name: 'Botas pre-ski', price: null, type: 'Abrigo para caminar en la nieve', image: '/assets/botas-pre-ski.webp', tag: 'Calzado', sizes: Array.from({ length: 13 }, (_, index) => { const size = 24 + index * 2; return size === 48 ? '48' : `${size}/${size + 1}` }) },
]
