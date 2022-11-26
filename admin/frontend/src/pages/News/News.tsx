import { FC } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";

import styles from "./News.module.css";

enum ActiveLink {
  AllNews = 0,
  CreatePost = 1,
  EditPost = 2,
}

const News: FC = () => {
  let selected: ActiveLink | null;
  const location = useLocation();
  switch (location.pathname) {
    case "/news/create":
      selected = ActiveLink.CreatePost;
      break;
    case "/news":
      selected = ActiveLink.AllNews;
      break;
    default:
      selected = ActiveLink.EditPost;
      break;
  }

  return (
    <>
      <nav className={styles["news-navigation"]}>
        <Link
          to=""
          className={
            selected === ActiveLink.AllNews
              ? styles["news-navigation-link_active"]
              : styles["news-navigation-link_inactive"]
          }
        >
          Προβολή
        </Link>
        <Link
          to="create"
          className={
            selected === ActiveLink.CreatePost
              ? styles["news-navigation-link_active"]
              : styles["news-navigation-link_inactive"]
          }
        >
          Δημιουργία
        </Link>
      </nav>
      <Outlet />
    </>
  );
};

export default News;
