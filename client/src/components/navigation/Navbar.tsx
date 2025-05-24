import  { useState } from "react";
import { NavLink } from "react-router";
import { AlignJustify } from "lucide-react";
import { Button } from "../ui/button";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import { clearUser, userSelector } from "@features/users/userSlice";
import { useLogoutMutation } from "@features/auth/authApi";

//  Removed: import { Button } from '@/components/ui/button';  --  Not a standard import.  Using a standard button.

const Navbar = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(userSelector);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const [logout, { isLoading }] = useLogoutMutation();
  const handleLogout = async () => {
    try {
      await logout();
      dispatch(clearUser());
    } catch (error) {
      console.error("Error occured during logout", error);
    }
  };
  if (isLoading) return <p>...</p>;

  return (
    <nav className="bg-blue-500 text-white py-4 px-6 flex items-center justify-between shadow-md sticky top-0 z-50">
      {/* Logo */}
      <div className="text-xl font-bold">
        <NavLink to="/" className="hover:text-blue-200 transition-colors">
          Logo
        </NavLink>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button // Changed to a standard button
          onClick={toggleMobileMenu}
          className="text-white hover:text-blue-200"
          aria-label="Toggle Navigation Menu"
        >
          <AlignJustify className="h-6 w-6" />
        </button>
      </div>

      {/* Links (Desktop) */}
      <div className={`hidden md:flex space-x-4`}>
        {user ? (
          <>
            <NavLink
              to="/home"
              className={({ isActive }) =>
                `text-white hover:bg-blue-600 px-3 py-2 rounded-md transition-colors ${
                  isActive ? "bg-blue-700" : ""
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `text-white hover:bg-blue-600 px-3 py-2 rounded-md transition-colors ${
                  isActive ? "bg-blue-700" : ""
                }`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/services"
              className={({ isActive }) =>
                `text-white hover:bg-blue-600 px-3 py-2 rounded-md transition-colors ${
                  isActive ? "bg-blue-700" : ""
                }`
              }
            >
              Services
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `text-white hover:bg-blue-600 px-3 py-2 rounded-md transition-colors ${
                  isActive ? "bg-blue-700" : ""
                }`
              }
            >
              Contact
            </NavLink>
            <NavLink
              to="/blog"
              className={({ isActive }) =>
                `text-white hover:bg-blue-600 px-3 py-2 rounded-md transition-colors ${
                  isActive ? "bg-blue-700" : ""
                }`
              }
            >
              Blog
            </NavLink>

            {user.role_name == "admin" && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `text-[gold] hover:bg-blue-600 px-3 py-2 rounded-md transition-colors ${
                    isActive ? "bg-blue-700" : ""
                  }`
                }
              >
                Admin
              </NavLink>
            )}

            <div className="rounded-full w-10 bg-white">
              <img width={"40px"} height={"40px"}/>
            </div>

            <Button variant={"secondary"} onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <NavLink
              to="/auth/register"
              className={({ isActive }) =>
                `text-white hover:bg-blue-600 px-3 py-2 rounded-md transition-colors ${
                  isActive ? "bg-blue-700" : ""
                }`
              }
            >
              Register
            </NavLink>
            <NavLink
              to="/auth/login"
              className={({ isActive }) =>
                `text-white hover:bg-blue-600 px-3 py-2 rounded-md transition-colors ${
                  isActive ? "bg-blue-700" : ""
                }`
              }
            >
              Login
            </NavLink>
          </>
        )}
      </div>

      {/* Mobile Menu (Conditional Rendering) */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full right-0 bg-blue-500 w-full rounded-md shadow-lg mt-2 overflow-hidden">
          <div className="flex flex-col">
            {user ? (
              <>
                <NavLink
                  to="/home"
                  className={({ isActive }) =>
                    `text-white hover:bg-blue-600 px-4 py-2 transition-colors ${
                      isActive ? "bg-blue-700" : ""
                    }`
                  }
                  onClick={toggleMobileMenu}
                >
                  Home
                </NavLink>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    `text-white hover:bg-blue-600 px-4 py-2 transition-colors ${
                      isActive ? "bg-blue-700" : ""
                    }`
                  }
                  onClick={toggleMobileMenu}
                >
                  About
                </NavLink>
                <NavLink
                  to="/services"
                  className={({ isActive }) =>
                    `text-white hover:bg-blue-600 px-4 py-2 transition-colors ${
                      isActive ? "bg-blue-700" : ""
                    }`
                  }
                  onClick={toggleMobileMenu}
                >
                  Services
                </NavLink>
                <NavLink
                  to="/contact"
                  className={({ isActive }) =>
                    `text-white hover:bg-blue-600 px-4 py-2 transition-colors ${
                      isActive ? "bg-blue-700" : ""
                    }`
                  }
                  onClick={toggleMobileMenu}
                >
                  Contact
                </NavLink>
                <NavLink
                  to="/blog"
                  className={({ isActive }) =>
                    `text-white hover:bg-blue-600 px-4 py-2 transition-colors ${
                      isActive ? "bg-blue-700" : ""
                    }`
                  }
                  onClick={toggleMobileMenu}
                >
                  Blog
                </NavLink>

                <Button variant={"secondary"} onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <NavLink
                  to="/auth/register"
                  className={({ isActive }) =>
                    `text-white hover:bg-blue-600 px-4 py-2 transition-colors ${
                      isActive ? "bg-blue-700" : ""
                    }`
                  }
                  onClick={toggleMobileMenu}
                >
                  Register
                </NavLink>
                <NavLink
                  to="/auth/login"
                  className={({ isActive }) =>
                    `text-white hover:bg-blue-600 px-4 py-2 transition-colors ${
                      isActive ? "bg-blue-700" : ""
                    }`
                  }
                  onClick={toggleMobileMenu}
                >
                  Login
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
