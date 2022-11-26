export enum OrderStatus {
  Pending = 0,
  InProgress = 1,
  Confirmed = 2,
  Canceled = 3,
  Rejected = 4,
}

export interface Order {
  id: string;
  orderDate: string;
  status: OrderStatus;
  transactionDate: string;
  totalPrice: number;
  comment: string | null;
}

export interface OrderItem {
  quantity: number;
  price: number;
  productName: string | null;
}
