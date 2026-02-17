import { useEffect, useState } from "react";
import { Check, PlusCircle, X, AlertCircle, XCircle } from "lucide-react";
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
import {
  createCategory,
  getProductCategories,
  iProduct,
  createProduct,
  iProductOptionGroup,
  iProductCategory,
} from "@/services/products-service";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import AddNewCategoryModal from "./add-new-category-modal";
import ProductOptionsForm from "./product-options-form";
import { Alert, AlertDescription } from "./ui/alert";
import { toast } from "sonner";
import { getStore } from "@/services/store-service";

interface AddNewProductModalProps {
  onProductAdded: () => void;
}

export default function AddNewProductModal({ onProductAdded }: AddNewProductModalProps) {
  // Estados para os campos do formulário
  const [name, setName] = useState("");
  const [valor, setValor] = useState("");
  const [productCategory, setProductCategory] = useState<iProductCategory>();
  const [desconto, setDesconto] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [allCategories, setAllCategories] = useState<iProductCategory[] | null>(
    null
  );
  const [optionGroups, setOptionGroups] = useState<iProductOptionGroup[]>([]);


  // Estados para UX
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState({
    name: false,
    valor: false,
    category: false,
    minPrice: false,
  });
  const [minPrice, setMinPrice] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValor = e.target.value;
    const numerico = inputValor.replace(/\D/g, "");
    setMinPrice(numerico ? formatarMoeda(numerico) : "");
    if (numerico) setErrors((prev) => ({ ...prev, minPrice: false }));
  };

  useEffect(() => {
    if (isOpen) {
      getCategories();
    }
  }, [isOpen, successMessage]);

  const getCategories = async () => {
    setIsLoading(true);
    try {
      const categories = await getProductCategories();
      setAllCategories(categories);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatarMoeda = (valor: string) => {
    const numerico = valor.replace(/\D/g, "");
    const valorEmCentavos = parseInt(numerico, 10) || 0;
    const valorEmReais = valorEmCentavos / 100;

    return valorEmReais.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValor = e.target.value;
    const numerico = inputValor.replace(/\D/g, "");
    setValor(numerico ? formatarMoeda(numerico) : "");

    // Remove o erro quando o usuário começa a digitar
    if (numerico) setErrors((prev) => ({ ...prev, valor: false }));
  };

  const handleDescontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputDesconto = e.target.value;
    const numerico = inputDesconto.replace(/[^\d.]/g, "");
    const valorNumerico = parseFloat(numerico);

    if (isNaN(valorNumerico)) {
      setDesconto("");
    } else if (valorNumerico > 100) {
      setDesconto("100%");
    } else {
      setDesconto(numerico ? `${numerico}%` : "");
    }
  };

  const handleCategory = (name: string) => {
    const category = allCategories?.find((category) => category.name === name);
    if (category) {
      setProductCategory(category);
      // Remove o erro quando uma categoria é selecionada
      setErrors((prev) => ({ ...prev, category: false }));
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    // Remove o erro quando o usuário começa a digitar
    if (e.target.value) setErrors((prev) => ({ ...prev, name: false }));
  };

  const validateForm = () => {
    const priceValue = parseFloat(valor.replace(/\D/g, "")) / 100;
    const minPriceValue = minPrice ? parseFloat(minPrice.replace(/\D/g, "")) / 100 : 0;

    const newErrors = {
      name: !name.trim(),
      valor: !valor.trim(),
      category: !productCategory,
      minPrice: minPriceValue > priceValue
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const resetForm = () => {
    setName("");
    setValor("");
    setMinPrice("");
    setProductCategory(undefined);
    setDesconto("");
    setFile(null);
    setOptionGroups([]);
    setErrors({ name: false, valor: false, category: false, minPrice: false });
    setSuccessMessage("");
  };

  const salvarProduto = async () => {
    if (!validateForm()) {
      if (errors.minPrice) { // Although validateForm triggers state update, we can't rely on it immediately here if we wanted to toast. But state update will show red border.
        // toast.error? No need, we use red border.
      }
      return;
    }

    setIsLoading(true);

    try {
      const valorNumerico = parseFloat(valor.replace(/\D/g, "")) / 100;
      const descontoNumerico = parseInt(desconto.replace("%", "")) / 100 || 0;

      const produto: any = {
        name,
        price: valorNumerico,
        minPrice: minPrice ? parseFloat(minPrice.replace(/\D/g, "")) / 100 : undefined,
        productCategory: productCategory!,
        discount: isNaN(descontoNumerico) ? 0 : descontoNumerico,
        optionGroups: optionGroups,
      };

      if (!file) {
        toast('Você deve inserir uma imagem!', {
          icon: <XCircle className="text-red-500" />,
          className: "space-x-3",
        })
        return;
      }

      await createProduct(produto, file);

      setSuccessMessage("Produto adicionado com sucesso!");

      // Notificar que um produto foi adicionado
      onProductAdded();

      // Reset do form após 2 segundos
      setTimeout(() => {
        resetForm();
        setIsOpen(false);
      }, 1000);
    } catch (error) {
      toast("Erro ao salvar produto");
    } finally {
      setIsLoading(false);
    }
  };

  const saveCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      // Criar a nova categoria
      const newCategory = await createCategory(newCategoryName);

      // Atualizar a lista de categorias buscando do servidor
      await getCategories();

      // Selecionar automaticamente a categoria recém-criada
      setProductCategory(newCategory);

      // Remover erro de categoria se existir
      setErrors((prev) => ({ ...prev, category: false }));

      // Limpar o campo de nova categoria
      setNewCategoryName("");

      // Notificar que uma categoria foi adicionada (opcional)
      onProductAdded();

      return Promise.resolve();
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
      return Promise.reject(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-green-600 hover:bg-green-500 hover:cursor-pointer"
          onClick={() => {
            resetForm();
            setIsOpen(true);
          }}
        >
          <PlusCircle className="mr-2" />
          Adicionar produto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] h-[90vh] sm:h-auto sm:max-h-[85vh] flex flex-col p-0 gap-0">
        <div className="p-6 pb-0">
          <DialogHeader>
            <DialogTitle>Adicionar produto</DialogTitle>
            <DialogDescription>
              Preencha os dados do novo produto
            </DialogDescription>
          </DialogHeader>

          {successMessage && (
            <Alert className="bg-green-50 border-green-200 text-green-800 mt-4">
              <Check className="h-4 w-4 text-green-600" />
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome*
              </Label>
              <div className="col-span-3">
                <Input
                  id="name"
                  value={name}
                  onChange={handleNameChange}
                  className={errors.name ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">Nome é obrigatório</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="valor" className="text-right">
                Valor*
              </Label>
              <div className="col-span-3">
                <Input
                  id="valor"
                  value={valor}
                  onChange={handleValorChange}
                  placeholder="R$ 0,00"
                  className={errors.valor ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.valor && (
                  <p className="text-red-500 text-xs mt-1">Valor é obrigatório</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="minPrice" className="text-right">
                Preço Mínimo
              </Label>
              <div className="col-span-3">
                <Input
                  id="minPrice"
                  value={minPrice}
                  onChange={handleMinPriceChange}
                  placeholder="R$ 0,00"
                  className={errors.minPrice ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.minPrice && (
                  <p className="text-red-500 text-xs mt-1">Preço mínimo não pode ser maior que o valor do produto</p>
                )}
                <p className="text-[10px] text-gray-400 mt-1">Opcional. Se preenchido, o valor final do pedido nunca será menor que o Preço Mínimo.</p>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="productCategory" className="text-right">
                Categoria*
              </Label>
              <div className="col-span-3">
                <div className="flex gap-2">
                  <Select
                    onValueChange={handleCategory}
                    disabled={isLoading}
                    value={productCategory?.name}
                  >
                    <SelectTrigger
                      className={`flex-1 ${errors.category ? "border-red-500" : ""
                        }`}
                    >
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {allCategories?.map((category) => (
                          <SelectItem
                            key={category.id || `category-${category.name}`}
                            value={category.name}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <AddNewCategoryModal
                    saveCategory={saveCategory}
                    name={newCategoryName}
                    setName={setNewCategoryName}
                    disabled={isLoading}
                  />
                </div>
                {errors.category && (
                  <p className="text-red-500 text-xs mt-1">
                    Categoria é obrigatória
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="desconto" className="text-right">
                Desconto
              </Label>
              <Input
                id="desconto"
                className="col-span-3"
                value={desconto}
                onChange={handleDescontoChange}
                placeholder="0%"
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label onClick={() => console.log(file)} htmlFor="desconto" className="text-right">
                Imagem
              </Label>
              <Input
                id="file"
                className="col-span-3"
                type="file"
                onChange={e => setFile(e.target.files?.[0] || null)}
                placeholder="0%"
                disabled={isLoading}
              />
            </div>

            <div className="border-t pt-4">
              <ProductOptionsForm
                optionGroups={optionGroups}
                setOptionGroups={setOptionGroups}
                disabled={isLoading}
              />
            </div>

            <div className="text-xs text-gray-500 mt-2">
              * Campos obrigatórios
            </div>
          </div>
        </div>

        <div className="p-6 pt-0">
          <DialogFooter className="gap-2">
            <Button
              className="bg-red-500 hover:bg-red-600 text-white hover:cursor-pointer"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              <X className="mr-2" />
              Cancelar
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-500 hover:cursor-pointer"
              onClick={salvarProduto}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="animate-pulse">Processando...</span>
              ) : (
                <>
                  <Check className="mr-2" />
                  Salvar produto
                </>
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}