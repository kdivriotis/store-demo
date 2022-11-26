import { FC } from "react";
import classNames from "classnames";

import styles from "./DetailsHeader.module.css";

interface DetailsHeaderProps {
  title: string;
  subtitle?: string;
}

const DetailsHeader: FC<DetailsHeaderProps> = ({ title, subtitle }) => {
  return (
    <section className={classNames(styles["details_header"], "section-padding")}>
      <h1>{title}</h1>
      {subtitle && subtitle.trim() !== "" && <h3>{subtitle}</h3>}
    </section>
  );
};

export default DetailsHeader;
