'use client'
import { Separator } from "./ui/separator";
import { SidebarTrigger, useSidebar } from "./ui/sidebar";

export default function InternHeader() {
    const { pageTitle } = useSidebar();
    return (
        <header className="sticky top-0 z-10 w-full flex items-center h-14 px-4 border-b bg-white gap-2 shrink-0">
            <SidebarTrigger className="-ml-2" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="font-semibold text-sm">{pageTitle}</h1>
        </header>
    );
}