import {
  iProduct,
} from "@/services/products-service";
import { Edit, Eraser } from "lucide-react";
import { TableBody, TableCell, TableRow } from "./ui/table";
import { useState } from "react";
import ViewProductImage from "./view-product-image";
import EditProductModal from "./edit-product-modal";

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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<iProduct | null>(null);

  const handleEdit = (product: iProduct) => {
    setProductToEdit(product);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setProductToEdit(null);
  };

  return (
    <>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              <ViewProductImage refresh={refresh} src={product.urlImage} productId={product.id} />
            </TableCell>
            <TableCell className="font-mono text-xs text-muted-foreground">{product.id.substring(0, 8)}...</TableCell>
            <TableCell>
              {product.name}
            </TableCell>
            <TableCell>
              {formatToBRL(product.price)}
            </TableCell>
            <TableCell>
              {product.minPrice ? formatToBRL(product.minPrice) : '-'}
            </TableCell>
            <TableCell>
              {product.discount ? `${product.discount}%` : '-'}
            </TableCell>
            <TableCell className="hover:cursor-pointer">
              <Edit onClick={() => handleEdit(product)} className="text-blue-500 hover:text-blue-700 w-5 h-5" />
            </TableCell>
            <TableCell className="hover:cursor-pointer">
              <Eraser
                className="text-red-500 hover:text-red-700 w-5 h-5"
                onClick={() => toggleProductIdDeletion(product.id)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>

      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        product={productToEdit}
        onProductUpdated={refresh}
      />
    </>
  );
}
