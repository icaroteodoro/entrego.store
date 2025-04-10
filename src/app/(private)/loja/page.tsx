'use client'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getStore, updateStore, iStore } from "@/services/store-service";
import { useEffect, useState } from "react";
import { PencilIcon, XIcon, CheckIcon, LockIcon, AlertCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSidebar } from "@/components/ui/sidebar";

// Mapeamento de categorias para exibição mais amigável
const categoryMap = {
  'LANCHES': 'Lanche',
  'PIZZA': 'Pizza',
  'JAPONESA': 'Japonesa',
  'ACAI': 'Açaí',
  'DOCES': 'Doces',
  'SALGADOS': 'Salgados',
  'MARMITA': 'Marmita',
  'BRASILEIRA': 'Brasileira',
  'SORVETE': 'Sorvete',
  'ITALIANA': 'Italiana',
  'PADARIA': 'Padaria',
  'CHINESA': 'Chinesa',
  'GOURMET': 'Gourmet'
};

export default function Loja() {
  const [store, setStore] = useState<iStore>();
  const [editMode, setEditMode] = useState({
    name: false,
    description: false,
    category: false,
    // email e document não podem ser editados
  });
  const [editValues, setEditValues] = useState<iStore>({} as iStore);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {setPageTitle} = useSidebar();

  useEffect(() => {
    viewStore();
    setPageTitle("Loja");
  }, []);

  async function viewStore() {
    try {
      const store = await getStore();
      setStore(store);
      setEditValues(store);
      setError(null);
    } catch (err) {
      setError("Erro ao carregar informações da loja. Por favor, tente novamente.");
    }
  }

  const handleEdit = (field: keyof typeof editMode) => {
    const newEditMode = { ...editMode };
    newEditMode[field] = true;
    setEditMode(newEditMode);
    setIsEditing(true);
  };

  const handleChange = (field: keyof iStore, value: string) => {
    setEditValues({ ...editValues, [field]: value });
  };

  const handleCategoryChange = (value: string) => {
    setEditValues({ ...editValues, category: value });
  };

  const handleSave = async () => {
    try {
      const response = await updateStore(editValues);
      if (response) {
        setStore(editValues);
        setEditMode({
          name: false,
          description: false,
          category: false,
        });
        setIsEditing(false);
        setError(null);
      } else {
        setError("Ocorreu um erro ao salvar as alterações. Por favor, tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      setError("Ocorreu um erro ao salvar as alterações. Por favor, tente novamente.");
    }
  };

  const handleCancel = () => {
    setEditValues(store || {} as iStore);
    setEditMode({
      name: false,
      description: false,
      category: false,
    });
    setIsEditing(false);
    setError(null);
  };

  // Função para obter o nome amigável da categoria
  const getCategoryDisplayName = (categoryCode: string) => {
    return categoryMap[categoryCode as keyof typeof categoryMap] || categoryCode;
  };

  if (!store) {
    return (
      <section className="flex items-center justify-center py-8">
        <div className="container">
          <Card className="w-full p-8 text-center">
            <p>Carregando informações da loja...</p>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="flex items-center justify-center py-8">
      <div className="container max-w-3xl">
        <h2 className="text-3xl font-semibold mb-5">Minha Loja</h2>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        <Card className="w-full rounded-md shadow-md overflow-hidden">
          <CardHeader className="">
            <CardTitle className="text-2xl">Detalhes da Loja</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Nome */}
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex-1">
                <p className="text-sm text-primary mb-1">Nome</p>
                {editMode.name ? (
                  <Input
                    value={editValues.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className=""
                  />
                ) : (
                  <p className="font-medium text-lg">{store.name}</p>
                )}
              </div>
              {!editMode.name && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit('name')}
                  className="text-zinc-600 hover:text-zinc-800 hover:bg-zinc-50 hover:cursor-pointer"
                >
                  <PencilIcon size={16} />
                </Button>
              )}
            </div>

            {/* Descrição */}
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex-1">
                <p className="text-sm text-primary mb-1">Descrição</p>
                {editMode.description ? (
                  <Textarea
                    value={editValues.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    className="min-h-24"
                  />
                ) : (
                  <p className="font-medium">{store.description}</p>
                )}
              </div>
              {!editMode.description && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit('description')}
                  className="text-zinc-600 hover:text-zinc-800 hover:bg-zinc-50 hover:cursor-pointer"
                >
                  <PencilIcon size={16} />
                </Button>
              )}
            </div>

            {/* Categoria */}
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex-1">
                <p className="text-sm text-primary mb-1">Categoria</p>
                {editMode.category ? (
                  <Select
                    defaultValue={editValues.category}
                    value={editValues.category}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categoryMap).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="font-medium">{getCategoryDisplayName(store.category)}</p>
                )}
              </div>
              {!editMode.category && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit('category')}
                  className="text-zinc-600 hover:text-zinc-800 hover:bg-zinc-50 hover:cursor-pointer"
                >
                  <PencilIcon size={16} />
                </Button>
              )}
            </div>

            {/* ID - Não editável */}
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex-1">
                <p className="text-sm text-primary mb-1">Id da loja</p>
                <div className="flex items-center">
                  <p className="font-medium">{store.id}</p>
                  <span className="ml-2 text-zinc-400 text-xs flex items-center">
                    <LockIcon size={12} className="mr-1" /> Não editável
                  </span>
                </div>
              </div>
            </div>

            {/* Email - Não editável */}
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex-1">
                <p className="text-sm text-primary mb-1">Email</p>
                <div className="flex items-center">
                  <p className="font-medium">{store.email}</p>
                  <span className="ml-2 text-zinc-400 text-xs flex items-center">
                    <LockIcon size={12} className="mr-1" /> Não editável
                  </span>
                </div>
              </div>
            </div>

            {/* CPF/CNPJ - Não editável */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-primary mb-1">CPF/CNPJ</p>
                <div className="flex items-center">
                  <p className="font-medium">{store.document}</p>
                  <span className="ml-2 text-zinc-400 text-xs flex items-center">
                    <LockIcon size={12} className="mr-1" /> Não editável
                  </span>
                </div>
              </div>
            </div>
          </CardContent>

          {isEditing && (
            <div className="px-6">
              <CardFooter className="bg-slate-50 flex justify-end space-x-2 py-4 rounded-lg">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="border-red-300 text-red-600 hover:bg-red-50 hover:cursor-pointer"
                >
                  <XIcon size={16} className="mr-2" /> Cancelar
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-green-600 text-white hover:bg-green-700 hover:cursor-pointer"
                >
                  <CheckIcon size={16} className="mr-2" /> Salvar Alterações
                </Button>
              </CardFooter>
            </div>
          )}
        </Card>
      </div>
    </section>
  );
}