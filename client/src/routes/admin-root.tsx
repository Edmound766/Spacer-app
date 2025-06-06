import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import AppSidebar from "@/components/app-sidebar"
import { Outlet } from 'react-router'

export default function AdminRoot() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className='container'>
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  )
}
