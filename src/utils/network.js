/**
 * Utilities for handling network connectivity
 */

/**
 * Check if the browser is online
 * @returns {boolean} True if the browser is online
 */
export const isOnline = () => {
  if (typeof navigator !== 'undefined' && 'onLine' in navigator) {
    return navigator.onLine;
  }
  return true; // Default to true if the API is not available
};

/**
 * Attempts to ping a reliable endpoint to check real connectivity
 * @returns {Promise<boolean>} Promise that resolves to true if connected
 */
export const checkConnectivity = async () => {
  try {
    // Try to fetch a small resource from a reliable CDN or your own API
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    // Use a reliable endpoint for ping - adjust as needed
    const response = await fetch('https://www.google.com/favicon.ico', {
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-store',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return true;
  } catch (error) {
    console.log('Connectivity check failed:', error);
    return false;
  }
};

/**
 * Register event listeners for online/offline events
 * @param {Function} onlineCallback - Called when coming online
 * @param {Function} offlineCallback - Called when going offline
 * @returns {Function} Cleanup function to remove event listeners
 */
export const registerNetworkListeners = (onlineCallback, offlineCallback) => {
  if (typeof window === 'undefined') return () => {};
  
  window.addEventListener('online', onlineCallback);
  window.addEventListener('offline', offlineCallback);
  
  return () => {
    window.removeEventListener('online', onlineCallback);
    window.removeEventListener('offline', offlineCallback);
  };
}; 