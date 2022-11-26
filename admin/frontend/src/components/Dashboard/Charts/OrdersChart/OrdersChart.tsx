import { FC, useEffect, useState, useMemo } from "react";
import classNames from "classnames";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

import {
  DateSelectionBy,
  OrderStatistics,
} from "../../../../interfaces/Statistics";

import styles from "./OrdersChart.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

ChartJS.defaults.layout.padding = 8;

interface OrdersChartProps {
  isLoading: boolean;
  statistics: OrderStatistics[];
  xAxis: string[];
}

const OrdersChart: FC<OrdersChartProps> = ({
  isLoading,
  statistics,
  xAxis,
}) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Στατισικά παραγγελιών",
      },
    },
  };

  const chartData = {
    labels: xAxis,
    datasets: [
      {
        label: "Αριθμός Παραγγελιών",
        data: statistics.map((stat) => stat.orders),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Συνολικά Έσοδα",
        data: statistics.map((stat) => stat.income),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  return (
    <div className={classNames(styles["chart"], isLoading ? "pulse" : "")}>
      <Line options={chartOptions} data={chartData} />
    </div>
  );
};

export default OrdersChart;
