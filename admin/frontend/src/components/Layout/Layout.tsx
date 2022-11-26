import { FC, ReactElement, useState } from "react";

import Sidebar from "../Sidebar/Sidebar";

import styles from "./Layout.module.css";

interface LayoutProps {
  children: ReactElement[] | ReactElement | null;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  return (
    <div className={styles["layout"]}>
      <aside
        className={
          isSidebarOpen
            ? styles["layout-sidebar-open"]
            : styles["layout-sidebar-close"]
        }
      >
        <Sidebar
          isOpen={isSidebarOpen}
          toggleIsOpen={() => setIsSidebarOpen((prev) => !prev)}
        />
      </aside>
      <main
        className={
          isSidebarOpen
            ? styles["layout-main-open"]
            : styles["layout-main-close"]
        }
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
