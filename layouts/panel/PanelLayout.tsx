import { SiteHeader } from "@/components/panel/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { PanelSidebar } from "./panel-sidebar"

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <PanelSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-col gap-4 py-4 px-6 md:gap-6 md:py-6">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}