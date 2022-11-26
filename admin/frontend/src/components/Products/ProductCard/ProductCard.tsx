import { FC, useState } from "react";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";

import { ProductBrief } from "../../../interfaces/Product";
import { ModalDialog, ModalDialogActionStyle } from "../..";

import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: ProductBrief;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  isLoading: boolean;
}

const ProductCard: FC<ProductCardProps> = ({
  product,
  onDelete,
  onEdit,
  isLoading,
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);

  const onShowDeleteDialog = () => {
    setShowDeleteDialog(true);
  };

  const onCancelAction = () => {
    setShowDeleteDialog(false);
  };

  const onConfirmAction = () => {
    onDelete(product.id);
    onCancelAction();
  };

  return (
    <div className={styles["product-container"]}>
      <div className={styles["product-info"]}>
        <p>{product.name}</p>
        <p>{product.shortDescription}</p>
        <p>{product.price} €</p>
      </div>
      <div className={styles["product-image"]}>
        {product.image ? (
          <img src={product.image} alt="Κύρια εικόνα προϊόντος" />
        ) : (
          <p>Δεν υπάρχει εικόνα</p>
        )}
      </div>
      <div className={styles["product-actions"]}>
        <AiFillEdit onClick={() => onEdit(product.id)} />
        <AiFillDelete onClick={onShowDeleteDialog} />
      </div>
      <div className={styles["product-actions-small"]}>
        <button
          className={styles["btn_primary"]}
          onClick={() => onEdit(product.id)}
        >
          Επεξεργασία
        </button>
        <button className={styles["btn_error"]} onClick={onShowDeleteDialog}>
          Διαγραφή
        </button>
      </div>
      {showDeleteDialog && (
        <ModalDialog
          title="Διαγραφή προϊόντος"
          content={`Είστε σίγουροι ότι θέλετε να διαγράψετε το προϊόν ${product.name};`}
          actions={[
            {
              text: "Διαγραφή",
              style: ModalDialogActionStyle.Error,
              onClick: onConfirmAction,
            },
            {
              text: "Ακύρωση",
              style: ModalDialogActionStyle.Secondary,
              onClick: onCancelAction,
            },
          ]}
          onClose={onCancelAction}
        />
      )}
    </div>
  );
};

export default ProductCard;
