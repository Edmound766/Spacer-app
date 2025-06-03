import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router";
import { AlignJustify, UserCircle, LogOut, LogIn, UserPlus, Home, Info, Briefcase, Mail, BookOpen } from "lucide-react";
import { Button } from "../ui/button";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import { clearUser, userSelector } from "@features/users/userSlice";
import { useLogoutMutation } from "@features/auth/authApi";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(userSelector);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const profileDropdownRef = useRef(null);
  const mobileMenuButtonRef = useRef(null); // Ref for mobile menu button

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsProfileDropdownOpen(false); // Close profile dropdown when mobile menu opens
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
    setIsMobileMenuOpen(false); // Close mobile menu when profile dropdown opens
  };

  const [logout, { isLoading }] = useLogoutMutation();
  const handleLogout = async () => {
    try {
      await logout();
      dispatch(clearUser());
      setIsProfileDropdownOpen(false); // Close dropdown after logout
    } catch (error) {
      console.error("Error occurred during logout", error);
    }
  };

  // Effect to handle clicks outside the profile dropdown and mobile menu button
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      // Close profile dropdown if clicked outside
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }

      // Close mobile menu if clicked outside its container and not on the toggle button itself
      if (isMobileMenuOpen && mobileMenuButtonRef.current && !mobileMenuButtonRef.current.contains(event.target)) {
        // Find the mobile menu container
        const mobileMenuContainer = document.querySelector('.absolute.top-full.left-0.bg-blue-500.w-full');
        if (mobileMenuContainer && !mobileMenuContainer.contains(event.target)) {
          setIsMobileMenuOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]); // Dependency on isMobileMenuOpen to re-run effect when its state changes

  if (isLoading) return <p>...</p>;

  return (
    <nav className="bg-blue-500 text-white py-4 px-6 relative flex items-center justify-between shadow-md sticky top-0 z-50
                    md:grid md:grid-cols-3 md:items-center md:justify-unset {/* Override flex for md */}
                    lg:flex lg:justify-between lg:gap-0"> {/* Revert to flex for lg */}
      {/* Mobile Menu Button (Visible on mobile, hidden on md and up) */}
      <div className="flex md:hidden order-1"> {/* order-1 for mobile (left) */}
        <button
          onClick={toggleMobileMenu}
          className="text-white hover:text-blue-200"
          aria-label="Toggle Navigation Menu"
          ref={mobileMenuButtonRef}
        >
          <AlignJustify className="h-6 w-6" />
        </button>
      </div>

      {/* Logo (Mobile: middle, md: center, lg: left) */}
      <div className="text-xl font-bold flex-grow text-center order-2
                      md:col-start-2 md:justify-self-center md:flex-grow-0 md:text-center
                      lg:order-1 lg:text-left"> {/* lg:order-1 puts it first on large screens */}
        <NavLink to="/" className="hover:text-blue-200 transition-colors">
          Logo
        </NavLink>
      </div>

      {/* Profile Icon with Dropdown (Mobile: right, md: right, lg: far right) */}
      <div className="flex items-center relative order-3
                      md:col-start-3 md:justify-self-end
                      lg:order-3 lg:justify-self-end"> {/* order-3 for mobile (right), then explicit for md/lg */}
        <button
          onClick={toggleProfileDropdown}
          className="text-white hover:text-blue-200 transition-colors p-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          title="Profile Options"
          aria-expanded={isProfileDropdownOpen}
        >
          {user?.avatar ? (
            <img src={user?.avatar} alt="User Avatar" className="h-8 w-8 rounded-full object-cover" />
          ) : (
            <UserCircle className="h-8 w-8" />
          )}
        </button>

        {isProfileDropdownOpen && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none text-gray-800 z-50" ref={profileDropdownRef}>
            {user ? (
              <>
                <NavLink
                  to="/profile"
                  className="flex items-center px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={toggleProfileDropdown}
                >
                  <UserCircle className="h-4 w-4 mr-2" />
                  Profile
                </NavLink>
                {user.roles.includes("admin") && (
                  <NavLink
                    to="/admin"
                    className="flex items-center px-4 py-2 text-sm hover:bg-gray-100"
                    onClick={toggleProfileDropdown}
                  >
                    <Briefcase className="h-4 w-4 mr-2" />
                    Admin Dashboard
                  </NavLink>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/auth/login"
                  className="flex items-center px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={toggleProfileDropdown}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </NavLink>
                <NavLink
                  to="/auth/register"
                  className="flex items-center px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={toggleProfileDropdown}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Register
                </NavLink>
              </>
            )}
          </div>
        )}
      </div>

      {/* Links (Desktop - Hidden on mobile, left on md, middle on lg) */}
      <div className={`hidden space-x-4
                      md:flex md:col-start-1 md:justify-self-start {/* Left for md */}
                      lg:flex lg:order-2 lg:flex-grow lg:justify-center`}> {/* Middle for lg */}
        {user ? (
          <>
            <NavLink
              to="/home"
              className={({ isActive }) =>
                `text-white hover:bg-blue-600 px-3 py-2 rounded-md transition-colors ${isActive ? "bg-blue-700" : ""
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `text-white hover:bg-blue-600 px-3 py-2 rounded-md transition-colors ${isActive ? "bg-blue-700" : ""
                }`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/services"
              className={({ isActive }) =>
                `text-white hover:bg-blue-600 px-3 py-2 rounded-md transition-colors ${isActive ? "bg-blue-700" : ""
                }`
              }
            >
              Services
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `text-white hover:bg-blue-600 px-3 py-2 rounded-md transition-colors ${isActive ? "bg-blue-700" : ""
                }`
              }
            >
              Contact
            </NavLink>
            <NavLink
              to="/blog"
              className={({ isActive }) =>
                `text-white hover:bg-blue-600 px-3 py-2 rounded-md transition-colors ${isActive ? "bg-blue-700" : ""
                }`
              }
            >
              Blog
            </NavLink>
          </>
        ) : (
          null
        )}
      </div>


      {/* Mobile Menu (Conditional Rendering) */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 bg-blue-500 w-full rounded-md shadow-lg mt-2 overflow-hidden md:hidden">
          <div className="flex flex-col">
            {user ? (
              <>
                <NavLink to="/home" className={({ isActive }) => `text-white hover:bg-blue-600 px-4 py-2 transition-colors ${isActive ? "bg-blue-700" : ""}`} onClick={toggleMobileMenu}>
                  <Home className="h-4 w-4 mr-2 inline-block" /> Home
                </NavLink>
                <NavLink to="/about" className={({ isActive }) => `text-white hover:bg-blue-600 px-4 py-2 transition-colors ${isActive ? "bg-blue-700" : ""}`} onClick={toggleMobileMenu}>
                  <Info className="h-4 w-4 mr-2 inline-block" /> About
                </NavLink>
                <NavLink to="/services" className={({ isActive }) => `text-white hover:bg-blue-600 px-4 py-2 transition-colors ${isActive ? "bg-blue-700" : ""}`} onClick={toggleMobileMenu}>
                  <Briefcase className="h-4 w-4 mr-2 inline-block" /> Services
                </NavLink>
                <NavLink to="/contact" className={({ isActive }) => `text-white hover:bg-blue-600 px-4 py-2 transition-colors ${isActive ? "bg-blue-700" : ""}`} onClick={toggleMobileMenu}>
                  <Mail className="h-4 w-4 mr-2 inline-block" /> Contact
                </NavLink>
                <NavLink to="/blog" className={({ isActive }) => `text-white hover:bg-blue-600 px-4 py-2 transition-colors ${isActive ? "bg-blue-700" : ""}`} onClick={toggleMobileMenu}>
                  <BookOpen className="h-4 w-4 mr-2 inline-block" /> Blog
                </NavLink>

                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `text-white hover:bg-blue-600 px-4 py-2 transition-colors ${isActive ? "bg-blue-700" : ""
                    }`
                  }
                  onClick={toggleMobileMenu}
                >
                  <UserCircle className="h-4 w-4 mr-2 inline-block" /> Profile
                </NavLink>
                {user?.role_name && ( // Optional chaining for user?.isAdmin
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      `text-white hover:bg-blue-600 px-4 py-2 transition-colors ${isActive ? "bg-blue-700" : ""
                      }`
                    }
                    onClick={toggleMobileMenu}
                  >
                    <Briefcase className="h-4 w-4 mr-2 inline-block" /> Admin Dashboard
                  </NavLink>
                )}
                <Button variant={"secondary"} onClick={() => { handleLogout(); toggleMobileMenu(); }} className="w-full text-left justify-start">
                  <LogOut className="h-4 w-4 mr-2 inline-block" /> Logout
                </Button>
              </>
            ) : (
              <>
                <NavLink
                  to="/auth/register"
                  className={({ isActive }) =>
                    `text-white hover:bg-blue-600 px-4 py-2 transition-colors ${isActive ? "bg-blue-700" : ""
                    }`
                  }
                  onClick={toggleMobileMenu}
                >
                  <UserPlus className="h-4 w-4 mr-2 inline-block" /> Register
                </NavLink>
                <NavLink
                  to="/auth/login"
                  className={({ isActive }) =>
                    `text-white hover:bg-blue-600 px-4 py-2 transition-colors ${isActive ? "bg-blue-700" : ""
                    }`
                  }
                  onClick={toggleMobileMenu}
                >
                  <LogIn className="h-4 w-4 mr-2 inline-block" /> Login
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
