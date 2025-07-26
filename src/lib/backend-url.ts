/**
 * Backend URL utility
 * Ensures consistent backend URL handling across the application
 */

/**
 * Get the backend URL with proper protocol
 * Adds https:// if no protocol is specified and it's not localhost
 */
export const getBackendUrl = (): string => {
  let url = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
  
  // Add https:// if no protocol is specified and it's not localhost
  if (!url.startsWith('http') && !url.includes('localhost')) {
    url = `https://${url}`;
  }
  
  return url;
};

/**
 * Get the backend URL for API requests
 * Same as getBackendUrl but with explicit naming for API usage
 */
export const getApiBaseUrl = (): string => {
  return getBackendUrl();
};
