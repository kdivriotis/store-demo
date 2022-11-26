import { FC } from "react";
import { IconType } from "react-icons";

import styles from "./SidebarIcon.module.css";

interface SidebarIconProps {
  Icon: IconType;
}

const SidebarIcon: FC<SidebarIconProps> = ({ Icon }) => {
  return <Icon className={styles["sidebar-icon"]} />;
};

export default SidebarIcon;
