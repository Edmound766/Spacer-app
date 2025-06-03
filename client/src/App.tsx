import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router";
import Layout from "@/components/page_layouts/layout.tsx";
import LandingPage from "@/pages/LandingPage.tsx";
import HomePage from "@/pages/HomePage.tsx";
import Error404 from "./pages/Error404";
import ProtectedRoute from "@features/auth/ProtectedRoute";
import LoginPage from "@features/auth/LoginPage";
import RegisterPage from "@features/auth/RegisterPage";
import { SidebarProvider } from "@/components/ui/sidebar"

import AdminLayout from "./components/page_layouts/admin_layout";
import AdminHome from "@features/admin/pages/Homepage";
import UserPorfile from "@features/users/UserProfile"

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route element={<ProtectedRoute roles={["admin", "client"]} />}>
              <Route path="home" element={<HomePage />} />
              <Route path="profile" element={<UserPorfile />} />
            </Route>

            <Route path="auth/register" element={<RegisterPage />} />
            <Route path="auth/login" element={<LoginPage />} />
            <Route path="*" element={<Error404 />} />
          </Route>
          <Route path="/admin" element={
            <SidebarProvider>
              <AdminLayout />
            </SidebarProvider>
          }
          >
            <Route index element={<AdminHome />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
