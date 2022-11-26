import { FC } from "react";
import classNames from "classnames";

import { ErrorText } from "../../index";

import { CartProduct } from "../../../interfaces/Product";

import { ProductCard } from "..";

import styles from "./ProductsList.module.css";

interface ProductsListProps {
  products: CartProduct[];
}

const ProductsList: FC<ProductsListProps> = ({ products }) => {
  let content;
  if (products.length > 0) {
    content = (
      <div className={classNames(styles["products-list"])}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  } else {
    content = <p className="text-error">Δεν υπάρχουν προϊόντα στο καλάθι.</p>;
  }

  return <section id="products">{content}</section>;
};

export default ProductsList;
