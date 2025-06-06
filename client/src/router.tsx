import { createBrowserRouter } from "react-router";
import Root from "./routes/root.tsx";
import Error404 from "./components/Error404.tsx";
import AdminRoot from "./routes/admin-root.tsx";
import HomePage from "./routes/HomePage.tsx";
import LandingPage from "./routes/LandingPage.tsx";
import LoginPage from "@features/auth/LoginPage.tsx";
import RegisterPage from "@features/auth/RegisterPage.tsx";
import ProtectedRoute from "@features/auth/ProtectedRoute.tsx";
import AdminHome from "@features/admin/pages/HomePage.tsx";
import ProfilePage from "./routes/ProfilePage.tsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error404 />,
    children: [
      {
        index: true,
        element: <LandingPage />
      },
      {
        element: <ProtectedRoute roles={["admin", "client"]} />,
        children: [
          {
            path: "home",
            element: <HomePage />

          }, {
            path: "profile",
            element: <ProfilePage />
          }
        ]
      },
      {
        path: "/auth/login",
        element: <LoginPage />
      },
      {
        path: "/auth/register",
        element: <RegisterPage />
      }
    ]
  },
  {
    element: <ProtectedRoute roles={['admin']} />,
    children: [
      {
        path: "admin",
        element: <AdminRoot />,
        errorElement: <Error404 />,
        children: [
          {
            index: true,
            element: <AdminHome />

          }
        ]

      }
    ]
  }

])

export default router
