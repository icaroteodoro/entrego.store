import AppSidebar from "@/components/AppSidebar";
import InternHeader from "@/components/InternHeader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { StoreProvider } from "@/context/StoreContext";


export default function InternLayout(
  { children }: Readonly<{ children: React.ReactNode }>
) {
  return (
    <StoreProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
          <InternHeader />
          <section className="p-3">
            {children}
          </section>
        </main>
      </SidebarProvider>
    </StoreProvider>
  );
}
