"use client";
import TableBodyProducts from "@/components/table-body-products";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getProductCategories,
  iProduct,
  iProductCategory,
  getAllProducts,
  deleteCategory,
  deleteProduct,
} from "@/services/products-service";
import { useEffect, useState } from "react";

import AddNewProductModal from "@/components/add-new-product-modal";
import { CheckCircle2, X, XCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import LightBox from "@/components/view-product-image";
import { useSidebar } from "@/components/ui/sidebar";

export default function Cardapio() {
  const [categories, setCategories] = useState<iProductCategory[]>([]);
  const [products, setProducts] = useState<iProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("");

  const [deleteCategoryOpen, setDeleteCategoryOpen] = useState(false);
  const [categoryIdDeletion, setCategoryIdDeletion] = useState("");

  const [deleteProductOpen, setDeleProductOpen] = useState(false);
  const [productIdDeletion, setProductIdDeletion] = useState("");

  const { setPageTitle } = useSidebar();



  useEffect(() => {
    setPageTitle("Cardápio");
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      await Promise.all([getCategories(), getProducts()]);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function getCategories() {
    try {
      const res = await getProductCategories();
      setCategories(res);

      // Set the default active tab to the first category if available
      if (res.length > 0 && !activeTab) {
        setActiveTab(res[0].name.toLowerCase());
      }
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  }

  async function getProducts() {
    try {
      const res = await getAllProducts();
      setProducts(res);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    }
  }

  const handleRefresh = () => {
    loadData();
  };

  const filtrarPorCategoria = (
    products: iProduct[],
    category: iProductCategory
  ): iProduct[] => {
    return products.filter(
      (product) => product.productCategory?.name === category.name
    );
  };

  const toggleDeletionCategory = (id: string) => {
    setCategoryIdDeletion(id);
    setDeleteCategoryOpen(true);
  };

  const confirmDeletionCategory = async () => {
    try {
      await deleteCategory(categoryIdDeletion);
      handleRefresh();
      toast("Categoria deletada com sucesso!", {
        icon: <CheckCircle2 className="text-green-500" />,
        className: "space-x-3",
      });
    } catch {
      toast("Erro ao deletar categoria!", {
        icon: <XCircle className="text-red-500" />,
        className: "space-x-3",
      });
    }
  };

  const toggleProductIdDeletion = (productId: string) => {
    setProductIdDeletion(productId);
    setDeleProductOpen(true);
  };

  const confirmDeletionProduct = async () => {
    try {
      await deleteProduct(productIdDeletion);
      handleRefresh();
      toast("Produto deletado com sucesso!", {
        icon: <CheckCircle2 className="text-green-500" />,
        className: "space-x-3",
      });
    } catch (error) {
      console.log(error);
      toast("Erro ao deletar produto!", {
        icon: <XCircle className="text-red-500" />,
        className: "space-x-3",
      });
    }
  };



  return (
    <section className="flex items-center justify-center py-8">
      <AlertDialog open={deleteProductOpen} onOpenChange={setDeleProductOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Alerta!
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Tem certeza que quer excluir esse produto?
          </AlertDialogDescription>
          <AlertDialogFooter>
            {/* Cancelar */}
            <AlertDialogCancel
              onClick={() => setDeleProductOpen(false)}
              className="mr-2 hover:cursor-pointer"
            >
              Cancelar
            </AlertDialogCancel>
            {/* Confirmar */}
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 hover:cursor-pointer"
              onClick={() => confirmDeletionProduct()}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog
        open={deleteCategoryOpen}
        onOpenChange={setDeleteCategoryOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Tem certeza que quer excluir essa categoria?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Isso apagara todos os produtos cadastrados com essa categoria!
          </AlertDialogDescription>
          <AlertDialogFooter>
            {/* Cancelar */}
            <AlertDialogCancel
              onClick={() => setDeleteCategoryOpen(false)}
              className="mr-2 hover:cursor-pointer"
            >
              Cancelar
            </AlertDialogCancel>
            {/* Confirmar */}
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 hover:cursor-pointer"
              onClick={() => confirmDeletionCategory()}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="container w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between mb-8 gap-4 sm:gap-0 items-center">
          <h2 className="text-3xl font-bold tracking-tight">Cardápio</h2>
          <AddNewProductModal onProductAdded={handleRefresh} />
        </div>
        <Card className="w-full rounded-xl shadow-sm border overflow-hidden bg-white">
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="animate-pulse text-muted-foreground">Carregando cardápio...</div>
            </div>
          ) : categories.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground flex flex-col items-center gap-2">
              <span className="text-lg">Nenhuma categoria encontrada.</span>
              <span className="text-sm">Adicione uma nova categoria para começar.</span>
            </div>
          ) : (
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              defaultValue={categories[0]?.name.toLowerCase()}
              className="w-full"
            >
              <div className="border-b px-4 py-2 bg-zinc-50/50">
                <TabsList className="w-full justify-start h-auto gap-2 bg-transparent p-0 flex-wrap">
                  {categories.map((category) => (
                    <TabsTrigger
                      className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-border rounded-lg px-4 py-2 h-9 text-sm relative group transition-all hover:bg-zinc-100/80"
                      key={category.id}
                      value={category.name.toLowerCase()}
                    >
                      {category.name}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDeletionCategory(category.id);
                        }}
                        className="rounded-full bg-red-500 absolute -top-1.5 -right-1.5 p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm cursor-pointer hover:bg-red-600"
                      >
                        <X className="text-white w-3 h-3" />
                      </div>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {categories.map((category) => {
                const filteredProducts = filtrarPorCategoria(
                  products,
                  category
                );
                return (
                  <TabsContent
                    key={category.id}
                    value={category.name.toLowerCase()}
                    className="m-0 p-0"
                  >
                    <Table>
                      <TableHeader className="bg-zinc-50">
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="w-[80px]">Imagem</TableHead>
                          <TableHead className="w-[80px]">ID</TableHead>
                          <TableHead>Nome</TableHead>
                          <TableHead>Valor</TableHead>
                          <TableHead>Valor Mínimo</TableHead>
                          <TableHead>Desconto</TableHead>
                          <TableHead className="w-[60px]">Editar</TableHead>
                          <TableHead className="w-[60px]">Excluir</TableHead>
                        </TableRow>
                      </TableHeader>
                      {filteredProducts.length === 0 ? (
                        <tbody>
                          <tr>
                            <td
                              colSpan={8}
                              className="p-12 text-center text-muted-foreground h-[300px]"
                            >
                              <div className="flex flex-col items-center gap-2">
                                <span className="text-lg font-medium">Nenhum produto encontrado</span>
                                <span>Adicione produtos a esta categoria para vê-los aqui.</span>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      ) : (
                        <TableBodyProducts
                          toggleProductIdDeletion={toggleProductIdDeletion}
                          products={filteredProducts}
                          refresh={handleRefresh}
                        />
                      )}
                    </Table>
                  </TabsContent>
                );
              })}
            </Tabs>
          )}
        </Card>
      </div>
    </section>
  );
}
