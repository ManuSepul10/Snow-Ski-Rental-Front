# Suscripciones — integración con Spring Boot

Configurar `VITE_API_URL` con la URL pública del backend, sin `/api/suscripciones`
al final. Ejemplo local: `http://localhost:8080`.
Vite incorpora esta variable en el bundle: no debe contener secretos.
Después de cambiarla, reiniciar el entorno de desarrollo o recompilar/desplegar.

## Contrato HTTP

```http
POST {VITE_API_URL}/api/suscripciones
Content-Type: application/json

{"email":"nombre@dominio.com"}
```

El formulario requiere consentimiento pero, según el contrato solicitado,
envía únicamente `email`. No envía credenciales ni depende de cookies.

- Cualquier respuesta HTTP 2xx confirma la suscripción; no se exige cuerpo JSON.
- No devolver 2xx si el registro falla: el frontend confía en el código HTTP.
- 400/422: solicitud rechazada; 409: email duplicado; 429: demasiados intentos.
- Otros errores HTTP, de red o timeout (15 segundos): mensaje y reintento manual.
- No hay reintentos automáticos ni simulación de éxito.
- El backend debe validar, evitar duplicados y gestionar el correo de bienvenida.
  Ante un timeout, el servidor puede haber registrado el email; manejar duplicados.

## Configuración del servidor

Permitir mediante CORS el origen real del frontend y solicitudes OPTIONS/POST
con el encabezado Content-Type. Usar HTTPS en producción, tanto en la web
como en la API, y no incluir credenciales SMTP en variables VITE_*.

## Verificación al conectar

Probar email inválido, 2xx (incluido cuerpo vacío), 409, 500, desconexión,
timeout y doble clic durante carga. La interfaz conserva el email ante errores
y lo limpia solo después de recibir una respuesta exitosa.

La compilación del frontend no comprueba conectividad ni envío de correos.
