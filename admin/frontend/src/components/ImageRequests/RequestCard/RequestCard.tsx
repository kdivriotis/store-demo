import { FC, useState } from "react";
import { HiArrowNarrowRight } from "react-icons/hi";

import { ModalDialog, ModalDialogActionStyle } from "../..";

import styles from "./RequestCard.module.css";

interface RequestCardProps {
  id: string;
  storeName: string;
  imageUrl: string | undefined | null;
  pendingImageUrl: string;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  isLoading: boolean;
}

const RequestCard: FC<RequestCardProps> = ({
  id,
  storeName,
  imageUrl,
  pendingImageUrl,
  onAccept,
  onReject,
  isLoading,
}) => {
  const [showAcceptDialog, setShowAcceptDialog] = useState<boolean>(false);
  const [showRejectDialog, setShowRejectDialog] = useState<boolean>(false);

  const onShowAcceptDialog = () => {
    setShowAcceptDialog(true);
    setShowRejectDialog(false);
  };

  const onShowRejectDialog = () => {
    setShowAcceptDialog(false);
    setShowRejectDialog(true);
  };

  const onCancelAction = () => {
    setShowAcceptDialog(false);
    setShowRejectDialog(false);
  };

  const onConfirmAction = () => {
    if (showAcceptDialog) onAccept(id);
    else if (showRejectDialog) onReject(id);

    onCancelAction();
  };

  return (
    <div className={styles["request-container"]}>
      <div className={styles["request-store"]}>
        <p>{storeName}</p>
      </div>
      <div className={styles["request-images"]}>
        <div className={styles["request-image"]}>
          <h3>Τρέχουσα Εικόνα</h3>
          <div className={styles["request-image_container"]}>
            {imageUrl ? (
              <img src={imageUrl} alt="Τρέχουσα Εικόνα" />
            ) : (
              <p>Δεν υπάρχει εικόνα</p>
            )}
          </div>
        </div>
        <div className={styles["request-image_icon"]}>
          <HiArrowNarrowRight />
        </div>
        <div className={styles["request-image"]}>
          <h3>Νέα Εικόνα</h3>
          <div className={styles["request-image_container"]}>
            <img src={pendingImageUrl} alt="Νέα Εικόνα" />
          </div>
        </div>
      </div>
      <div className={styles["request-actions"]}>
        <button
          className={styles["request-actions_primary"]}
          onClick={onShowAcceptDialog}
          disabled={isLoading}
        >
          Αποδοχή
        </button>
        <button
          className={styles["request-actions_error"]}
          onClick={onShowRejectDialog}
          disabled={isLoading}
        >
          Απόρριψη
        </button>
      </div>
      {(showAcceptDialog || showRejectDialog) && (
        <ModalDialog
          title={showAcceptDialog ? "Αποδοχή Εικόνας" : "Απόρριψη Εικόνας"}
          content={`Είστε σίγουροι ότι θέλετε να ${
            showAcceptDialog ? "αποδεχτείτε" : "απορρίψετε"
          } τη νέα εικόνα για το κατάστημα ${storeName};`}
          actions={[
            {
              text: showAcceptDialog ? "Επιβεβαίωση" : "Απόρριψη",
              style: showAcceptDialog
                ? ModalDialogActionStyle.Primary
                : ModalDialogActionStyle.Error,
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

export default RequestCard;
