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
import  {HeaderSidebar}  from "./HeaderSidebar";
import { useEffect, useState } from "react";

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
  {
    title: "Configurações",
    url: "/configuracoes",
    icon: Settings,
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
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
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
