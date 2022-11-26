import { FC, useContext } from "react";
import classNames from "classnames";

import { NewsCard } from "../index";
import { PostBrief } from "../../../interfaces/Post";
import { useHttp } from "../../../hooks";

import { AuthContext } from "../../../context";
import { AuthContextType } from "../../../interfaces/AuthContext";

import styles from "./NewsGrid.module.css";

interface NewsGridProps {
  posts: PostBrief[];
  onRefresh: () => void;
}

const NewsGrid: FC<NewsGridProps> = ({ posts, onRefresh }) => {
  const { auth } = useContext(AuthContext) as AuthContextType;
  const { isLoading, error, sendRequest } = useHttp();

  // Delete a post from API and refresh the posts data
  const deletePost = (link: string) => {
    if (!link || link.trim() === "") return;

    // transform API response
    const transformResponse = () => {
      onRefresh();
    };

    // send POST request to API's route /post/delete
    const url = `${process.env.REACT_APP_API_URL}/admin/post/delete`;
    sendRequest(
      { url, method: "POST", token: auth.token, data: { link } },
      transformResponse
    );
  };

  return (
    <>
      {error && error.trim() !== "" && <h2 className="text-error">{error}</h2>}
      <div className={classNames(styles["news_container_grid"])}>
        {posts.map((post, idx) => (
          <NewsCard
            key={`post-${idx}`}
            post={post}
            isLoading={isLoading}
            onDelete={deletePost}
          />
        ))}
      </div>
    </>
  );
};

export default NewsGrid;
