import {
  FC,
  ReactElement,
  createContext,
  useState,
  useMemo,
  useEffect,
} from "react";

import { CartContextType, CartProduct } from "../interfaces/CartContext";

interface CartProviderProps {
  children: ReactElement | ReactElement[];
}

export const CartContext = createContext<CartContextType | null>(null);

const saveLocalStorage = (cart: CartProduct[]) => {
  if (!cart || cart.length === 0) {
    localStorage.removeItem("cart");
    return;
  }

  localStorage.setItem("cart", JSON.stringify(cart));
};

// initial cart data - get from local storage
let storageCart: string | null = localStorage.getItem("cart");
let initCart: CartProduct[] = [];

if (storageCart) {
  // check if saved cart is valid JSON
  try {
    initCart = JSON.parse(storageCart);
  } catch (e) {
    // if invalid, clear cart
    initCart = [];
  }
}
saveLocalStorage(initCart);

const CartProvider: FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartProduct[]>(initCart);
  const totalItems = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  // whenever the cart is changed, save the local storage
  useEffect(() => saveLocalStorage(cart), [cart]);

  /**
   * Get quantity of an item in cart
   * @param {number} id Unique ID of the product to find its quantity in cart
   */
  const getQuantity = (id: number): number => {
    const product = cart.find((p) => p.id === id);
    return product ? product.quantity : 0;
  };

  /**
   * Change Quantity action: change the quantity of an item in cart
   * @param {number} id Unique ID of the product to be changed in cart
   * @param {number} quantity Product's new quantity
   */
  const changeQuantity = (id: number, quantity: number) => {
    const productIndex = cart.findIndex((p) => p.id === id);
    // product does not exist in cart - add
    if (productIndex === -1) {
      if (quantity > 0) setCart((prev) => [...prev, { id, quantity }]);
      return;
    }

    // product exists and new quantity is 0 - remove from cart
    if (quantity <= 0) {
      setCart((prev) => {
        const newCart = [...prev];
        newCart.splice(productIndex, 1);
        return newCart;
      });
      return;
    }

    // product exists and new quantity is a positive number - change the quantity
    setCart((prev) => {
      const newCart = [...prev];
      newCart[productIndex].quantity = quantity;
      return newCart;
    });
  };

  /**
   * Increase a product's quantity in cart
   * @param {number} id Unique ID of the product to increase its quantity
   */
  const increaseQuantity = (id: number) => {
    const product = cart.find((p) => p.id === id);
    if (product) changeQuantity(id, product.quantity + 1);
    else changeQuantity(id, 1);
  };

  /**
   * Decrease a product's quantity in cart
   * @param {number} id Unique ID of the product to decrease its quantity
   */
  const decreaseQuantity = (id: number) => {
    const product = cart.find((p) => p.id === id);
    if (!product) return;

    changeQuantity(id, product.quantity - 1);
  };

  /**
   * Remove a product from cart
   * @param {number} id Unique ID of the product to be removed
   */
  const removeFromCart = (id: number) => {
    const product = cart.find((p) => p.id === id);
    if (!product) return;

    changeQuantity(id, 0);
  };

  /**
   * Clear the cart
   */
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        totalItems,
        getQuantity,
        changeQuantity,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
