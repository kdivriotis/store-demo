import { FC } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";

import styles from "./Products.module.css";

enum ActiveLink {
  AllProducts = 0,
  DeletedProducts = 1,
  CreateProduct = 2,
  EditProduct = 3,
}

const Products: FC = () => {
  let selected: ActiveLink | null;
  const location = useLocation();
  switch (location.pathname) {
    case "/menu/create":
      selected = ActiveLink.CreateProduct;
      break;
    case "/menu/deleted":
      selected = ActiveLink.DeletedProducts;
      break;
    case "/menu":
      selected = ActiveLink.AllProducts;
      break;
    default:
      selected = ActiveLink.EditProduct;
      break;
  }

  return (
    <>
      <nav className={styles["products-navigation"]}>
        <Link
          to=""
          className={
            selected === ActiveLink.AllProducts
              ? styles["products-navigation-link_active"]
              : styles["products-navigation-link_inactive"]
          }
        >
          Όλα
        </Link>
        <Link
          to="deleted"
          className={
            selected === ActiveLink.DeletedProducts
              ? styles["products-navigation-link_active"]
              : styles["products-navigation-link_inactive"]
          }
        >
          Διαγραμμένα
        </Link>
        <Link
          to="create"
          className={
            selected === ActiveLink.CreateProduct
              ? styles["products-navigation-link_active"]
              : styles["products-navigation-link_inactive"]
          }
        >
          Δημιουργία
        </Link>
      </nav>
      <Outlet />
    </>
  );
};

export default Products;
