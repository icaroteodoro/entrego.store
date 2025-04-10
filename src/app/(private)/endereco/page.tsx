'use client'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { iAddress, getStoreAddress, updateStoreAddress } from "@/services/store-service";
import { useEffect, useState } from "react";
import { PencilIcon, XIcon, CheckIcon, LockIcon, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSidebar } from "@/components/ui/sidebar";


export default function Endereco() {
  const [address, setAddress] = useState<iAddress>();
  const [editMode, setEditMode] = useState({
    id: false,
    cep: false,
    number: false,
    street: false,
    complement: false,
    neighborhood: false,
    city: false,
    country: false,
  });
  const [editValues, setEditValues] = useState<iAddress>({} as iAddress);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setPageTitle } = useSidebar();

  useEffect(() => {
    viewAddress();
    setPageTitle("Endereço");
  }, []);

  useEffect(() => {
    if (address) {
      const newEditMode = { ...editMode };
      Object.keys(address).forEach((key) => {
        if (address[key as keyof iAddress] === null) {
          newEditMode[key as keyof typeof editMode] = true;
        }
      });
      setEditMode(newEditMode);
    }
  }, [address]);

  async function viewAddress() {
    try {
      const address = await getStoreAddress();
      setAddress(address);
      setEditValues(address);
      setError(null);
    } catch (err) {
      setError("Erro ao carregar informações da loja. Por favor, tente novamente.");
    }
  }

  const handleChange = (field: keyof iAddress, value: string) => {
    setEditValues({ ...editValues, [field]: value });
  };

  const handleEdit = (field: keyof typeof editMode) => {
    const newEditMode = { ...editMode };
    newEditMode[field] = true;
    setEditMode(newEditMode);
    setIsEditing(true);
  };


  const handleSave = async () => {
    try {
      const response = await updateStoreAddress(editValues);
      if (response) {
        setAddress(editValues);
        setEditMode({
          id: false,
          cep: false,
          number: false,
          street: false,
          complement: false,
          neighborhood: false,
          city: false,
          country: false,
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
    setEditValues(address || {} as iAddress);
    setEditMode({
      id: false,
      cep: false,
      number: false,
      street: false,
      complement: false,
      neighborhood: false,
      city: false,
      country: false,
    });
    setIsEditing(false);
    setError(null);
  };


  if (!address) {
    return (
      <section className="flex items-center justify-center py-8">
        <div className="container">
          <Card className="w-full p-8 text-center">
            <p>Carregando o endereço da loja...</p>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="flex items-center justify-center py-8">
      <div className="container max-w-3xl">
        <h2 className="text-3xl font-semibold mb-5">Meu endereço</h2>

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
            <CardTitle className="text-2xl">Detalhes do Endereço</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* CEP */}
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex-1">
                <p className="text-sm text-primary mb-1">CEP</p>
                {editMode.cep || address.cep === null ? (
                  <Input
                    value={editValues.cep || ''}
                    onChange={(e) => handleChange('cep', e.target.value)}
                  />
                ) : (
                  <p className="font-medium text-lg">{address.cep}</p>
                )}
              </div>
              {!editMode.cep && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit('cep')}
                  className="text-zinc-600 hover:text-zinc-800 hover:bg-zinc-50 hover:cursor-pointer"
                >
                  <PencilIcon size={16} />
                </Button>
              )}
            </div>

            {/* Rua */}
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex-1">
                <p className="text-sm text-primary mb-1">Rua</p>
                {editMode.street || address.street === null ? (
                  <Input
                    value={editValues.street || ''}
                    onChange={(e) => handleChange('street', e.target.value)}
                  />
                ) : (
                  <p className="font-medium">{address.street}</p>
                )}
              </div>
              {!editMode.street && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit('street')}
                  className="text-zinc-600 hover:text-zinc-800 hover:bg-zinc-50 hover:cursor-pointer"
                >
                  <PencilIcon size={16} />
                </Button>
              )}
            </div>

            {/* Número */}
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex-1">
                <p className="text-sm text-primary mb-1">Número</p>
                {editMode.number || address.number === null ? (
                  <Input
                    value={editValues.number || ''}
                    onChange={(e) => handleChange('number', e.target.value)}
                  />
                ) : (
                  <p className="font-medium">{address.number}</p>
                )}
              </div>
              {!editMode.number && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit('number')}
                  className="text-zinc-600 hover:text-zinc-800 hover:bg-zinc-50 hover:cursor-pointer"
                >
                  <PencilIcon size={16} />
                </Button>
              )}
            </div>

            {/* Bairro */}
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex-1">
                <p className="text-sm text-primary mb-1">Bairro</p>
                {editMode.neighborhood || address.neighborhood === null ? (
                  <Input
                    value={editValues.neighborhood || ''}
                    onChange={(e) => handleChange('neighborhood', e.target.value)}
                  />
                ) : (
                  <p className="font-medium">{address.neighborhood}</p>
                )}
              </div>
              {!editMode.neighborhood && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit('neighborhood')}
                  className="text-zinc-600 hover:text-zinc-800 hover:bg-zinc-50 hover:cursor-pointer"
                >
                  <PencilIcon size={16} />
                </Button>
              )}
            </div>

            {/* Cidade */}
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex-1">
                <p className="text-sm text-primary mb-1">Cidade</p>
                {editMode.city || address.city === null ? (
                  <Input
                    value={editValues.city || ''}
                    onChange={(e) => handleChange('city', e.target.value)}
                  />
                ) : (
                <p className="font-medium">{address.city}</p>
                )}
              </div>
              {!editMode.city && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit('city')}
                  className="text-zinc-600 hover:text-zinc-800 hover:bg-zinc-50 hover:cursor-pointer"
                >
                  <PencilIcon size={16} />
                </Button>
              )}
            </div>

            {/* País */}
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex-1">
                <p className="text-sm text-primary mb-1">País</p>
                {editMode.country || address.country === null ? (
                  <Input
                    value={editValues.country || ''}
                    onChange={(e) => handleChange('country', e.target.value)}
                  />
                ) : (
                  <p className="font-medium">{address.country}</p>
                )}
              </div>
              {!editMode.country && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit('country')}
                  className="text-zinc-600 hover:text-zinc-800 hover:bg-zinc-50 hover:cursor-pointer"
                >
                  <PencilIcon size={16} />
                </Button>
              )}
            </div>

            {/* Complemento */}
            <div className="flex items-center justify-between ">
              <div className="flex-1">
                <p className="text-sm text-primary mb-1">Complemento</p>
                {editMode.complement || address.complement === null ? (
                  <Input
                    value={editValues.complement || ''}
                    onChange={(e) => handleChange('complement', e.target.value)}
                  />
                ) : (
                  <p className="font-medium">{address.complement}</p>
                )}
              </div>
              {!editMode.complement && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit('complement')}
                  className="text-zinc-600 hover:text-zinc-800 hover:bg-zinc-50 hover:cursor-pointer"
                >
                  <PencilIcon size={16} />
                </Button>
              )}
            </div>

          </CardContent>

          {(isEditing || Object.values(address).some(value => value === null)) && (
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