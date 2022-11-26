import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";

import { PostBrief } from "../../../interfaces/Post";
import { ModalDialog, ModalDialogActionStyle } from "../..";

import styles from "./NewsCard.module.css";

interface NewsCardProps {
  post: PostBrief;
  isLoading: boolean;
  onDelete: (link: string) => void;
}

const NewsCard: FC<NewsCardProps> = ({ post, onDelete, isLoading }) => {
  const navigate = useNavigate();
  const { title, mainImage, link, summary } = post;
  const [showDialog, setShowDialog] = useState<boolean>(false);

  return (
    <>
      <article className={classNames(styles["news-card"])}>
        {mainImage ? (
          <div
            className={classNames(styles["news-card_image"])}
            onClick={() => navigate(`edit/${link}`)}
          >
            <img src={mainImage} alt={`${title}`} />
          </div>
        ) : (
          <div
            className={classNames(styles["news-card_image"])}
            onClick={() => navigate(`edit/${link}`)}
          >
            <p>{title}</p>
          </div>
        )}
        <div
          className={classNames(styles["news-card_content"])}
          onClick={() => navigate(`edit/${link}`)}
        >
          <h4>{title}</h4>
          <p>{summary}</p>
        </div>
        <button
          className={classNames(styles["news-card_btn"])}
          onClick={() => setShowDialog(true)}
          disabled={isLoading}
        >
          Διαγραφή
        </button>
      </article>
      {showDialog && (
        <ModalDialog
          title="Διαγραφή νέου"
          content={`Είστε σίγουροι ότι θέλετε να διαγράψετε το νέο ${title}; Αυτή η ενέργεια δε μπορεί να αναιρεθεί.`}
          actions={[
            {
              text: "Διαγραφή",
              style: ModalDialogActionStyle.Primary,
              onClick: () => onDelete(link),
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

export default NewsCard;
