import { FC, useState, useEffect } from "react";
import classNames from "classnames";

import { LoadingSpinner, ErrorText } from "../../index";
import { useHttp } from "../../../hooks";

import ItemCard from "../ItemCard/ItemCard";

import styles from "./ItemsList.module.css";

interface Product {
  id: number;
  name: string;
  description: string;
  imageUrls: string[] | undefined | null;
}

interface ApiResponse {
  products: Product[];
}

const ItemsList: FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { isLoading, error, sendRequest } = useHttp();

  // on initial page load, get all items from API
  useEffect(() => {
    // transform API response
    const transformResponse = (response: ApiResponse) => {
      setProducts(response.products);
    };

    // send GET request to API's route /product
    const url = `${process.env.REACT_APP_API_URL}/product`;
    sendRequest({ url, method: "GET" }, transformResponse);
  }, [sendRequest]);

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
      <ul className={classNames(styles["items-list"])}>
        {products?.length > 0 &&
          products.map((item) => (
            <ItemCard
              key={item.id}
              name={item.name}
              description={item.description}
              imageUrls={item.imageUrls}
            />
          ))}
      </ul>
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

export default ItemsList;
