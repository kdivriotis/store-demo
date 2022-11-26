import { FC, ReactElement } from "react";
import classNames from "classnames";

import { Navbar } from "../../index";

import styles from "./Layout.module.css";

interface LayoutProps {
  children: ReactElement | ReactElement[];
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className={classNames(styles["layout-container"])}>
      <Navbar />
      <div
        className={classNames(
          styles["layout-container_inner"],
          "section-padding"
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default Layout;
