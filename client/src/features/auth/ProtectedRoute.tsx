import { useAppSelector } from "@app/hooks";
import { userSelector } from "@features/users/userSlice";
import { Navigate, Outlet, useLocation } from "react-router";

type Role = "client" | "admin";



export default function ProtectedRoute({ roles }: { roles: Role[] }) {
  const location = useLocation();
  const user = useAppSelector(userSelector)


  console.log(user);


  if (!user) return <Navigate to="/auth/login" state={{ from: location }} replace />;
  const hasAllRequiredRolesFromSet = Array.from(roles).some(role => user.roles.includes(role));

  console.log(hasAllRequiredRolesFromSet);

  if (!hasAllRequiredRolesFromSet) {
    return <Navigate to="/home" replace />;
  }
  console.log(roles);

  return (
    <>
      <Outlet />
    </>
  );
}
