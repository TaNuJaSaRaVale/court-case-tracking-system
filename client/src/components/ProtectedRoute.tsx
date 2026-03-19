import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  allowedRole: string;
};

export default function ProtectedRoute({ children, allowedRole }: Props) {
  const role = localStorage.getItem("role");

  if (!role) return <Navigate to="/login" />;

  if (role !== allowedRole) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}