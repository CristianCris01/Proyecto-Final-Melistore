const urlConfigurada = import.meta.env.VITE_API_URL?.trim();
const urlPredeterminada = 'https://backend-r0ho.onrender.com';

export const API_URL = (urlConfigurada || urlPredeterminada).replace(/\/+$/, '');

export async function leerRespuestaApi(respuesta) {
  const tipo = respuesta.headers.get('content-type') || '';
  const datos = tipo.includes('application/json')
    ? await respuesta.json().catch(() => null)
    : null;

  if (!respuesta.ok || datos === null) {
    throw new Error(datos?.error || `La API devolvió una respuesta inesperada (HTTP ${respuesta.status}).`);
  }

  return datos;
}
