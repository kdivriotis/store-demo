import { FC } from "react";
import classNames from "classnames";

import ProductsDoughnut from "./ProductsDoughnut/ProductsDoughnut";
import OrdersChart from "./OrdersChart/OrdersChart";

import {
  ProductStatistics,
  OrderStatistics,
} from "../../../interfaces/Statistics";

import styles from "./Charts.module.css";

interface ChartsProps {
  isLoading: boolean;
  products: ProductStatistics[];
  statistics: OrderStatistics[];
  xAxis: string[];
}

const Charts: FC<ChartsProps> = ({
  isLoading,
  products,
  statistics,
  xAxis,
}) => {
  return (
    <div className={classNames(styles["charts"])}>
      <ProductsDoughnut isLoading={isLoading} products={products} />
      <OrdersChart
        isLoading={isLoading}
        statistics={statistics}
        xAxis={xAxis}
      />
    </div>
  );
};

export default Charts;
