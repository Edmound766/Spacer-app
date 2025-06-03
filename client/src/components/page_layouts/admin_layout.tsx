import { AppSidebar } from "../AppSidebar";
import { SidebarTrigger } from "../ui/sidebar";

export default function Adminlayout() {
  return (
    <div>
      <AppSidebar />
      <main>
        <SidebarTrigger />
      </main>
    </div>
  )
}
