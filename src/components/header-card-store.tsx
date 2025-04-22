import { Check, CheckCircle, Edit2, ImageIcon, X, XCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { updateStoreCoverImage, updateStoreProfileImage } from "@/services/store-service";

interface iHeaderStoreProps {
  srcProfileImg: string;
  srcCoverImg: string;
}

export default function HeaderCardStore({
  srcProfileImg,
  srcCoverImg,
}: iHeaderStoreProps) {
  const [srcProfileImgState, setSrcProfileImgState] = useState(srcProfileImg);
  const [srcCoverImgState, setSrcCoverImgState] = useState(srcCoverImg);

  const [fileEdit, setFileEdit] = useState<File | undefined>(undefined);

  const [openDialogCover, setOpenDialogCover] = useState(false);
  const [openDialogProfile, setOpenDialogProfile] = useState(false);

  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const confirmUpdateImageProfile = async () => {
    setIsLoading(true);
    if (!fileEdit) {
      setError("Adicione um arquivo");
      setIsLoading(false);
      return;
    }
    try {
      const {data} = await updateStoreProfileImage(fileEdit);
      toast("Imagem atualizada com sucesso!", {
        icon: <CheckCircle className="text-green-500" />,
        className: "space-x-3",
      });
      setSrcProfileImgState(data.urlImage);
      setOpenDialogProfile(false);
      setFileEdit(undefined);
      setIsLoading(false);
      return;
    } catch (error) {
      toast(
        "Não foi possível atualizar a imagem. Por favor, tente novamente mais tarde!",
        {
          icon: <XCircle className="text-red-500" />,
          className: "space-x-3",
        }
      );
      setOpenDialogProfile(false);
      setFileEdit(undefined);
      setIsLoading(false);
      return;
    }
  };

  const confirmUpdateImageCover = async () => {
    setIsLoading(true);
    if (!fileEdit) {
      setError("Adicione um arquivo");
      setIsLoading(false);
      return;
    }
    try {
      const {data} = await updateStoreCoverImage(fileEdit);
      toast("Imagem atualizada com sucesso!", {
        icon: <CheckCircle className="text-green-500" />,
        className: "space-x-3",
      });
      console.log(data.urlImage);
      setSrcCoverImgState(data.urlImage);
      setOpenDialogCover(false);
      setFileEdit(undefined);
      setIsLoading(false);
      return;
    } catch (error) {
      toast(
        "Não foi possível atualizar a imagem. Por favor, tente novamente mais tarde!",
        {
          icon: <XCircle className="text-red-500" />,
          className: "space-x-3",
        }
      );
      setOpenDialogCover(false);
      setFileEdit(undefined);
      setIsLoading(false);
      return;
    }
  };

  return (
    <div className="relative w-full h-80 bg-zinc-100">
      <Dialog
        open={openDialogCover}
        onOpenChange={(open) => setOpenDialogCover(open)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar imagem de capa</DialogTitle>
            <DialogDescription>Insira a nova imagem</DialogDescription>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="categoryName" className="text-right">
                  Image*
                </Label>
                <div className="col-span-3">
                  <Input
                    id="file"
                    onChange={(e) => setFileEdit(e.target.files?.[0])}
                    type="file"
                    autoFocus
                  />
                  {error ? (
                    <span className="text-red-500 text-xs">{error}</span>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                * Campo obrigatório
              </div>
            </div>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              disabled={isLoading}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 hover:cursor-pointer"
              onClick={() => setOpenDialogCover(false)}
            >
              <X className="mr-2" />
              Cancelar
            </Button>
            <Button
              disabled={isLoading}
              onClick={() => confirmUpdateImageCover()}
              className="bg-green-600 hover:bg-green-500 hover:cursor-pointer"
            >
              <Check />
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={openDialogProfile}
        onOpenChange={(open) => setOpenDialogProfile(open)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar imagem de perfil</DialogTitle>
            <DialogDescription>Insira a nova imagem</DialogDescription>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="categoryName" className="text-right">
                  Image*
                </Label>
                <div className="col-span-3">
                  <Input
                    id="file"
                    onChange={(e) => setFileEdit(e.target.files?.[0])}
                    type="file"
                    autoFocus
                  />
                  {error ? (
                    <span className="text-red-500 text-xs">{error}</span>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                * Campo obrigatório
              </div>
            </div>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              disabled={isLoading}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 hover:cursor-pointer"
              onClick={() => setOpenDialogProfile(false)}
            >
              <X className="mr-2" />
              Cancelar
            </Button>
            <Button
              disabled={isLoading}
              onClick={() => confirmUpdateImageProfile()}
              className="bg-green-600 hover:bg-green-500 hover:cursor-pointer"
            >
              <Check />
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="group relative w-full h-full flex items-center justify-center">
        {srcCoverImgState ? (
          <Image
            alt="Cover image"
            width={1200}
            height={1200}
            src={srcCoverImgState}
            className="w-full h-full object-cover"
          />
        ) : (
          <ImageIcon size={50} className="text-zinc-400" />
        )}
        <div
          onClick={() => setOpenDialogCover(true)}
          className="opacity-0 invisible group-hover:opacity-100 group-hover:visible absolute bottom-3 right-3 bg-black/50 p-3 rounded-full border-2 border-white cursor-pointer hover:bg-black/70 transition-all duration-300"
        >
          <Edit2 className="text-white" />
        </div>
      </div>

      {/* Container do perfil com seu próprio grupo de hover independente */}
      <div className="group absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2 w-[200px] h-[200px] bg-zinc-100 border-4 border-white rounded-full overflow-hidden">
        {srcProfileImgState ? (
          <Image
            alt="Profile image"
            width={1200}
            height={1200}
            src={srcProfileImgState}
            className="w-full h-full object-cover group-hover:opacity-75"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon size={50} className="text-zinc-400" />
          </div>
        )}
        <div
          onClick={() => setOpenDialogProfile(true)}
          className="opacity-0 invisible group-hover:opacity-100 group-hover:visible absolute bottom-[50%] right-[50%] translate-[50%] bg-black/50 p-3 rounded-full border-2 border-white cursor-pointer hover:bg-black/70 transition-all duration-300"
        >
          <Edit2 className="text-white" />
        </div>
      </div>
    </div>
  );
}
