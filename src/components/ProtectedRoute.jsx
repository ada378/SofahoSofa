import { Navigate } from "react-router-dom";
import { useAuth } from "../context/UnifiedAuthContext";

export default function ProtectedRoute({ children, requireAuth = true }) {
  const { user, checking } = useAuth();

  // Show loading while checking auth
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C86A3B]"></div>
      </div>
    );
  }

  // If auth required but no user, redirect to login
  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }

  // If auth required and user must be customer
  if (requireAuth && user.role !== "customer") {
    return <Navigate to="/login" replace />;
  }

  return children;
}
