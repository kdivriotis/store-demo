import { FC, useState } from "react";

import { ModalDialog, ModalDialogActionStyle } from "../..";

import styles from "./VerifyPartner.module.css";

interface VerifyPartnerProps {
  isVerified: boolean;
  isEmailVerified: boolean;
  onVerify: () => void;
  isLoading: boolean;
  error: string | null;
}

const VerifyPartner: FC<VerifyPartnerProps> = ({
  isVerified,
  isEmailVerified,
  onVerify,
  isLoading,
  error,
}) => {
  const [showDialog, setShowDialog] = useState<boolean>(false);

  if (isVerified && isEmailVerified) return <></>;

  if (!isVerified && !isEmailVerified)
    return (
      <section id="verify-partner" className={styles["section_container"]}>
        <h3>
          Το προφίλ και η διεύθυνση email του συνεργάτη δεν έχουν επιβεβαιωθεί.
          Πατήστε το κουμπί για επιβεβαίωση:
        </h3>
        <div className={styles["btn_container"]}>
          <button
            className={styles["verify_btn"]}
            onClick={() => setShowDialog(true)}
            disabled={isLoading}
          >
            Επιβεβαίωση
          </button>
        </div>
        {error && error.trim() !== "" && (
          <p className={styles["verify_error"]}>{error}</p>
        )}
        {showDialog && (
          <ModalDialog
            title="Επιβεβαίωση Συνεργάτη"
            content="Είστε σίγουροι ότι θέλετε να επιβεβαιώσετε το προφίλ και τη διεύθυνση email του συνεργάτη;"
            actions={[
              {
                text: "Επιβεβαίωση",
                style: ModalDialogActionStyle.Primary,
                onClick: () => {
                  onVerify();
                  setShowDialog(false);
                },
              },
              {
                text: "Ακύρωση",
                style: ModalDialogActionStyle.Secondary,
                onClick: () => setShowDialog(false),
              },
            ]}
            onClose={() => setShowDialog(false)}
          />
        )}
      </section>
    );
  else if (!isVerified)
    return (
      <section id="verify-partner" className={styles["section_container"]}>
        <h3>
          Το προφίλ του συνεργάτη δεν έχει επιβεβαιωθεί. Πατήστε το κουμπί για
          επιβεβαίωση:
        </h3>
        <div className={styles["btn_container"]}>
          <button
            className={styles["verify_btn"]}
            onClick={() => setShowDialog(true)}
            disabled={isLoading}
          >
            Επιβεβαίωση
          </button>
        </div>
        {error && error.trim() !== "" && (
          <p className={styles["verify_error"]}>{error}</p>
        )}
        {showDialog && (
          <ModalDialog
            title="Επιβεβαίωση Συνεργάτη"
            content="Είστε σίγουροι ότι θέλετε να επιβεβαιώσετε το προφίλ του συνεργάτη;"
            actions={[
              {
                text: "Επιβεβαίωση",
                style: ModalDialogActionStyle.Primary,
                onClick: () => {
                  onVerify();
                  setShowDialog(false);
                },
              },
              {
                text: "Ακύρωση",
                style: ModalDialogActionStyle.Secondary,
                onClick: () => setShowDialog(false),
              },
            ]}
            onClose={() => setShowDialog(false)}
          />
        )}
      </section>
    );
  else
    return (
      <section id="verify-partner" className={styles["section_container"]}>
        <h3>
          Η διεύθυνση email του συνεργάτη δεν έχει επιβεβαιωθεί. Πατήστε το
          κουμπί για επιβεβαίωση:
        </h3>
        <div className={styles["btn_container"]}>
          <button
            className={styles["verify_btn"]}
            onClick={() => setShowDialog(true)}
            disabled={isLoading}
          >
            Επιβεβαίωση
          </button>
        </div>
        {error && error.trim() !== "" && (
          <p className={styles["verify_error"]}>{error}</p>
        )}
        {showDialog && (
          <ModalDialog
            title="Επιβεβαίωση Συνεργάτη"
            content="Είστε σίγουροι ότι θέλετε να επιβεβαιώσετε τη διεύθυνση email του συνεργάτη;"
            actions={[
              {
                text: "Επιβεβαίωση",
                style: ModalDialogActionStyle.Primary,
                onClick: () => {
                  onVerify();
                  setShowDialog(false);
                },
              },
              {
                text: "Ακύρωση",
                style: ModalDialogActionStyle.Secondary,
                onClick: () => setShowDialog(false),
              },
            ]}
            onClose={() => setShowDialog(false)}
          />
        )}
      </section>
    );
};

export default VerifyPartner;
