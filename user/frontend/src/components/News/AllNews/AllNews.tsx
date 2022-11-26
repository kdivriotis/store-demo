import { FC, useState, useEffect } from "react";
import classNames from "classnames";

import { Pagination, LoadingSpinner } from "../..";
import { NewsGrid } from "../index";

import { PostBrief } from "../../../interfaces/Post";
import { useHttp } from "../../../hooks";

import styles from "./AllNews.module.css";

interface ApiResponse {
  numberOfPosts: number;
  posts: PostBrief[];
}

const postsPerPage = 9;

const AllNews: FC = () => {
  const { isLoading, error, sendRequest } = useHttp();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [numberOfPosts, setNumberOfPosts] = useState<number>(0);
  const [posts, setPosts] = useState<PostBrief[]>([]);

  // Get all posts from API and set state
  const getPosts = () => {
    // transform API response
    const transformResponse = (response: ApiResponse) => {
      const { numberOfPosts: responseNumberOfPosts, posts: responsePosts } =
        response;
      setNumberOfPosts(responseNumberOfPosts);
      setPosts(responsePosts);
    };

    // send GET request to API's route /post/:offset/:limit
    const url = `${process.env.REACT_APP_API_URL}/post/${
      (currentPage - 1) * postsPerPage
    }/${postsPerPage}`;
    sendRequest({ url, method: "GET" }, transformResponse);
  };

  useEffect(() => {
    getPosts();
  }, [postsPerPage, currentPage]);

  let content = (
    <div className={styles["spinner"]}>
      <LoadingSpinner />
    </div>
  );

  if (!isLoading && error && error.trim() !== "") {
    content = (
      <div className="section-padding">
        <p className="text-error">{error}</p>
      </div>
    );
  } else if (!isLoading && (!posts || posts.length === 0)) {
    content = (
      <div className="section-padding">
        <p className="text-error">Δεν υπάρχουν ακόμη νέα.</p>
      </div>
    );
  } else if (!isLoading) {
    content = <NewsGrid posts={posts} />;
  }

  return (
    <>
      <div className={styles["news_pagination"]}>
        <Pagination
          itemsPerPage={postsPerPage}
          totalItems={numberOfPosts}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
      {content}
      <div className={styles["news_pagination"]}>
        <Pagination
          itemsPerPage={postsPerPage}
          totalItems={numberOfPosts}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </>
  );
};

export default AllNews;
