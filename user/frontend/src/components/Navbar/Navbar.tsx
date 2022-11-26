import { FC, useState, useEffect, useContext } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaShoppingCart } from "react-icons/fa";
import { MdOutlineClose } from "react-icons/md";
import { NavLink } from "react-router-dom";
import classNames from "classnames";

import { useWindowDimensions } from "../../hooks";

import { AuthContext, CartContext } from "../../context";
import { AuthContextType } from "../../interfaces/AuthContext";
import { CartContextType } from "../../interfaces/CartContext";

import styles from "./Navbar.module.css";

interface NavbarProps {
  showImage?: boolean;
}

const Navbar: FC<NavbarProps> = ({ showImage }) => {
  // get current dimensions of the window
  const dimensions = useWindowDimensions();
  const width: number = dimensions?.width ?? 800;

  const { auth } = useContext(AuthContext) as AuthContextType;
  const { totalItems } = useContext(CartContext) as CartContextType;

  const [toggleMenu, setToggleMenu] = useState<boolean>(false);
  const [isBounceCart, setIsBounceCart] = useState<boolean>(false);

  // hide the navigation menu overlay on big screens
  useEffect(() => {
    if (width >= 1150 && toggleMenu) setToggleMenu(false);
  }, [width, toggleMenu]);

  useEffect(() => {
    if (totalItems > 0) {
      setIsBounceCart(true);
      setTimeout(() => setIsBounceCart(false), 1000);
    } else setIsBounceCart(false);
  }, [totalItems]);

  return (
    <>
      {showImage && (
        <div className={classNames(styles["header-container"])}>
          <img
            className={classNames(styles["header-container_overlay"])}
            src="/images/top.jpg"
            alt="Header background image"
            aria-hidden="true"
          />
          <img
            className={classNames(styles["header-container_logo"])}
            src="/images/logo.png"
            alt="Plakopites logo"
            aria-hidden="true"
          />
        </div>
      )}
      <nav className={classNames(styles.navbar)}>
        {/* Large screen */}
        <ul
          className={classNames(
            styles["navbar-links"],
            styles["navbar-links_left"]
          )}
        >
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? styles["navbar-links_active"] : ""
              }
            >
              ΣΧΕΤΙΚΑ ΜΕ ΕΜΑΣ
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/menu"
              className={({ isActive }) =>
                isActive ? styles["navbar-links_active"] : ""
              }
            >
              ΠΡΟΙΟΝΤΑ
            </NavLink>
          </li>
          {/* {auth.isLoggedIn && auth.isVerified && (
            <li>
              <NavLink
                to="/diy"
                className={({ isActive }) =>
                  isActive ? styles["navbar-links_active"] : ""
                }
              >
                DIY
              </NavLink>
            </li>
          )} */}
        </ul>
        <div
          className={classNames(
            styles["navbar-logo"],
            styles["navbar-logo_bigscreen"]
          )}
        >
          <NavLink to="/">
            <img
              src="/images/logo.png"
              alt="Αρχική σελίδα"
              aria-label="Αρχική σελίδα"
            />
          </NavLink>
        </div>
        <ul
          className={classNames(
            styles["navbar-links"],
            styles["navbar-links_right"]
          )}
        >
          <li>
            <NavLink
              to="/news"
              className={({ isActive }) =>
                isActive ? styles["navbar-links_active"] : ""
              }
            >
              ΝΕΑ
            </NavLink>
          </li>
          {auth.isLoggedIn && auth.isVerified && (
            <li>
              <NavLink
                to="/order"
                className={({ isActive }) =>
                  isActive ? styles["navbar-links_active"] : ""
                }
              >
                ΠΑΡΑΓΓΕΛΙΑ
              </NavLink>
            </li>
          )}
          {auth.isLoggedIn && (
            <li>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive ? styles["navbar-links_active"] : ""
                }
              >
                ΠΡΟΦΙΛ
              </NavLink>
            </li>
          )}
          {!auth.isLoggedIn && (
            <li>
              <NavLink
                to="/login"
                className={classNames(styles["navbar-links_login_btn"])}
              >
                ΣΥΝΔΕΣΗ
              </NavLink>
            </li>
          )}
          {auth.isLoggedIn && auth.isVerified && (
            <li>
              <NavLink
                to="/cart"
                className={({ isActive }) =>
                  classNames(
                    isActive ? styles["navbar-links_active"] : "",
                    styles["cart-link"]
                  )
                }
              >
                ΚΑΛΑΘΙ
                {totalItems > 0 && (
                  <span className={isBounceCart ? "bounce" : ""}>
                    {totalItems < 100 ? totalItems : "99+"}
                  </span>
                )}
              </NavLink>
            </li>
          )}
        </ul>
        {/* Small screen */}
        <div className={classNames(styles["navbar-smallscreen"])}>
          <div className={classNames(styles["navbar-logo"])}>
            <NavLink to="/">
              <img src="/images/logo.png" alt="Plakopites logo" />
            </NavLink>
          </div>
          <div className={classNames(styles["navbar-smallscreen_icons"])}>
            {auth.isLoggedIn && auth.isVerified && (
              <NavLink
                to="/cart"
                className={classNames(styles["navbar-smallscreen_icon"])}
              >
                <FaShoppingCart />
                {totalItems > 0 && (
                  <span className={isBounceCart ? "bounce" : ""}>
                    {totalItems < 100 ? totalItems : "99+"}
                  </span>
                )}
              </NavLink>
            )}
            <div className={classNames(styles["navbar-smallscreen_icon"])}>
              <GiHamburgerMenu onClick={() => setToggleMenu(true)} />
            </div>
          </div>
          {toggleMenu && (
            <div
              className={classNames(
                styles["navbar-smallscreen_overlay"],
                "flex-center",
                "slide-top"
              )}
            >
              <MdOutlineClose
                className={classNames(
                  styles["navbar-smallscreen_overlay_close"]
                )}
                onClick={() => setToggleMenu(false)}
              />
              <ul className={classNames(styles["navbar-smallscreen_links"])}>
                <li>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      isActive ? styles["navbar-links_active"] : ""
                    }
                  >
                    ΑΡΧΙΚΗ
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/about"
                    className={({ isActive }) =>
                      isActive ? styles["navbar-links_active"] : ""
                    }
                  >
                    ΣΧΕΤΙΚΑ ΜΕ ΕΜΑΣ
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/menu"
                    className={({ isActive }) =>
                      isActive ? styles["navbar-links_active"] : ""
                    }
                  >
                    ΠΡΟΙΟΝΤΑ
                  </NavLink>
                </li>
                {/* {auth.isLoggedIn && auth.isVerified && (
                  <li>
                    <NavLink
                      to="/diy"
                      className={({ isActive }) =>
                        isActive ? styles["navbar-links_active"] : ""
                      }
                    >
                      DIY
                    </NavLink>
                  </li>
                )} */}
                <li>
                  <NavLink
                    to="/news"
                    className={({ isActive }) =>
                      isActive ? styles["navbar-links_active"] : ""
                    }
                  >
                    ΝΕΑ
                  </NavLink>
                </li>
                {auth.isLoggedIn && auth.isVerified && (
                  <li>
                    <NavLink
                      to="/order"
                      className={({ isActive }) =>
                        isActive ? styles["navbar-links_active"] : ""
                      }
                    >
                      ΠΑΡΑΓΓΕΛΙΑ
                    </NavLink>
                  </li>
                )}
                {auth.isLoggedIn && (
                  <li>
                    <NavLink
                      to="/profile"
                      className={({ isActive }) =>
                        isActive ? styles["navbar-links_active"] : ""
                      }
                    >
                      ΠΡΟΦΙΛ
                    </NavLink>
                  </li>
                )}
                {auth.isLoggedIn && auth.isVerified && (
                  <li>
                    <NavLink
                      to="/cart"
                      className={({ isActive }) =>
                        isActive ? styles["navbar-links_active"] : ""
                      }
                    >
                      ΚΑΛΑΘΙ
                    </NavLink>
                  </li>
                )}
                {!auth.isLoggedIn && (
                  <li>
                    <NavLink
                      to="/login"
                      className={classNames(styles["navbar-links_login_btn"])}
                    >
                      ΣΥΝΔΕΣΗ
                    </NavLink>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
