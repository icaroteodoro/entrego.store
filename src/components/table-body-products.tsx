import {
  deleteProduct,
  iProduct,
  updateProduct,
} from "@/services/products-service";
import { Edit, Eraser, X, Check, CheckCircle2, XCircle, CheckCircle, Search } from "lucide-react";
import { TableBody, TableCell, TableRow } from "./ui/table";
import { useState } from "react";
import { Input } from "./ui/input";
import { toast } from "sonner";
import ViewProductImage from "./view-product-image";

function formatToBRL(value?: number): string {
  if (typeof value !== "number" || isNaN(value)) {
    return "R$ 0,00";
  }

  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

interface iTableBodyProducts {
  products: iProduct[];
  toggleProductIdDeletion: (productId: string) => void;
  refresh: () => void
}

export default function TableBodyProducts({
  products,
  toggleProductIdDeletion,
  refresh
}: iTableBodyProducts) {
  const [editMode, setEditMode] = useState(false);
  const [nameEdit, setNameEdit] = useState("");
  const [discountEdit, setDiscountEdit] = useState(0);
  const [priceEdit, setPriceEdit] = useState(0);
  const [idEdit, setIdEdit] = useState("");

  const handleEditMode = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) {
      return;
    }
    setEditMode(!editMode);
    setNameEdit(product.name);
    setDiscountEdit(product.discount);
    setPriceEdit(product.price);
    setIdEdit(productId);
  };

  const confirmUpdate = async () => {
    const product = products.find((p) => p.id === idEdit);
    if (!product) {
      return;
    }
    if(product.name === nameEdit && product.price === priceEdit && product.discount === discountEdit) {
      setEditMode(false);
      return ;
    }
    const res = await updateProduct(idEdit, nameEdit, priceEdit, discountEdit, product);

    if (res === false) {
      setEditMode(false);
      toast("Erro na atualização do produto!", {
        icon: <XCircle className="text-red-500"/>,
        className: 'space-x-3'
      });
    }
    setEditMode(false);
    refresh();
    toast("Produto Atualizado com sucesso!", {
      icon: <CheckCircle className="text-green-500"/>,
      className: 'space-x-3'
    });
  };

  const cancelUpdate = () => {
    setEditMode(false);
  };

  return (
    <TableBody>
      {products.map((product) => (
        <TableRow key={product.id}>
          <TableCell>
            <ViewProductImage refresh={refresh} src={product.urlImage} productId={product.id}/>
          </TableCell>
          <TableCell onClick={() => console.log(product)}>{product.id}</TableCell>
          <TableCell>
            {editMode && idEdit === product.id ? (
              <Input
                className="w-36"
                onChange={(e) => setNameEdit(e.target.value)}
                defaultValue={nameEdit}
              />
            ) : (
              product.name
            )}
          </TableCell>
          <TableCell>
            {editMode && idEdit === product.id ? (
              <Input
                className="w-24"
                onChange={(e) => setPriceEdit(parseFloat(e.target.value))}
                defaultValue={!isNaN(priceEdit) ? priceEdit.toString() : ""}
              />
            ) : (
              formatToBRL(product.price)
            )}
          </TableCell>
          <TableCell>
            {editMode && idEdit === product.id ? (
              <Input
                className="w-36"
                onChange={(e) => setDiscountEdit(parseInt(e.target.value))}
                defaultValue={!isNaN(discountEdit) ? discountEdit.toString() : ""}
              />
            ) : (
              product.discount + '%'
            )}
          </TableCell>
          <TableCell className="hover:cursor-pointer">
            {editMode && idEdit === product.id ? (
              <div className="flex gap-4">
                <Check
                  className="text-green-500"
                  onClick={() => confirmUpdate()}
                />{" "}
                <X className="text-red-500" onClick={() => cancelUpdate()} />
              </div>
            ) : (
              <Edit onClick={() => handleEditMode(product.id)} />
            )}
          </TableCell>
          <TableCell className="hover:cursor-pointer">
            <Eraser
              className="text-red-500"
              onClick={() => toggleProductIdDeletion(product.id)}
            />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
