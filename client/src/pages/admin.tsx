import AdminLogin from "@/components/admin/admin-login";
import AdminContent from "@/components/admin/admin-content";
import { useAdminAuth } from "@/components/admin/admin-auth-provider";

export default function AdminPage() {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">로딩 중...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => {}} />;
  }

  return <AdminContent />;
}