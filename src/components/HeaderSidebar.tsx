'use client'

import { ChevronsUpDown, Plus } from "lucide-react"
import Logo from "../assets/svg/logo.svg"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { useState } from "react"


const status = [
  {
    name: "Fechado",
    color: "red"
  },
  {
    name: "Aberto",
    color: "green"
  },
  {
    name: "Fechando",
    color: "orange"
  }
]

export function HeaderSidebar({nameStore}: { nameStore: string}) {
  const { isMobile } = useSidebar()
  const [activeStatus, setActiveStatus] = useState(status[0])

  if (!activeStatus) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground focus-visible:shadow-none"
            >
              <div className="flex aspect-square size-7 items-center justify-center rounded-lg bg-white text-sidebar-primary-foreground">
                <Image alt="Logotipo" src={Logo} className="size-6" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  Passaporte do Jack
                </span>
                <div className="flex items-center gap-2">
                  <span className="truncate text-xs">{activeStatus.name}</span>
                  <div className={` size-2 rounded-full bg-${activeStatus.color}-500`}></div>
                </div>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Status
            </DropdownMenuLabel>
            {status.map((stt, index) => (
              <DropdownMenuItem
                key={stt.name}
                onClick={() => setActiveStatus(stt)}
                className="gap-2 p-2"
              >
                {stt.name}
                <DropdownMenuShortcut>
                  <div className={` size-2 rounded-full bg-${stt.color}-500`}></div>
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
