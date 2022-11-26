import { FC } from "react";
import classNames from "classnames";

import styles from "./SectionHeader.module.css";

interface SectionHeaderProps {
  text: string;
}

const SectionHeader: FC<SectionHeaderProps> = ({ text }) => {
  return (
    <header className={classNames(styles["section-header"])}>
      <h2 className={classNames(styles["section-header_text"], "header-base")}>
        {text}
      </h2>
    </header>
  );
};

export default SectionHeader;
