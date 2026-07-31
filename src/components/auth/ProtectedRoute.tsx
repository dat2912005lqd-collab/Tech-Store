import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSessionContext } from "@/context/SessionContext";

interface Props {
  allowedRoles?: string[];
}

const ProtectedRoute = ({ allowedRoles }: Props) => {
  const location = useLocation();

  const { user, token } = useSessionContext();

  // Chưa login
  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // Nếu có phân quyền

  if (
    allowedRoles &&
    user &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;