import { AdminLayout } from "@/components/Admin/AdminLayout";
import { Feedback } from "@/components/Admin/Feedback/Feedback";
import { AuthGuard } from "@/auth/AUTHGUARD/AuthGuard";

const breadcrumbsData = [
  {
    label: "Admin",
    path: "/admin",
  },
  {
    label: "Đánh giá của khách hàng",
    path: "/admin/feedback",
  },
];

const FeedbackPage = () => {
  return (
    <AuthGuard>
      <AdminLayout
        breadcrumb={breadcrumbsData}
        breadcrumbTitle="Đánh giá của khách hàng"
      >
        <Feedback />
      </AdminLayout>
    </AuthGuard>
  );
};

export default FeedbackPage;
