import { FC, useState, useEffect, useContext } from "react";
import classNames from "classnames";

import { LoadingSpinner, ErrorText } from "../../index";
import { useHttp } from "../../../hooks";

import { AuthContext } from "../../../context";
import { AuthContextType } from "../../../interfaces/AuthContext";

import ProductCard from "../ProductCard/ProductCard";

import styles from "./ProductsGrid.module.css";

interface Product {
  id: number;
  name: string;
  shortDescription: string;
  price: number;
  imageUrls: string[] | undefined | null;
}

interface ApiResponse {
  products: Product[];
}

const ProductsList: FC = () => {
  const { auth } = useContext(AuthContext) as AuthContextType;

  const [products, setProducts] = useState<Product[]>([]);
  const { isLoading, error, sendRequest } = useHttp();

  // on initial page load, get all items from API
  useEffect(() => {
    // transform API response
    const transformResponse = (response: ApiResponse) => {
      setProducts(response.products);
    };

    // send GET request to API's route /product/details
    const url = `${process.env.REACT_APP_API_URL}/product/details`;
    sendRequest({ url, method: "GET", token: auth.token }, transformResponse);
  }, [sendRequest, setProducts, auth.token]);

  let content;
  if (isLoading) {
    content = (
      <div className={styles["spinner"]}>
        <LoadingSpinner />
      </div>
    );
  } else if (!isLoading && error) {
    content = <ErrorText message={error} />;
  } else if (products.length > 0) {
    content = (
      <div className={classNames(styles["products-grid"], "section-padding")}>
        {products?.length > 0 &&
          products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              shortDescription={product.shortDescription}
              price={product.price}
              imageUrls={product.imageUrls}
            />
          ))}
      </div>
    );
  } else {
    content = (
      <p className="text-error section-padding">
        Δε βρέθηκαν προϊόντα. Ελέγξτε τη σύνδεσή σας στο διαδίκτυο και
        προσπαθήστε ξανά
      </p>
    );
  }

  return <section id="products">{content}</section>;
};

export default ProductsList;
