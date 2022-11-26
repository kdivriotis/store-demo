import { FC, useContext } from "react";
import { NavLink } from "react-router-dom";
import classNames from "classnames";
import { IconType } from "react-icons";
import {
  AiOutlineLeft,
  AiOutlineDashboard,
  AiOutlineLink,
} from "react-icons/ai";
import { BsImageFill } from "react-icons/bs";
import { BiLogOut, BiLogIn, BiNews } from "react-icons/bi";
import { FaUser, FaHistory } from "react-icons/fa";
import { MdRestaurantMenu } from "react-icons/md";

import { AuthContext } from "../../context";
import { AuthContextType } from "../../interfaces/AuthContext";

import SidebarIcon from "./SidebarIcon";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  isOpen: boolean;
  toggleIsOpen: () => void;
}

interface MenuNavigation {
  name: string;
  Icon: IconType;
  gap?: boolean;
  path: string;
}

const Sidebar: FC<SidebarProps> = ({ isOpen, toggleIsOpen }) => {
  const { auth, logout } = useContext(AuthContext) as AuthContextType;

  const navList: MenuNavigation[] = [
    {
      name: "Ταμπλό",
      Icon: AiOutlineDashboard,
      path: "/",
    },
    {
      name: "Παραγγελίες",
      Icon: FaHistory,
      path: "/orders",
    },
    {
      name: "Αιτήματα Συνδέσμου",
      Icon: AiOutlineLink,
      path: "/url-requests",
    },
    {
      name: "Αιτήματα Εικόνας",
      Icon: BsImageFill,
      path: "/image-requests",
    },
    {
      name: "Νέα",
      Icon: BiNews,
      gap: true,
      path: "/news",
    },
    {
      name: "Προϊόντα",
      Icon: MdRestaurantMenu,
      path: "/menu",
    },
    {
      name: "Συνεργάτες",
      Icon: FaUser,
      path: "/partners",
    },
  ];

  return (
    <>
      {/* Open/Close menu icon */}
      <AiOutlineLeft
        className={isOpen ? styles["sidebar-open"] : styles["sidebar-close"]}
        onClick={() => toggleIsOpen()}
      />
      {/* Store logo and name */}
      <div
        className={
          isOpen ? styles["sidebar_logo-open"] : styles["sidebar_logo-close"]
        }
      >
        <img
          src="/images/logo.png"
          alt="Εικόνα καταστήματος"
          className={
            isOpen
              ? styles["sidebar_logo-container-open"]
              : styles["sidebar_logo-container-close"]
          }
        />

        <h1>Store Demo</h1>
      </div>
      {/* Navigations */}
      <nav
        className={
          isOpen ? styles["sidebar_links-open"] : styles["sidebar_links-close"]
        }
      >
        {auth.isLoggedIn ? (
          <ul
            className={
              isOpen
                ? styles["sidebar_links_list-open"]
                : styles["sidebar_links_list-close"]
            }
          >
            {navList.map((navItem: MenuNavigation, index: number) => (
              <li
                key={`nav-${index}`}
                style={{ marginTop: navItem.gap ? "8px" : "4px" }}
              >
                <NavLink
                  to={navItem.path}
                  className={({ isActive }) =>
                    classNames(
                      `${
                        isActive
                          ? styles["sidebar_links_list-item_active"]
                          : styles["sidebar_links_list-item_inactive"]
                      }`,
                      `${
                        isOpen
                          ? styles["sidebar_links_list-item-open"]
                          : styles["sidebar_links_list-item-close"]
                      }`
                    )
                  }
                >
                  <SidebarIcon Icon={navItem.Icon} />
                  <span>{navItem.name}</span>
                </NavLink>
              </li>
            ))}
            <li
              className={classNames(
                isOpen
                  ? styles["sidebar_links_list-item-open"]
                  : styles["sidebar_links_list-item-close"],
                styles["sidebar_links_list-item_logout"]
              )}
              style={{ marginTop: "8px" }}
              onClick={logout}
            >
              <SidebarIcon Icon={BiLogOut} />
              <span>Αποσύνδεση</span>
            </li>
          </ul>
        ) : (
          <ul
            className={
              isOpen
                ? styles["sidebar_links_list-open"]
                : styles["sidebar_links_list-close"]
            }
          >
            <li
              className={classNames(
                isOpen
                  ? styles["sidebar_links_list-item-open"]
                  : styles["sidebar_links_list-item-close"],
                styles["sidebar_links_list-item_active"]
              )}
            >
              <SidebarIcon Icon={BiLogIn} />
              <span>Σύνδεση</span>
            </li>
          </ul>
        )}
      </nav>
    </>
  );
};

export default Sidebar;
