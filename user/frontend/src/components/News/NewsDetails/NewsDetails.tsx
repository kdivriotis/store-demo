import { FC, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import classNames from "classnames";

import { DetailsHeader, DetailsText } from "../index";
import { ImageSlider, LoadingSpinner } from "../..";

import { PostDetails } from "../../../interfaces/Post";
import { useHttp } from "../../../hooks";

import styles from "./NewsDetails.module.css";

interface ApiResponse {
  post: PostDetails;
}

const NewsDetails: FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { linkTitle } = params;

  const { isLoading, error, sendRequest } = useHttp();
  const [details, setDetails] = useState<PostDetails | null>(null);

  if (!linkTitle || linkTitle.trim() === "")
    navigate("/news", { replace: true });

  // Get post's details from API and set state
  const getPostDetails = () => {
    // transform API response
    const transformResponse = (response: ApiResponse) => {
      setDetails(response.post);
    };

    // send GET request to API's route /post/details/:link
    const url = `${process.env.REACT_APP_API_URL}/post/details/${linkTitle}`;
    sendRequest({ url, method: "GET" }, transformResponse);
  };

  useEffect(() => {
    getPostDetails();
  }, [linkTitle]);

  if (isLoading) {
    return (
      <div className={styles["spinner"]}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error && error.trim() !== "") {
    return (
      <div className="section-padding" style={{ textAlign: "center" }}>
        <p className="text-error">{error}</p>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="section-padding" style={{ textAlign: "center" }}>
        <p className="text-error">Δεν υπάρχουν πληροφορίες.</p>
      </div>
    );
  }

  return (
    <article>
      <DetailsHeader title={details.title} subtitle={details.subtitle} />
      {details.mainImage && (
        <div
          className={classNames(styles["article-image"])}
          aria-label={`Εικόνες για το άρθρο ${details.title}`}
        >
          <ImageSlider
            images={[{ url: details.mainImage, title: details.title }]}
          />
        </div>
      )}
      <DetailsText content={details.content} />
    </article>
  );
};

export default NewsDetails;
