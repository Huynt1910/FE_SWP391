import { AdminLayout } from "@/layout/AdminLayout";
import { AuthGuard } from "@/auth/AUTHGUARD/AuthGuard";

const breadcrumbsData = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "Admin",
    path: "/admin",
  },
  {
    label: "Dashboard",
    path: "/admin/dashboard",
  },
];

const StaffDashboardPage = () => {
  return (
    <AuthGuard requiredRole="staff">
      <AdminLayout breadcrumb={breadcrumbsData} breadcrumbTitle="Staff Dashboard">
        <div className="staff-dashboard">
          <h1>Welcome to Staff Dashboard</h1>
          <p>You are logged in as a staff member.</p>
          
          <div className="dashboard-stats">
            <div className="stat-card">
              <h3>Total Appointments</h3>
              <p className="stat-number">125</p>
            </div>
            <div className="stat-card">
              <h3>Active Therapists</h3>
              <p className="stat-number">12</p>
            </div>
            <div className="stat-card">
              <h3>New Customers</h3>
              <p className="stat-number">48</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    </AuthGuard>
  );
};

export default StaffDashboardPage; 