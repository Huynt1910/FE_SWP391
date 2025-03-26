import { toast } from "react-toastify";

// Default toast configurations
const defaultConfig = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {string} type - The type of toast: 'info', 'success', 'warning', 'error'
 * @param {object} options - Additional toast options
 */
export const showToast = (message, type = "info", options = {}) => {
  const config = { ...defaultConfig, ...options };

  switch (type.toLowerCase()) {
    case "success":
      toast.success(message, config);
      break;
    case "error":
      toast.error(message, config);
      break;
    case "warning":
      toast.warning(message, config);
      break;
    case "info":
    default:
      toast.info(message, config);
      break;
  }
};

/**
 * Show a network connectivity error toast
 * @param {object} options - Additional toast options
 */
export const showNetworkErrorToast = (options = {}) => {
  const config = { 
    ...defaultConfig, 
    autoClose: 5000, // Show longer than normal toasts
    ...options 
  };
  
  toast.error("Không có kết nối mạng. Vui lòng kiểm tra lại kết nối Internet của bạn.", config);
};

/**
 * Show a network connectivity restored toast
 * @param {object} options - Additional toast options
 */
export const showNetworkRestoredToast = (options = {}) => {
  const config = { ...defaultConfig, ...options };
  toast.success("Kết nối Internet đã được khôi phục", config);
};

export default showToast;