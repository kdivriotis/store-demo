import { FC } from "react";
import classNames from "classnames";

import { NewsCard } from "../index";
import { PostBrief } from "../../../interfaces/Post";

import styles from "./NewsGrid.module.css";

interface NewsGridProps {
  posts: PostBrief[];
}

const NewsGrid: FC<NewsGridProps> = ({ posts }) => {
  return (
    <div className={classNames(styles["news_container_grid"])}>
      {posts.map((post, idx) => (
        <NewsCard key={`post-${idx}`} post={post} />
      ))}
    </div>
  );
};

export default NewsGrid;
