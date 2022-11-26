import { FC, useState, useContext } from "react";

import { ModalDialog, ModalDialogActionStyle } from "../..";

import { useHttp } from "../../../hooks";

import { AuthContext } from "../../../context";
import { AuthContextType } from "../../../interfaces/AuthContext";

import styles from "./ProductImagesDisplay.module.css";

interface ProductImagesDisplayProps {
  images: string[] | null | undefined;
  onRefresh: () => void;
}

interface ApiResponse {
  message: string;
}

const ProductImagesDisplay: FC<ProductImagesDisplayProps> = ({
  images,
  onRefresh,
}) => {
  const { auth } = useContext(AuthContext) as AuthContextType;
  // useHttp custom hook
  const { error, sendRequest } = useHttp();

  const [deleteIndex, setDeleteIndex] = useState<number>(-1);
  if (!images || images.length === 0) return <></>;

  const deleteProductImage = (): void => {
    if (!images || deleteIndex <= -1 || deleteIndex >= images.length) {
      onCancelAction();
      return;
    }

    const [id, name] = images[deleteIndex].split("/").slice(-2);
    onCancelAction();
    if (!id || !name || name.length < 5) return;
    const imageName = name.split(".").slice(0, -1).join(".");

    // transform API response
    const transformResponse = (response: ApiResponse) => {
      onRefresh();
    };

    // send DELETE request to API's route /admin/delete-image/:id
    const url = `${process.env.REACT_APP_API_URL}/admin/product/delete-image/${id}`;
    sendRequest(
      {
        url,
        method: "DELETE",
        token: auth.token,
        data: { name: imageName.trim() },
      },
      transformResponse
    );
  };

  const onCancelAction = () => {
    setDeleteIndex(-1);
  };

  return (
    <>
      <h2 className={styles["images-title"]}>Εικόνες Προϊόντος</h2>
      {error && error.trim() !== "" && (
        <p className={styles["images-error"]}>{error}</p>
      )}
      <div className={styles["container"]}>
        {images.map((image, idx) => (
          <div
            key={`product-image-${idx}`}
            className={styles["image-container"]}
            onClick={() => setDeleteIndex(idx)}
          >
            <img
              src={image}
              alt="Επιλεγμένη εικόνα"
              aria-label="Πατήστε για επιλογή εικόνας"
            />
          </div>
        ))}
      </div>
      {deleteIndex > -1 && (
        <ModalDialog
          title="Διαγραφή Εικόνας"
          content="Είστε σίγουροι ότι θέλετε να διαγράψετε αυτήν την εικόνα; Προσοχή, η ενέργεια δε μπορεί να αναιρεθεί."
          actions={[
            {
              text: "Διαγραφή",
              style: ModalDialogActionStyle.Error,
              onClick: deleteProductImage,
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
    </>
  );
};

export default ProductImagesDisplay;
