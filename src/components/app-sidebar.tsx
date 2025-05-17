"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";
import Link from "next/link";
import { Home, MapPin, NotebookText, NotepadText, Settings, Store } from "lucide-react";
import  {HeaderSidebar}  from "./header-sidebar";
import { useEffect, useState } from "react";
import { verifyImagesStore, verifyAddressStore } from "@/services/store-service";

const items = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "Pedidos",
    url: "/pedidos",
    icon: NotepadText,
  },
  {
    title: "Loja",
    url: "/loja",
    icon: Store,
  },
  {
    title: "Endereço",
    url: "/endereco",
    icon: MapPin,
  },

  {
    title: "Cardápio",
    url: "/cardapio",
    icon: NotebookText,
  },
];



export default function AppSidebar() {
  const {
    state,
    open,
    setOpen,
    openMobile,
    setOpenMobile,
    isMobile,
    toggleSidebar,
    setPageTitle
  } = useSidebar();

  const [containImages, setContainImages] = useState(true);
  const [containAddress, setContainAddres] = useState(true);



  const verifyImages =  async () =>{
    const res = await verifyImagesStore();
    setContainImages(res);
  }
  const verifyAddress =  async () =>{
    const res = await verifyAddressStore();
    setContainAddres(res);
  }

  useEffect(() => {
    verifyImages();
    verifyAddress();
  },[]);


  

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex flex-row justify-strart items-center">
        <SidebarContent>
          <HeaderSidebar/>
        </SidebarContent>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem className="flex justify-between items-center" key={item.title}>
                  <SidebarMenuButton  asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {
                    item.title === 'Loja' ? containImages ? <></> : <div className="w-1.5 h-1.5 bg-rose-400 rounded-full"></div> : <></>
                  }
                  {
                    item.title === 'Endereço' ? containAddress ? <></> : <div className="w-1.5 h-1.5 bg-rose-400 rounded-full"></div> : <></>
                  }
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
