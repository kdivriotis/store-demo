import { FC, useMemo } from "react";
import classNames from "classnames";

import styles from "./OrderPartner.module.css";

interface PartnerInfo {
  name: string;
  surname: string;
  storeName: string;
  vat: string;
  doy: string;
  email: string;
  phone: string;
}

interface OrderPartnerProps {
  partner: PartnerInfo;
}

const OrderPartner: FC<OrderPartnerProps> = ({ partner }) => {
  const { name, surname, storeName, vat, doy, email, phone } = partner;

  return (
    <section id="partner-info" className={classNames(styles["order-partner"])}>
      <h1>Στοιχεία Καταστήματος</h1>
      <div className={classNames(styles["order-partner_content"])}>
        <h3>Ονοματεπώνυμο Ιδιοκτήτη</h3>
        <p>
          {name} {surname}
        </p>
      </div>
      <div className={classNames(styles["order-partner_content"])}>
        <h3>Πληροφορίες Καταστήματος</h3>
        <p>{storeName}</p>
        <p>ΔΟΥ: {doy}</p>
        <p>ΑΦΜ: {vat}</p>
      </div>
      <div className={classNames(styles["order-partner_content"])}>
        <h3>Στοιχεία Επικοινωνίας</h3>
        <p>Τηλέφωνο: {phone}</p>
        <p>Email: {email}</p>
      </div>
    </section>
  );
};

export default OrderPartner;
