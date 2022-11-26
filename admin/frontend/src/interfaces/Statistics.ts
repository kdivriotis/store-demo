export enum DateSelectionBy {
  Year = 1,
  Month = 2,
  Day = 3,
}

export interface ProductStatistics {
  name: string;
  quantity: number;
}

export interface OrderAnalyticStatistics {
  orders: number;
  income: number;
  month?: number;
  day?: number;
  hour?: number;
}

export interface OrderStatistics {
  orders: number;
  income: number;
}
