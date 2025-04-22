import Image from "next/image";

interface iLightBoxProps {
  src: string;
  productId: string;
  refresh: () => void;
}
import Logo from "../assets/svg/logo.svg";
import {
  Check,
  CheckCircle,
  Edit,
  Edit2,
  Edit3,
  Search,
  X,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { updateImageProduct } from "@/services/products-service";
import { toast } from "sonner";
export default function ViewProductImage({ src, productId, refresh }: iLightBoxProps) {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [srcLightbox, setSrcLightbox] = useState(src);
  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [fileEdit, setFileEdit] = useState<File | undefined>(undefined);

  const toggleLightBox = (src: string) => {
    setOpen(!open);
    setSrcLightbox(src);
  };

  const confirmUpdateImage = async () => {
    setIsLoading(true);
    if (!fileEdit) {
      setError("Adicione um arquivo");
      setIsLoading(false);
      return;
    }
    try {
      await updateImageProduct(fileEdit, productId);
      refresh();
      toast("Imagem atualizada com sucesso!", {
        icon: <CheckCircle className="text-green-500" />,
        className: "space-x-3",
      });
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
      setIsLoading(false);
      return;
    }
  };

  return (
    <div>
      <div
        className="w-[60px] h-[60px] relative rounded-sm overflow-hidden group hover:cursor-pointer"
        onClick={() => toggleLightBox(srcLightbox)}
      >
        <Image
          className=" w-full h-full object-cover"
          width={500}
          height={500}
          alt="Imagem Product"
          src={src}
        />
        <div className="w-full h-full flex justify-center items-center group-hover:bg-black/50 absolute top-0 left-0">
          <Search className="hidden group-hover:block text-white " />
        </div>
      </div>
      <div
        onClick={() => setOpen(false)}
        className={`fixed top-0 left-0 z-100 w-screen h-screen bg-black/70 flex-col items-center justify-center ${
          open ? "flex" : "hidden"
        }`}
      >
        <Image
          className="w-2/6 border-2 rounded-sm"
          width={600}
          height={600}
          alt="Lightbox"
          src={srcLightbox || Logo}
        />

        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
          }}
        >
          <DialogTrigger>
            <div className="border-2 p-2 rounded-full mt-5 hover:cursor-pointer">
              <Edit2 color="white" />
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar imagem</DialogTitle>
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
                      placeholder="Digite o nome da categoria"
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
                onClick={() => setDialogOpen(false)}
              >
                <X className="mr-2" />
                Cancelar
              </Button>
              <Button
                disabled={isLoading}
                onClick={() => confirmUpdateImage()}
                className="bg-green-600 hover:bg-green-500 hover:cursor-pointer"
              >
                <Check />
                Confirmar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
