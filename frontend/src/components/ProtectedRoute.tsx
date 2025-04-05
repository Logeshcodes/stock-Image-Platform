import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated }: any = useAuth();

  return isAuthenticated ? (
    <>{children}</> 
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoute;
