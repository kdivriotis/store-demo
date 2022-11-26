import { FC } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";

import { PostBrief } from "../../../interfaces/Post";

import styles from "./NewsCard.module.css";

interface NewsCardProps {
  post: PostBrief;
}

const NewsCard: FC<NewsCardProps> = ({ post }) => {
  const { title, mainImage, link, summary } = post;

  return (
    <Link to={link} className={classNames(styles["news-card"])}>
      {mainImage ? (
        <div className={classNames(styles["news-card_image"])}>
          <img src={mainImage} alt={`${title}`} />
        </div>
      ) : (
        <div className={classNames(styles["news-card_image"])}>
          <p>{title}</p>
        </div>
      )}
      <div className={classNames(styles["news-card_content"])}>
        <h4>{title}</h4>
        <p>{summary}</p>
      </div>
      <div className={classNames(styles["news-card_link"])}>
        <p>Διαβάστε περισσότερα &gt;&gt;</p>
      </div>
    </Link>
  );
};

export default NewsCard;
