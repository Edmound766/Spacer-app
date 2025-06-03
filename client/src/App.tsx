import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router";
import Layout from "@/components/page_layouts/layout.tsx";
import LandingPage from "@/pages/LandingPage.tsx";
import HomePage from "@/pages/HomePage.tsx";
import Error404 from "./pages/Error404";
import ProtectedRoute from "@features/auth/ProtectedRoute";
import LoginPage from "@features/auth/LoginPage";
import RegisterPage from "@features/auth/RegisterPage";
import Adminlayout from "./components/page_layouts/admin_layout";
import AdminHome from "@features/admin/pages/Homepage";
import { SidebarProvider } from "./components/ui/sidebar";


function App() {


  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route element={<ProtectedRoute roles={["admin", "client"]} />} >

              <Route path="home" element={<HomePage />} />
            </Route>
            <Route path="auth/register" element={<RegisterPage />} />
            <Route path="auth/login" element={<LoginPage />} />
            <Route path="*" element={<Error404 />} />
          </Route>
          <Route path="/admin" element={
            <SidebarProvider>
              <Adminlayout />
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
