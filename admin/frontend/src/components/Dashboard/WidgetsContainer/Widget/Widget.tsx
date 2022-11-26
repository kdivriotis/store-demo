import { FC } from "react";
import { Link } from "react-router-dom";
import { MdAttachMoney } from "react-icons/md";
import { FaUser, FaShoppingCart } from "react-icons/fa";
import classNames from "classnames";

import { WidgetType } from "../../../../interfaces/Dashboard";

import styles from "./Widget.module.css";

interface WidgetProps {
  type: WidgetType;
  counter: number;
  percentage: number | null;
  link: string | null;
  isLoading: boolean;
}

const Widget: FC<WidgetProps> = ({
  type,
  counter,
  percentage,
  link,
  isLoading,
}) => {
  let title: string, linkText: string;
  let Icon: JSX.Element;
  let isMoney: boolean;
  switch (type) {
    case WidgetType.Partners:
      title = "ΣΥΝΕΡΓΑΤΕΣ";
      Icon = (
        <FaUser
          className={classNames(styles["icon"])}
          style={{ color: "crimson", backgroundColor: "rgba(255, 0, 0, 0.2)" }}
        />
      );
      isMoney = false;
      linkText = "Προβολή Συνεργατών";
      break;
    case WidgetType.Orders:
      title = "ΠΑΡΑΓΓΕΛΙΕΣ";
      Icon = (
        <FaShoppingCart
          className={classNames(styles["icon"])}
          style={{
            color: "goldenrod",
            backgroundColor: "rgba(218, 165, 32, 0.2)",
          }}
        />
      );
      isMoney = false;
      linkText = "Προβολή Παραγγελιών";
      break;
    case WidgetType.Earnings:
      title = "ΕΣΟΔΑ";
      Icon = (
        <MdAttachMoney
          className={classNames(styles["icon"])}
          style={{ color: "crimson", backgroundColor: "rgba(255, 0, 0, 0.2)" }}
        />
      );
      isMoney = true;
      linkText = "";
      break;
    default:
      title = "";
      Icon = (
        <MdAttachMoney
          className={classNames(styles["icon"])}
          style={{ color: "green", backgroundColor: "rgba(0, 128, 0, 0.2)" }}
        />
      );
      isMoney = false;
      linkText = "";
  }

  return (
    <div className={classNames(styles["widget"])}>
      <div className={classNames(styles["left"])}>
        <span className={classNames(styles["title"])}>{title}</span>
        <span
          className={classNames(styles["counter"], isLoading ? "pulse" : "")}
        >
          {counter}
          {isMoney && " €"}
        </span>
        {linkText && linkText.trim() !== "" && link && (
          <Link to={link} className={classNames(styles["link"])}>
            {linkText}
          </Link>
        )}
      </div>
      <div className={classNames(styles["right"])}>
        <div
          className={classNames(
            styles["percentage"],
            styles[percentage ? (percentage < 0 ? "negative" : "positive") : ""]
          )}
        >
          {percentage && (
            <>
              {/* <MdKeyboardArrowUp /> */}
              {Math.abs(percentage)}%
            </>
          )}
        </div>
        {Icon}
      </div>
    </div>
  );
};

export default Widget;
