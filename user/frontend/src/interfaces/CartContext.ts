export interface CartProduct {
  id: number;
  quantity: number;
}

export interface CartContextType {
  cart: CartProduct[];
  totalItems: number;
  getQuantity: (id: number) => number;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  removeFromCart: (id: number) => void;
  changeQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
}
