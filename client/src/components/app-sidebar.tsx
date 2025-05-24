import { NavLink } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "./ui/sidebar";
import {
  BookIcon,
  DollarSign,
  LayoutDashboard,
  LogOut,
  Users,
} from "lucide-react";

const items = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "User Management",
    url: "admin/user-management",
    icon: Users,
  },
  {
    title: "Bookings",
    url: "admin/bookings",
    icon: BookIcon,
  },
  {
    title: "Billings",
    url: "billings",
    icon: DollarSign,
  },
  {
    title: "Logout",
    url: "/home",
    icon: LogOut,
  },
];
export default function AppSidebar() {
  const { isMobile } = useSidebar();
  return (
    <Sidebar>
      {isMobile && <SidebarTrigger className="bg-blue-500" />}
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton  asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `text-white hover:bg-blue-600 px-3 py-2 rounded-md transition-colors ${
                          isActive ? "bg-blue-700" : ""
                        }`
                      }
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
