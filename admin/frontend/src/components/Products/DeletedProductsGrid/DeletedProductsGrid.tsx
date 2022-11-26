import { FC, useContext } from "react";

import { ProductBrief } from "../../../interfaces/Product";

import { useHttp } from "../../../hooks";

import { AuthContext } from "../../../context";
import { AuthContextType } from "../../../interfaces/AuthContext";

import { DeletedProductCard } from "..";

interface DeletedProductsGridProps {
  products: ProductBrief[];
  onRefresh: () => void;
}

interface ApiResponse {
  message: string;
}

const DeletedProductsGrid: FC<DeletedProductsGridProps> = ({
  products,
  onRefresh,
}) => {
  const { auth } = useContext(AuthContext) as AuthContextType;
  const { isLoading, error, sendRequest } = useHttp();

  // handle request to delete a product
  const deleteHandler = (id: number) => {
    // transform API response
    const transformResponse = (response: ApiResponse) => {
      onRefresh();
    };

    const url = `${process.env.REACT_APP_API_URL}/admin/product/delete/${id}`;

    sendRequest(
      { url, method: "DELETE", token: auth.token },
      transformResponse
    );
  };

  // handle request to restore a temporarily deleted product
  const restoreHandler = (id: number) => {
    // transform API response
    const transformResponse = (response: ApiResponse) => {
      onRefresh();
    };

    const url = `${process.env.REACT_APP_API_URL}/admin/product/restore/${id}`;

    sendRequest({ url, method: "PATCH", token: auth.token }, transformResponse);
  };

  return (
    <div className="section-padding">
      {error && error.trim() !== "" && <h2 className="text-error">{error}</h2>}
      {products && products.length > 0 && (
        <div>
          {products.map((product, index) => (
            <DeletedProductCard
              key={`del-${product.id}-${index}`}
              product={product}
              onDelete={deleteHandler}
              onRestore={restoreHandler}
              isLoading={isLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DeletedProductsGrid;
