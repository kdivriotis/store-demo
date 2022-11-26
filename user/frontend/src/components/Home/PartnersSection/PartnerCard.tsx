import { FC } from "react";
import classNames from "classnames";

import { PartnerBrief } from "../../../interfaces/Partner";

import styles from "./PartnerCard.module.css";

interface PartnerCardProps {
  info: PartnerBrief;
  isLast: boolean;
}

const PartnerCard: FC<PartnerCardProps> = ({ info, isLast }) => {
  const { storeName, siteUrl, image } = info;
  return siteUrl && siteUrl.trim() ? (
    <a
      href={siteUrl ?? ""}
      className={classNames(styles["partner-card"])}
      style={{ margin: isLast ? "16px 0 0 0" : "16px 24px 0 0" }}
      target={siteUrl ? "_blank" : ""}
      rel="noopener noreferrer"
      aria-disabled={!siteUrl}
    >
      <div className={classNames(styles["partner-card_image"])}>
        {image ? (
          <img src={image} alt={`${storeName} logo`} />
        ) : (
          <p>{storeName}</p>
        )}
      </div>
      <div className={classNames(styles["partner-card_title"])}>
        <h4>{storeName}</h4>
      </div>
    </a>
  ) : (
    <div
      className={classNames(styles["partner-card"])}
      style={{ margin: isLast ? "16px 0 0 0" : "16px 24px 0 0" }}
      role="card"
    >
      <div className={classNames(styles["partner-card_image"])}>
        {image ? (
          <img src={image} alt={`${storeName} logo`} />
        ) : (
          <p>{storeName}</p>
        )}
      </div>
      <div className={classNames(styles["partner-card_title"])}>
        <h4>{storeName}</h4>
      </div>
    </div>
  );
};

export default PartnerCard;
