import { FC } from "react";
import classNames from "classnames";

import { ImageSlider } from "../../index";

import styles from "./ItemCard.module.css";

interface ItemCardProps {
  name: string;
  description: string;
  imageUrls: string[] | null | undefined;
}

const ItemCard: FC<ItemCardProps> = ({ name, description, imageUrls }) => {
  return (
    <li className={classNames(styles["item-card"])}>
      {imageUrls && imageUrls.length > 0 && (
        <div
          className={classNames(styles["item-card_image"])}
          aria-label={`Εικόνες για το προϊόν ${name}`}
        >
          <ImageSlider
            images={imageUrls?.map((image) => {
              return {
                url: image,
                title: name,
              };
            })}
          />
        </div>
      )}
      <h1 className={classNames(styles["item-card_name"])}>{name}</h1>
      <p
        className={classNames(
          styles["item-card_description"],
          "section-padding"
        )}
      >
        {description}
      </p>
    </li>
  );
};

export default ItemCard;
