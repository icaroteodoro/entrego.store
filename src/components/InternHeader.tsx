'use client'
import { Separator } from "./ui/separator";
import { SidebarTrigger, useSidebar } from "./ui/sidebar";

export default function InternHeader() {
    const {pageTitle} = useSidebar();
    return(
        <div className="h-14 w-full flex items-center p-3 gap-3">
            <SidebarTrigger/>

            <Separator orientation="vertical"/>
            
            <span>{pageTitle}</span>
        </div>
    );
}