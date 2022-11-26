import { FC, useContext } from "react";
import classNames from "classnames";

import { useHttp } from "../../../../hooks";

import { AuthContext } from "../../../../context";
import { AuthContextType } from "../../../../interfaces/AuthContext";

import { OrderStatus } from "../../../../interfaces/Order";

import styles from "./OrderActions.module.css";

interface OrderActionsProps {
  id: string;
  status: OrderStatus;
  onRefresh: () => void;
}

const OrderActions: FC<OrderActionsProps> = ({ id, status, onRefresh }) => {
  const { auth } = useContext(AuthContext) as AuthContextType;
  const { isLoading, error, sendRequest } = useHttp();

  // change order's status
  const changeStatus = (newStatus: OrderStatus) => {
    // transform API response
    const transformResponse = (_: any) => {
      onRefresh();
    };

    // send PATCH request to API's route /order/change-status
    const url = `${process.env.REACT_APP_API_URL}/admin/order/change-status/${id}`;
    sendRequest(
      { url, method: "PATCH", token: auth.token, data: { status: newStatus } },
      transformResponse
    );
  };

  // Pending (new) order: Either accept or reject
  if (status === OrderStatus.Pending) {
    return (
      <div className={classNames(styles["actions-container"])}>
        <button
          className={classNames("btn-primary", styles["action-button"])}
          onClick={() => changeStatus(OrderStatus.InProgress)}
          disabled={isLoading}
        >
          Αποδοχή
        </button>
        <button
          className={classNames("btn-error", styles["action-button"])}
          onClick={() => changeStatus(OrderStatus.Rejected)}
          disabled={isLoading}
        >
          Απόρριψη
        </button>
      </div>
    );
  }

  // In Progress order: Either set as confirmed (finished) or cancel
  if (status === OrderStatus.InProgress) {
    return (
      <>
        <div className={classNames(styles["actions-container"])}>
          <button
            className={classNames("btn-primary", styles["action-button"])}
            onClick={() => changeStatus(OrderStatus.Confirmed)}
            disabled={isLoading}
          >
            Ολοκλήρωση
          </button>
          <button
            className={classNames("btn-error", styles["action-button"])}
            onClick={() => changeStatus(OrderStatus.Canceled)}
            disabled={isLoading}
          >
            Ακύρωση
          </button>
        </div>
        {error && error.trim() !== "" && (
          <div className="section-padding" style={{ textAlign: "center" }}>
            <p className="text-error">{error}</p>
          </div>
        )}
      </>
    );
  }

  // Pending (new) order: Either accept or reject
  if (status === OrderStatus.Rejected || status === OrderStatus.Canceled) {
    return (
      <div className={classNames(styles["actions-container"])}>
        <button
          className={classNames("btn-primary", styles["action-button"])}
          onClick={() => changeStatus(OrderStatus.InProgress)}
          disabled={isLoading}
        >
          Αποδοχή
        </button>
      </div>
    );
  }

  return <></>;
};

export default OrderActions;
