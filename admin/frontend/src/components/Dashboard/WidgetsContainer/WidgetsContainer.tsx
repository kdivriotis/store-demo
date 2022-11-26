import { FC } from "react";
import classNames from "classnames";

import { WidgetType } from "../../../interfaces/Dashboard";

import Widget from "./Widget/Widget";

import styles from "./WidgetsContainer.module.css";

interface WidgetsContainerProps {
  allPartners: number;
  activePartners: number;
  income: number;
  orders: number;
  isLoading: boolean;
}

const WidgetsContainer: FC<WidgetsContainerProps> = ({
  allPartners,
  activePartners,
  income,
  orders,
  isLoading,
}) => {
  return (
    <div className={classNames(styles["widgets"])}>
      <Widget
        type={WidgetType.Partners}
        counter={activePartners}
        percentage={allPartners > 0 ? (100 * activePartners) / allPartners : 0}
        link="/partners"
        isLoading={isLoading}
      />
      <Widget
        type={WidgetType.Orders}
        counter={orders}
        percentage={null}
        link="/orders"
        isLoading={isLoading}
      />
      <Widget
        type={WidgetType.Earnings}
        counter={income}
        percentage={null}
        link=""
        isLoading={isLoading}
      />
      {/* <Widget /> */}
    </div>
  );
};

export default WidgetsContainer;
