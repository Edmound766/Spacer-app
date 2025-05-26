import { SidebarProvider, SidebarTrigger } from '../ui/sidebar'
import AppSidebar from "@/components/app-sidebar"
import { Outlet } from 'react-router'

export default function AdminLayout() {
  return (
    <SidebarProvider>
        <AppSidebar/>
        <main className='container'>
            <SidebarTrigger/>
            <Outlet/>
        </main>
    </SidebarProvider>
  )
}
