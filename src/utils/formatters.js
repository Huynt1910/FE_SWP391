/**
 * Format a price value to display as currency (VND)
 * @param {number} price - The price to format
 * @returns {string} Formatted price string with VND currency symbol
 */
export const formatPrice = (price) => {
  if (price === undefined || price === null) return "N/A";
  
  // Format number with thousands separators
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND',
    maximumFractionDigits: 0 
  }).format(price);
};

/**
 * Format a date string from YYYY-MM-DD to DD/MM/YYYY
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {string} Formatted date string in DD/MM/YYYY format
 */
export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  
  try {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  } catch (err) {
    return dateString;
  }
};

/**
 * Format a time string from HH:MM:SS to HH:MM
 * @param {string} timeString - Time string in HH:MM:SS format
 * @returns {string} Formatted time string in HH:MM format
 */
export const formatTime = (timeString) => {
  if (!timeString) return "N/A";
  
  try {
    return timeString.substring(0, 5);
  } catch (err) {
    return timeString;
  }
}; 