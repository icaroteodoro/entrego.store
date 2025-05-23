import AppSidebar from "@/components/app-sidebar";
import InternHeader from "@/components/intern-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { StoreProvider } from "@/context/store-context";
import { Toaster } from "@/components/ui/sonner"

export default function InternLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <StoreProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
          <InternHeader />
          <section className="p-3">{children}</section>
          <Toaster/>
        </main>
      </SidebarProvider>
    </StoreProvider>
  );
}
