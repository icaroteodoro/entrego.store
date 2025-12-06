import { useEffect, useState } from "react";
import { Check, X, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
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
import {
    getProductCategories,
    iProduct,
    iProductCategory,
    iProductOptionGroup,
    updateProduct,
} from "@/services/products-service";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";
import { toast } from "sonner";
import ProductOptionsForm from "./product-options-form";

interface EditProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: iProduct | null;
    onProductUpdated: () => void;
}

export default function EditProductModal({
    isOpen,
    onClose,
    product,
    onProductUpdated,
}: EditProductModalProps) {
    const [name, setName] = useState("");
    const [valor, setValor] = useState("");
    const [productCategory, setProductCategory] = useState<iProductCategory>();
    const [desconto, setDesconto] = useState("");
    const [optionGroups, setOptionGroups] = useState<iProductOptionGroup[]>([]);

    const [allCategories, setAllCategories] = useState<iProductCategory[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        if (isOpen && product) {
            loadData();
        }
    }, [isOpen, product]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            // 1. Load Categories
            const categories = await getProductCategories();
            setAllCategories(categories);

            // 2. Load Product Data
            if (product) {
                setName(product.name);
                setValor(product.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 }));
                setDesconto(product.discount ? `${product.discount}%` : "");
                setProductCategory(product.productCategory);
                setOptionGroups(product.optionGroups || []);
            }
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
            toast("Erro ao carregar dados do produto");
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


    const handleSave = async () => {
        if (!product || !name || !valor || !productCategory) {
            toast("Preencha os campos obrigatórios");
            return;
        }

        setIsLoading(true);
        try {
            const valorNumerico = parseFloat(valor.replace(/\D/g, "")) / 100;
            const descontoNumerico = parseInt(desconto.replace("%", "")) / 100 || 0;

            const updatedProduct: iProduct = {
                ...product,
                name,
                price: valorNumerico,
                discount: isNaN(descontoNumerico) ? 0 : descontoNumerico,
                productCategory: productCategory,
                optionGroups: optionGroups,
            };

            await updateProduct(updatedProduct);

            setSuccessMessage("Produto atualizado com sucesso!");
            onProductUpdated();

            setTimeout(() => {
                setSuccessMessage("");
                onClose();
            }, 1000);

        } catch (error) {
            console.error(error);
            toast("Erro ao atualizar produto");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[600px] h-[90vh] sm:h-auto sm:max-h-[85vh] flex flex-col p-0 gap-0">
                <div className="p-6 pb-0">
                    <DialogHeader>
                        <DialogTitle>Editar Produto</DialogTitle>
                        <DialogDescription>
                            Edite as informações e opções do seu produto.
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
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nome*</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="valor">Valor*</Label>
                                <Input
                                    id="valor"
                                    value={valor}
                                    onChange={handleValorChange}
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="desconto">Desconto</Label>
                                <Input
                                    id="desconto"
                                    value={desconto}
                                    onChange={handleDescontoChange}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label>Categoria*</Label>
                            <Select
                                value={productCategory?.name}
                                onValueChange={(name) => {
                                    const cat = allCategories?.find(c => c.name === name);
                                    if (cat) setProductCategory(cat);
                                }}
                                disabled={isLoading}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {allCategories?.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="border-t pt-4">
                            <ProductOptionsForm
                                optionGroups={optionGroups}
                                setOptionGroups={setOptionGroups}
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </div>

                <div className="p-6 pt-0">
                    <DialogFooter>
                        <Button variant="outline" onClick={onClose} disabled={isLoading}>
                            Cancelar
                        </Button>
                        <Button onClick={handleSave} disabled={isLoading} className="bg-green-600 hover:bg-green-500">
                            {isLoading ? "Salvando..." : "Salvar Alterações"}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
