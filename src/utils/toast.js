import { toast } from "react-toastify";

const defaultConfig = {
  position: "top-center",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const showToast = {
  success: (message) => {
    toast.success(message, defaultConfig);
  },
  error: (message) => {
    toast.error(message, { ...defaultConfig, autoClose: 5000 });
  },
  warning: (message) => {
    toast.warning(message, defaultConfig);
  },
  info: (message) => {
    toast.info(message, defaultConfig);
  },
};
