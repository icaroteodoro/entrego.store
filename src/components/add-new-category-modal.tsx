import { useState } from "react";
import { Check, PlusCircle, X } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Alert, AlertDescription } from "./ui/alert";

interface iNewCategoryModal {
  saveCategory: () => Promise<void>;
  name: string;
  setName: (name: string) => void;
  disabled?: boolean;
}

export default function AddNewCategoryModal(props: iNewCategoryModal) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.setName(e.target.value);
    if (e.target.value.trim()) {
      setError(false);
    }
  };

  const resetState = () => {
    props.setName("");
    setError(false);
    setSuccessMessage("");
  };

  const handleSaveCategory = async () => {
    // Validação
    if (!props.name.trim()) {
      setError(true);
      return;
    }

    setIsLoading(true);
    try {
      await props.saveCategory();
      setSuccessMessage("Categoria adicionada com sucesso!");
      
      // Fechar o modal após um breve período
      setTimeout(() => {
        setIsOpen(false);
        resetState();
      }, 1500);
    } catch (error) {
      console.error("Erro ao salvar categoria:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    resetState();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetState();
    }}>
      <DialogTrigger className="w-10" asChild>
        <Button 
          className="bg-white text-zinc-500 hover:cursor-pointer border hover:bg-zinc-100 flex justify-center"
          disabled={props.disabled}
          onClick={() => setIsOpen(true)}
        >
          <PlusCircle className="h-4 w-4"/>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar categoria</DialogTitle>
          <DialogDescription>
            Insira o nome da nova categoria de produtos
          </DialogDescription>
        </DialogHeader>

        {successMessage && (
          <Alert className="bg-green-50 border-green-200 text-green-800">
            <Check className="h-4 w-4 text-green-600" />
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="categoryName" className="text-right">
              Nome*
            </Label>
            <div className="col-span-3">
              <Input
                id="categoryName"
                value={props.name}
                onChange={handleNameChange}
                className={error ? "border-red-500" : ""}
                disabled={isLoading || !!successMessage}
                placeholder="Digite o nome da categoria"
                autoFocus
              />
              {error && (
                <p className="text-red-500 text-xs mt-1">Nome da categoria é obrigatório</p>
              )}
            </div>
          </div>

          <div className="text-xs text-gray-500 mt-2">
            * Campo obrigatório
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button 
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 hover:cursor-pointer"
            onClick={handleClose}
            disabled={isLoading}
          >
            <X className="mr-2" />
            Cancelar
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-500 hover:cursor-pointer"
            onClick={handleSaveCategory}
            disabled={isLoading || !!successMessage}
          >
            {isLoading ? (
              <span className="animate-pulse">Processando...</span>
            ) : (
              <>
                <Check className="mr-2" />
                Salvar categoria
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}