import { clearAuthData } from "@/utils/auth";

const handleLogout = () => {
  clearAuthData();
  showToast.success("Logged out successfully");
  router.push("/login");
}; 