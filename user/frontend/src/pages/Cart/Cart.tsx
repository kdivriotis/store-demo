import {
  FC,
  useContext,
  useEffect,
  useMemo,
  useCallback,
  useState,
} from "react";
import classNames from "classnames";

import { useHttp } from "../../hooks";

import { AuthContext, CartContext } from "../../context";
import { AuthContextType } from "../../interfaces/AuthContext";
import { CartContextType } from "../../interfaces/CartContext";

import { CartProduct } from "../../interfaces/Product";

import { Navbar, Footer, ErrorText, LoadingSpinner } from "../../components";
import {
  CartHeader,
  CartTotal,
  ProductsList,
  SubmitOrder,
} from "../../components/Cart";

import styles from "./Cart.module.css";

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

const Cart: FC = () => {
  const { auth } = useContext(AuthContext) as AuthContextType;
  const { cart } = useContext(CartContext) as CartContextType;

  const { isLoading, error, sendRequest } = useHttp();
  const [products, setProducts] = useState<Product[]>([]);

  const cartProducts: CartProduct[] = useMemo(() => {
    if (cart.length === 0) return [];
    const productsInCart: Product[] = products.filter(
      (product) => cart.findIndex((c) => c.id === product.id) !== -1
    );

    return productsInCart.map((product) => {
      const cartProduct = cart.find((c) => c.id === product.id);
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl:
          product.imageUrls && product.imageUrls.length > 0
            ? product.imageUrls[0]
            : undefined,
        quantity: cartProduct ? cartProduct.quantity : 0,
      };
    });
  }, [products, cart]);

  // Get profile info from API and set state
  const getProductInfo = useCallback(() => {
    // transform API response
    const transformResponse = (response: ApiResponse) => {
      if (!response.products || response.products.length === 0) setProducts([]);
      else setProducts(response.products);
    };

    if (!cart || cart.length === 0) {
      setProducts([]);
      return;
    }

    // send GET request to API's route /product/details
    const url = `${process.env.REACT_APP_API_URL}/product/details`;
    sendRequest({ url, method: "GET", token: auth.token }, transformResponse);
  }, [/*cart, */ auth.token, setProducts, sendRequest]);

  // On initial page load, get the profile info
  useEffect(() => getProductInfo(), [getProductInfo]);

  let content = (
    <div className={styles["spinner"]}>
      <LoadingSpinner />
    </div>
  );
  if (!isLoading && error) {
    content = <ErrorText message={error} />;
  } else if (!isLoading) {
    content = <ProductsList products={cartProducts} />;
  }

  return (
    <>
      <Navbar showImage={false} />
      <div className={classNames("section-padding", styles["cart-container"])}>
        <CartHeader />
        {content}
        <CartTotal products={cartProducts} />
        <SubmitOrder products={cartProducts} />
      </div>
      <Footer />
    </>
  );
};

export default Cart;
