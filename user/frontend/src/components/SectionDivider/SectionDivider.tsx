import { FC } from "react";
import classNames from "classnames";

import styles from "./SectionDivider.module.css";

const SectionDivider: FC = () => {
  return (
    <div className={classNames(styles["section-divider"])}>
      <hr />
    </div>
  );
};

export default SectionDivider;
