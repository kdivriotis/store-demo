import { FC, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";

import { useHttp } from "../../../hooks";

import { AuthContext, CartContext } from "../../../context";
import { AuthContextType } from "../../../interfaces/AuthContext";
import { CartContextType } from "../../../interfaces/CartContext";

import { CartProduct } from "../../../interfaces/Product";

import styles from "./SubmitOrder.module.css";

interface SubmitOrderProps {
  products: CartProduct[];
}

interface ApiResponse {
  orderId: string;
}

const SubmitOrder: FC<SubmitOrderProps> = ({ products }) => {
  const { auth } = useContext(AuthContext) as AuthContextType;
  const { clearCart } = useContext(CartContext) as CartContextType;
  const navigate = useNavigate();

  const { isLoading, error, sendRequest } = useHttp();

  // Get profile info from API and set state
  const sendOrder = useCallback(() => {
    // transform API response
    const transformResponse = (response: ApiResponse) => {
      clearCart();
      navigate(`/profile/orders/${response.orderId}`, { replace: true });
      return;
    };

    if (!products || products.length === 0) {
      return;
    }

    // send POST request to API's route /order/new
    const url = `${process.env.REACT_APP_API_URL}/order/new`;
    const cart = products.map((p) => {
      return { id: p.id, quantity: p.quantity };
    });
    sendRequest(
      { url, method: "POST", token: auth.token, data: { cart } },
      transformResponse
    );
  }, [products, auth.token, clearCart, navigate, sendRequest]);

  return (
    <>
      <button
        className={classNames("btn-primary", styles["cart-order-btn"])}
        onClick={sendOrder}
        disabled={!products || products.length === 0 || isLoading}
        aria-label="Αποστολή παραγγελίας"
      >
        Ολοκλήρωση Παραγγελίας
      </button>
      {error && <p className="text-error">{error}</p>}
    </>
  );
};

export default SubmitOrder;
