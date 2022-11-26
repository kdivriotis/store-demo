import { FC, useContext, useState, useMemo, useEffect } from "react";
import { useNavigate, NavigateFunction } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import classNames from "classnames";

import { ProductBrief } from "../../../interfaces/Product";
import { ModalDialog, ModalDialogActionStyle } from "../..";

import { useHttp } from "../../../hooks";

import { AuthContext } from "../../../context";
import { AuthContextType } from "../../../interfaces/AuthContext";

import { ProductCard } from "..";

import styles from "./ProductsGrid.module.css";

interface ProductsGridProps {
  products: ProductBrief[];
  onRefresh: () => void;
}

interface ApiResponse {
  message: string;
}

// Function to check if a product is changed
const isProductChanged = (
  product1: ProductBrief,
  product2: ProductBrief
): boolean => {
  return product1.id !== product2.id || product1.name !== product2.name;
};

const ProductsGrid: FC<ProductsGridProps> = ({
  products: initialProducts,
  onRefresh,
}) => {
  const navigate: NavigateFunction = useNavigate();

  const { auth } = useContext(AuthContext) as AuthContextType;
  const { isLoading, error, sendRequest } = useHttp();

  const [products, setProducts] = useState<ProductBrief[]>([]);
  const [showChangeDialog, setShowChangeDialog] = useState<boolean>(false);

  const isChanged = useMemo(() => {
    if (products.length !== initialProducts.length) return true;
    for (let i = 0; i < products.length; i++) {
      if (isProductChanged(products[i], initialProducts[i])) return true;
    }
    return false;
  }, [products, initialProducts]);

  // whenever initial list of products is changed (e.g. refresh or response from API), update the list of products
  useEffect(() => {
    setProducts(
      initialProducts.map((product, index) => {
        return {
          ...product,
          appearanceOrder: index,
        };
      })
    );
  }, [initialProducts]);

  // handle request to delete a product
  const deleteHandler = (id: number) => {
    // transform API response
    const transformResponse = (response: ApiResponse) => {
      onRefresh();
    };

    const url = `${process.env.REACT_APP_API_URL}/admin/product/delete/temp/${id}`;

    sendRequest({ url, method: "PATCH", token: auth.token }, transformResponse);
  };

  // navigate to edit product page
  const editHandler = (id: number) => {
    navigate(`edit/${id}`);
  };

  // handle change of apperance order
  const changeOrderHandler = () => {
    setShowChangeDialog(false);
    if (!isChanged) return;

    // transform API response
    const transformResponse = (response: ApiResponse) => {
      onRefresh();
    };

    const url = `${process.env.REACT_APP_API_URL}/admin/product/change-order`;

    sendRequest(
      {
        url,
        method: "PATCH",
        token: auth.token,
        data: {
          products: products.map((p, idx) => {
            return {
              id: p.id,
              appearanceOrder: idx,
            };
          }),
        },
      },
      transformResponse
    );
  };

  // Function to update list on drop
  const handleDrop = (droppedItem: any) => {
    // Ignore drop outside droppable container
    if (!droppedItem.destination) return;

    setProducts((prev) => {
      let updatedList = [...prev];
      // Remove dragged item
      const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
      // Add dropped item
      updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
      // Update State
      return updatedList;
    });
  };

  return (
    <div className="section-padding">
      {error && error.trim() !== "" && <h2 className="text-error">{error}</h2>}
      {products && products.length > 0 && (
        <DragDropContext onDragEnd={handleDrop}>
          <Droppable droppableId="list-container">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {products.map((product, index) => (
                  <Draggable
                    key={`drg-${product.id}-${index}`}
                    draggableId={`drg-${product.id}-${index}`}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        style={{ margin: "8px 0" }}
                        ref={provided.innerRef}
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                      >
                        <ProductCard
                          product={product}
                          onDelete={deleteHandler}
                          onEdit={editHandler}
                          isLoading={isLoading}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
      <div className={styles["form_btn_container"]}>
        <button
          className={classNames("btn-primary", styles["form_submit_btn"])}
          disabled={isLoading || !isChanged}
          onClick={() => setShowChangeDialog(true)}
        >
          Αποθήκευση Αλλαγών
        </button>
      </div>
      {showChangeDialog && (
        <ModalDialog
          title="Αλλαγή σειράς εμφάνισης"
          content="Είστε σίγουροι ότι θέλετε να αλλάξετε τη σειρά εμφάνισης των προϊόντων;"
          actions={[
            {
              text: "Αλλαγή",
              style: ModalDialogActionStyle.Primary,
              onClick: changeOrderHandler,
            },
            {
              text: "Ακύρωση",
              style: ModalDialogActionStyle.Secondary,
              onClick: () => setShowChangeDialog(false),
            },
          ]}
          onClose={() => setShowChangeDialog(false)}
        />
      )}
    </div>
  );
};

export default ProductsGrid;
