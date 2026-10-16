import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { SidebarDemo } from "./SidebarDemo"

export default function AppLayout({ children }) {
  return (
    <SidebarProvider>
      <SidebarDemo />
      <main className="flex-1">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
