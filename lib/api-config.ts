// lib/api-config.ts
export const API_BASE_URL = 'http://localhost:8000';

// Headers comunes para todas las requests
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// Función helper para hacer requests
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...DEFAULT_HEADERS,
      ...options.headers,
    },
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}