import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Loader2 } from 'lucide-react';

/**
 * ProtectedRoute Component
 * Wraps private pages to ensure only authenticated users can access them.
 */
export function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!user) {
    // Redirect to login but save the current location to return after sign in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
