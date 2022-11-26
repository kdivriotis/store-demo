import {
  FC,
  useContext,
  useState,
  useEffect,
  ChangeEvent,
  FocusEvent,
} from "react";
import classNames from "classnames";

import { CartContext } from "../../../context";
import { CartContextType } from "../../../interfaces/CartContext";

import { ImageSlider } from "../../index";

import styles from "./ProductCard.module.css";

interface ProductCardProps {
  id: number;
  name: string;
  shortDescription: string;
  price: number;
  imageUrls: string[] | null | undefined;
}

const ProductCard: FC<ProductCardProps> = ({
  id,
  name,
  shortDescription,
  price,
  imageUrls,
}) => {
  const {
    getQuantity,
    increaseQuantity,
    decreaseQuantity,
    changeQuantity,
    removeFromCart,
  } = useContext(CartContext) as CartContextType;

  const quantity = getQuantity(id);
  const [currentQuantity, setCurrentQuantity] = useState<string>(`${quantity}`);
  useEffect(() => setCurrentQuantity(`${quantity}`), [quantity]);

  const quantityBlurHandler = (event: FocusEvent<HTMLInputElement>) => {
    const actQuantity = parseInt(currentQuantity);
    if (isNaN(actQuantity)) setCurrentQuantity(`${quantity}`);
    else changeQuantity(id, actQuantity);
  };

  const quantityChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentQuantity(event.target.value);
  };

  return (
    <section id={name} className={classNames(styles["product-card"])}>
      {imageUrls && imageUrls.length > 0 ? (
        <div
          className={classNames(styles["product-card_image"])}
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
      ) : (
        <div className={classNames(styles["product-card_no-image"])}>
          <p>{name}</p>
        </div>
      )}
      <div className={classNames(styles["product-card_content"])}>
        <h1 className={classNames(styles["product-card_name"])}>{name}</h1>
        <p className={classNames(styles["product-card_description"])}>
          {shortDescription}
        </p>
        <p className={classNames(styles["product-card_price"])}>{price} €</p>
      </div>
      {quantity > 0 ? (
        <>
          <div className={classNames(styles["product-card_cart-actions"])}>
            <button
              onClick={() => decreaseQuantity(id)}
              aria-label="Μείωση Ποσότητας"
            >
              -
            </button>
            <input
              aria-label="Τρέχουσα Ποσότητα"
              id={`${name}-quantity`}
              type="number"
              step={1}
              min={0}
              max={99}
              value={currentQuantity}
              onChange={quantityChangeHandler}
              onBlur={quantityBlurHandler}
            />
            <button
              onClick={() => increaseQuantity(id)}
              aria-label="Αύξηση Ποσότητας"
            >
              +
            </button>
          </div>
          <button
            className={classNames(styles["product-card_cart-btn"], "btn-error")}
            onClick={() => removeFromCart(id)}
          >
            Αφαίρεση
          </button>
        </>
      ) : (
        <button
          className={classNames(styles["product-card_cart-btn"], "btn-primary")}
          onClick={() => increaseQuantity(id)}
        >
          Προσθήκη στο Καλάθι
        </button>
      )}
    </section>
  );
};

export default ProductCard;
