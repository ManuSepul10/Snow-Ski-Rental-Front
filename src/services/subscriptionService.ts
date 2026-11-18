import { getApiBaseUrl } from './api'

export async function subscribe(email: string): Promise<void> {

  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 15000)
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/suscripciones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
      signal: controller.signal,
    })
    if (!response.ok) {
      if (response.status === 409) throw new Error('Este email ya está suscripto.')
      if (response.status === 400 || response.status === 422) {
        throw new Error('El servidor no pudo aceptar la solicitud. Revisá tu email e intentá nuevamente.')
      }
      if (response.status === 429) throw new Error('Demasiados intentos. Esperá un momento antes de volver a intentar.')
      throw new Error('No pudimos completar la suscripción. Intentá nuevamente más tarde.')
    }
    // A successful HTTP response is sufficient; no invented JSON contract.
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error('El servidor tardó demasiado en responder. No pudimos confirmar la suscripción; intentá nuevamente.')
    }
    if (error instanceof TypeError) {
      throw new Error('No pudimos conectar con el servicio. Revisá tu conexión e intentá nuevamente.')
    }
    throw error
  } finally {
    window.clearTimeout(timeout)
  }
}
