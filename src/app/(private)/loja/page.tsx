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
import { Label } from "@/components/ui/label";
import { useSidebar } from "@/components/ui/sidebar";
import HeaderCardStore from "@/components/header-card-store";

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
  const { setPageTitle } = useSidebar();

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
    <section className="flex flex-col items-center justify-start min-h-[calc(100vh-4rem)] bg-zinc-50/30 py-8">
      <div className="container w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight mb-6">Minha Loja</h2>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6">
          <Card className="w-full rounded-xl shadow-sm overflow-hidden border-zinc-200">
            <HeaderCardStore srcCoverImg={store.urlCoverImage} srcProfileImg={store.urlProfileImage} />
            <div className="px-6 py-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-zinc-900">{store.name}</h3>
                  <p className="text-zinc-500">{store.description}</p>
                </div>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold border border-primary/20">
                  {getCategoryDisplayName(store.category)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-4">
                  <div className="p-4 bg-zinc-50 rounded-lg border">
                    <h4 className="font-semibold text-zinc-700 mb-2 flex items-center gap-2">
                      <LockIcon size={14} className="text-zinc-400" /> Informações de Registro
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-zinc-500 uppercase tracking-wider">ID da Loja</p>
                        <p className="font-mono text-sm text-zinc-800">{store.id}</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500 uppercase tracking-wider">Documento (CPF/CNPJ)</p>
                        <p className="font-mono text-sm text-zinc-800">{store.document}</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500 uppercase tracking-wider">Email cadastrado</p>
                        <p className="font-mono text-sm text-zinc-800">{store.email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-zinc-800">Dados Editáveis</h4>
                    {!isEditing && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditMode({ name: true, description: true, category: true });
                          setIsEditing(true);
                        }}
                        className="text-zinc-600 hover:text-primary hover:border-primary/50 hover:bg-primary/5 cursor-pointer"
                      >
                        <PencilIcon size={14} className="mr-2" /> Editar Dados
                      </Button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <Label className="text-zinc-600">Nome da Loja</Label>
                      {editMode.name ? (
                        <Input
                          value={editValues.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          className="bg-white"
                        />
                      ) : (
                        <div className="p-2 border border-transparent rounded-md text-zinc-800 font-medium">
                          {store.name}
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <Label className="text-zinc-600">Categoria</Label>
                      {editMode.category ? (
                        <Select
                          defaultValue={editValues.category}
                          value={editValues.category}
                          onValueChange={handleCategoryChange}
                        >
                          <SelectTrigger className="w-full bg-white">
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
                        <div className="p-2 border border-transparent rounded-md text-zinc-800 font-medium">
                          {getCategoryDisplayName(store.category)}
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <Label className="text-zinc-600">Descrição</Label>
                      {editMode.description ? (
                        <Textarea
                          value={editValues.description}
                          onChange={(e) => handleChange('description', e.target.value)}
                          className="min-h-[100px] bg-white"
                        />
                      ) : (
                        <div className="p-2 border border-transparent rounded-md text-zinc-800 text-sm">
                          {store.description}
                        </div>
                      )}
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end gap-3 pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        className="border-zinc-200 text-zinc-600 hover:bg-zinc-50 cursor-pointer"
                      >
                        <XIcon size={16} className="mr-2" /> Cancelar
                      </Button>
                      <Button
                        onClick={handleSave}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                      >
                        <CheckIcon size={16} className="mr-2" /> Salvar Alterações
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}