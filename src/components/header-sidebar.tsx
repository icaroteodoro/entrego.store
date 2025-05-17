"use client";

import { AlertCircle, ChevronsUpDown, LogOutIcon } from "lucide-react";
import Logo from "../assets/svg/logo.svg";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";
import { logout, verifyAddressStore, verifyImagesStore } from "@/services/store-service";
import { useStore } from "@/context/store-context";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

const statusMap = {
  OPEN: {
    name: "Aberto",
    color: "bg-green-500",
  },
  CLOSED: {
    name: "Fechado",
    color: "bg-red-500",
  },
  CLOSING: {
    name: "Fechando",
    color: "bg-orange-500",
  },
};

export function HeaderSidebar() {
  const { isMobile } = useSidebar();
  const { store, storeStatus, updateStatus } = useStore();
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [messageError, setMessageError] = useState('');



  const [showAlertAddress, setShowAlertAddress] = useState(false);

  if (!store) {
    return null;
  }

  const handleStatusChange = async (status: "OPEN" | "CLOSED" | "CLOSING") => {
    const containAddress = await verifyAddressStore();
    const containImages = await verifyImagesStore();

    if(status === 'OPEN' || status === 'CLOSING') {
      if(containAddress) {
        await updateStatus(status);
        return;
      }
      setMessageError('Você precisa cadastrar todos os campos do seu endereço para poder abrir a loja!');
      setShowAlertAddress(true);
      setTimeout(() => {
        setShowAlertAddress(false);
      }, 5000)
      return;
    }

    if(!containImages) {
      setMessageError('Você precisa cadastrar todas as imagens da loja para poder abrir!');
      setShowAlertAddress(true);
      setTimeout(() => {
        setShowAlertAddress(false);
      }, 5000)
    }

    await updateStatus(status);
  };

  const handleLogoutClick = () => {
    if (storeStatus === "OPEN" || storeStatus === "CLOSING") {
      setShowLogoutAlert(true);
    } else {
      logout();
    }
  };

  return (
    <>
      <Alert className={showAlertAddress ? '' : 'hidden'} variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Opsss</AlertTitle>
        <AlertDescription>
          {messageError}
        </AlertDescription>
      </Alert>
      <AlertDialog open={showLogoutAlert} onOpenChange={setShowLogoutAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Atenção!</AlertDialogTitle>
            <AlertDialogDescription>
              A loja está aberta. Se você sair agora, ela será fechada
              automaticamente. Deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => logout()}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Sair e Fechar Loja
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground focus-visible:shadow-none"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white text-sidebar-primary-foreground">
                  <Image alt="Logotipo" src={store.urlProfileImage} width={400} height={400} className="w-full rounded-lg" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{store.name}</span>
                  <div className="flex items-center gap-2">
                    {storeStatus && (
                      <>
                        <span className="truncate text-xs">
                          {statusMap[storeStatus].name}
                        </span>
                        <div
                          className={`size-2 rounded-full ${statusMap[storeStatus].color}`}
                        ></div>
                      </>
                    )}
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
              <DropdownMenuItem
                onClick={() => handleStatusChange("OPEN")}
                className="gap-2 p-2"
              >
                {statusMap.OPEN.name}
                <DropdownMenuShortcut>
                  <div
                    className={`size-2 rounded-full ${statusMap.OPEN.color}`}
                  ></div>
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange("CLOSING")}
                className="gap-2 p-2"
              >
                {statusMap.CLOSING.name}
                <DropdownMenuShortcut>
                  <div
                    className={`size-2 rounded-full ${statusMap.CLOSING.color}`}
                  ></div>
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange("CLOSED")}
                className="gap-2 p-2"
              >
                {statusMap.CLOSED.name}
                <DropdownMenuShortcut>
                  <div
                    className={`size-2 rounded-full ${statusMap.CLOSED.color}`}
                  ></div>
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={handleLogoutClick}>
                  <LogOutIcon className="mr-2" /> Sair
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}
