import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";

import { PartnerBrief } from "../../../interfaces/Partner";
import { ModalDialog, ModalDialogActionStyle } from "../..";

import styles from "./PartnerCard.module.css";

interface PartnerCardProps {
  partner: PartnerBrief;
  isLoading: boolean;
  onDelete: (link: string) => void;
}

const PartnerCard: FC<PartnerCardProps> = ({
  partner,
  onDelete,
  isLoading,
}) => {
  const navigate = useNavigate();
  const { id, name, surname, storeName, image } = partner;
  const [showDialog, setShowDialog] = useState<boolean>(false);

  return (
    <>
      <article className={classNames(styles["partner-card"])}>
        {image ? (
          <div
            className={classNames(styles["partner-card_image"])}
            onClick={() => navigate(`edit/${id}`)}
          >
            <img src={image} alt={`${storeName}`} />
          </div>
        ) : (
          <div
            className={classNames(styles["partner-card_image"])}
            onClick={() => navigate(`edit/${id}`)}
          >
            <p>{storeName}</p>
          </div>
        )}
        <div
          className={classNames(styles["partner-card_content"])}
          onClick={() => navigate(`edit/${id}`)}
        >
          <h4>{storeName}</h4>
          <p>
            {name} {surname}
          </p>
        </div>
        <button
          className={classNames(styles["partner-card_btn"])}
          onClick={() => setShowDialog(true)}
          disabled={isLoading}
        >
          Διαγραφή
        </button>
      </article>
      {showDialog && (
        <ModalDialog
          title="Διαγραφή συνεργάτη"
          content={`Είστε σίγουροι ότι θέλετε να αφαιρέσετε το κατάστημα ${storeName} από τους συνεργάτες; Αυτή η ενέργεια δε μπορεί να αναιρεθεί.`}
          actions={[
            {
              text: "Διαγραφή",
              style: ModalDialogActionStyle.Primary,
              onClick: () => onDelete(id),
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
    </>
  );
};

export default PartnerCard;
