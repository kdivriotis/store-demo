import { FC, useState } from "react";

import { ModalDialog, ModalDialogActionStyle } from "../..";

import styles from "./RequestCard.module.css";

interface RequestCardProps {
  id: string;
  storeName: string;
  siteUrl: string;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  isLoading: boolean;
}

const RequestCard: FC<RequestCardProps> = ({
  id,
  storeName,
  siteUrl,
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
      <div className={styles["request-url"]}>
        <a href={siteUrl} target="_blank" rel="noopener noreferrer">
          {siteUrl}
        </a>
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
          title={showAcceptDialog ? "Αποδοχή Συνδέσμου" : "Απόρριψη Συνδέσμου"}
          content={`Είστε σίγουροι ότι θέλετε να ${
            showAcceptDialog ? "αποδεχτείτε" : "απορρίψετε"
          } το σύνδεμο ${siteUrl} για το κατάστημα ${storeName};`}
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
