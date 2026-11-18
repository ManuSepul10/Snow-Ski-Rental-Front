# SNOW SKI — estructura React + TypeScript

## Estructura

- `App.tsx`: shell de navegación por hash (`#/productos`).
- `pages/Home/Home.tsx`: composición de la página principal.
- `pages/Shop/ShopPage.tsx`: catálogo, carrito, cálculo y pedido por WhatsApp.
- `components/home/FeaturedProducts` y `ExperienceStats`: secciones reutilizables extraídas de la página principal.
- `components/ui/Icon.tsx`: iconografía SVG utilizada por la página principal.
- `data/`: productos, sucursales, categorías, hero y teléfono de WhatsApp.
- `types/`: contratos TypeScript.
- `services/`: configuración de API y servicio de suscripciones.
- `index.css`: estilos globales originales conservados.

## Configuración

Crear `.env.local` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:8080
```

En producción, reemplazar por la URL HTTPS pública del backend. No colocar credenciales SMTP ni secretos en variables `VITE_*`.

## Ejecutar

```bash
pnpm install
pnpm dev
```

## Compilar

```bash
pnpm build
```

## Archivos originales

`Shop.tsx`, `entities.ts` y `subscriptions.ts` fueron reemplazados por sus ubicaciones nuevas. `App.tsx`, `main.tsx`, `index.css`, `vite.config.ts`, `tsconfig.json`, `package.json`, el lockfile, los recursos públicos y la documentación de integración se conservan.

## Nota de arquitectura

La tienda se conserva íntegra en `pages/Shop/ShopPage.tsx` para evitar alterar accidentalmente el flujo actual de carrito y confirmación. Los componentes visuales internos del catálogo pueden extraerse en una siguiente iteración con pruebas de comportamiento. Las carpetas `Header`, `Footer`, `Hero`, `ReservationForm`, `Branches`, `ProductCard`, `ProductList`, `Cart` y `OrderModal` quedan creadas como destinos preparados; no contienen componentes vacíos ni código ficticio.
