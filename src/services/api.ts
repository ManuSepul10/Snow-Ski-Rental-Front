export function getApiBaseUrl(): string {
  const baseUrl = import.meta.env.VITE_API_URL?.trim();
  if (!baseUrl) {
    throw new Error("El servicio de mail todavia no esta disponible");
  }
  return baseUrl.replace(/\/+$/, "");
}
