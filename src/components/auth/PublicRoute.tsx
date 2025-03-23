
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const returnUrl = location.state?.returnUrl || "/dashboard";

  if (isLoading) {
    // Show a loading state while checking auth
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (user) {
    // If user is logged in, redirect to the return URL or dashboard
    return <Navigate to={returnUrl} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
