const API_BASE_URL = 'http://localhost:8080';

/**
 * Make an authenticated API request (returns raw Response)
 */
export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  // Add authorization header if token exists
  const token = localStorage.getItem('token');
  const headers = {
    ...options.headers,
    ...(token && { 'Authorization': `Bearer ${token}` })
  };

  return fetch(url, {
    ...options,
    headers
  });
}

/**
 * Make an authenticated API request and parse JSON response
 */
export async function apiRequestJson(endpoint: string, options: RequestInit = {}) {
  const response = await apiRequest(endpoint, options);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
