import { Separator } from "./ui/separator";
import { SidebarTrigger } from "./ui/sidebar";

export default function InternHeader() {
    return(
        <div className="h-14 w-full flex items-center p-3 gap-3">
            <SidebarTrigger/>

            <Separator orientation="vertical"/>
            
            <span>Página 1 {">"} Página 2</span>
        </div>
    );
}