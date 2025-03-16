import { AdminLayout } from "@components/Admin/AdminLayout";
import { AuthGuard } from "@/auth/AUTHGUARD/AuthGuard";

const breadcrumbsData = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "Therapist",
    path: "/therapist",
  },
  {
    label: "Dashboard",
    path: "/therapist/dashboard",
  },
];

const TherapistDashboardPage = () => {
  return (
    <AuthGuard requiredRole="therapist">
      <AdminLayout breadcrumb={breadcrumbsData} breadcrumbTitle="Therapist Dashboard">
        <div className="therapist-dashboard">
          <h1>Welcome to Therapist Dashboard</h1>
          <p>You are logged in as a therapist.</p>
          
          <div className="dashboard-stats">
            <div className="stat-card">
              <h3>My Appointments</h3>
              <p className="stat-number">18</p>
            </div>
            <div className="stat-card">
              <h3>Today's Schedule</h3>
              <p className="stat-number">5</p>
            </div>
            <div className="stat-card">
              <h3>Client Reviews</h3>
              <p className="stat-number">42</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    </AuthGuard>
  );
};

export default TherapistDashboardPage; 