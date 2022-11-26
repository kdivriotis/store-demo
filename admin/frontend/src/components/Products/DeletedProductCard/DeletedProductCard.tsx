import { FC, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { FaUndo } from "react-icons/fa";

import { ProductBrief } from "../../../interfaces/Product";
import { ModalDialog, ModalDialogActionStyle } from "../..";

import styles from "./DeletedProductCard.module.css";

interface DeletedProductCardProps {
  product: ProductBrief;
  onDelete: (id: number) => void;
  onRestore: (id: number) => void;
  isLoading: boolean;
}

const DeletedProductCard: FC<DeletedProductCardProps> = ({
  product,
  onDelete,
  onRestore,
  isLoading,
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [showRestoreDialog, setShowRestoreDialog] = useState<boolean>(false);

  const onShowDeleteDialog = () => {
    setShowDeleteDialog(true);
    setShowRestoreDialog(false);
  };

  const onShowRestoreDialog = () => {
    setShowDeleteDialog(false);
    setShowRestoreDialog(true);
  };

  const onCancelAction = () => {
    setShowDeleteDialog(false);
    setShowRestoreDialog(false);
  };

  const onConfirmAction = () => {
    if (showDeleteDialog) onDelete(product.id);
    else if (showRestoreDialog) onRestore(product.id);
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
        <FaUndo onClick={onShowRestoreDialog} />
        <AiFillDelete onClick={onShowDeleteDialog} />
      </div>
      <div className={styles["product-actions-small"]}>
        <button className={styles["btn_primary"]} onClick={onShowRestoreDialog}>
          Επαναφορά
        </button>
        <button className={styles["btn_error"]} onClick={onShowDeleteDialog}>
          Διαγραφή
        </button>
      </div>
      {(showDeleteDialog || showRestoreDialog) && (
        <ModalDialog
          title={
            showDeleteDialog
              ? "Οριστική διαγραφή προϊόντος"
              : "Επαναφορά προϊόντος"
          }
          content={
            showDeleteDialog
              ? `Είστε σίγουροι ότι θέλετε να διαγράψετε οριστικά το προϊόν ${product.name}; Η ενέργεια αυτή δε μπορεί να αναιρεθεί.`
              : `Είστε σίγουροι ότι θέλετε να επαναφέρετε το προϊόν ${product.name}; Το προϊόν θα εμφανίζεται πλέον κανονικά στους επισκέπτες.`
          }
          actions={[
            {
              text: showDeleteDialog ? "Διαγραφή" : "Επαναφορά",
              style: showDeleteDialog
                ? ModalDialogActionStyle.Error
                : ModalDialogActionStyle.Primary,
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

export default DeletedProductCard;
