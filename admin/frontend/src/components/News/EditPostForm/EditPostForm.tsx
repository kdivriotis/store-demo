import {
  FC,
  useState,
  useContext,
  useEffect,
  useCallback,
  FormEvent,
} from "react";
import { useParams, useNavigate, NavigateFunction } from "react-router-dom";

import { PostDetails } from "../../../interfaces/Post";
import { useHttp } from "../../../hooks";

import { AuthContext } from "../../../context";
import { AuthContextType } from "../../../interfaces/AuthContext";

import {
  validateText,
  validateImageFile,
  validatePostLink,
} from "../../../utils/input";
import {
  postLinkLength,
  postTitleLength,
  postSubtitleLength,
  postSummaryLength,
} from "../../../constants";

import { PostHeader, PostContent, PostImage, PostPreview } from "../index";

import styles from "./EditPostForm.module.css";

interface DetailsApiResponse {
  post: PostDetails;
}

interface ApiResponse {
  message: string;
}

const EditPostForm: FC = () => {
  const navigate: NavigateFunction = useNavigate();
  const params = useParams();
  const { linkTitle } = params;
  const { auth } = useContext(AuthContext) as AuthContextType;
  // useHttp custom hook
  const { isLoading, error, sendRequest } = useHttp();

  const [postLink, setPostLink] = useState<string>("");
  const [postTitle, setPostTitle] = useState<string>("");
  const [postSubtitle, setPostSubtitle] = useState<string>("");
  const [postSummary, setPostSummary] = useState<string>("");
  const [postLinkError, setPostLinkError] = useState<string>("");
  const [postTitleError, setPostTitleError] = useState<string>("");
  const [postSubtitleError, setPostSubtitleError] = useState<string>("");
  const [postSummaryError, setPostSummaryError] = useState<string>("");
  const [postCurrentImage, setPostCurrentImage] = useState<
    string | undefined | null
  >("");

  const [postContent, setPostContent] = useState<string | undefined>();

  if (!linkTitle || linkTitle.trim() === "")
    navigate("/news", { replace: true });

  // Get post's details from API and set state
  const getPostDetails = useCallback(() => {
    // transform API response
    const transformResponse = (response: DetailsApiResponse) => {
      setPostLink(linkTitle || response.post.link);
      setPostTitle(response.post.title);
      setPostSubtitle(response.post.subtitle || "");
      setPostSummary(response.post.summary);
      setPostContent(response.post.content);
      setPostCurrentImage(response.post.mainImage);
    };

    // send GET request to API's route /post/details/:link
    const url = `${process.env.REACT_APP_API_URL}/post/details/${linkTitle}`;
    sendRequest({ url, method: "GET" }, transformResponse);
  }, [
    linkTitle,
    setPostLink,
    setPostTitle,
    setPostSubtitle,
    setPostSummary,
    setPostContent,
    sendRequest,
  ]);

  useEffect(() => {
    getPostDetails();
  }, [getPostDetails]);

  const [isPreview, setIsPreview] = useState<boolean>(false);

  const linkErrorMessage = validatePostLink(postLink, postLinkLength);
  const linkIsValid = linkErrorMessage == null;
  const titleErrorMessage = validateText(postTitle, postTitleLength);
  const titleIsValid = titleErrorMessage == null;
  const subtitleErrorMessage =
    postSubtitle.trim().length === 0
      ? null
      : validateText(postSubtitle, postSubtitleLength);
  const subtitleIsValid = subtitleErrorMessage == null;
  const summaryErrorMessage = validateText(postSummary, postSummaryLength);
  const summaryIsValid = summaryErrorMessage == null;

  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const [selectedFileError, setSelectedFileError] = useState<
    string | undefined
  >();
  const [imagePreview, setImagePreview] = useState<string | undefined>();
  const imageIsValid = selectedFile && validateImageFile(selectedFile);

  const postContentIsValid = postContent
    ? postContent.trim().length > 0
    : false;

  const formIsValid =
    linkIsValid &&
    titleIsValid &&
    subtitleIsValid &&
    summaryIsValid &&
    (imageIsValid || !imageIsValid) &&
    postContentIsValid;

  const editNewsPost = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!formIsValid) return;

    // transform API response
    const transformResponse = (response: ApiResponse) => {
      setSelectedFile(undefined);
      setSelectedFileError(undefined);
      navigate("/news", { replace: true });
    };

    const formData = new FormData();
    formData.append("title", postTitle);
    formData.append("subtitle", postSubtitle);
    formData.append("summary", postSummary);
    formData.append("content", postContent ?? "");
    if (selectedFile)
      formData.append("postImage", selectedFile, selectedFile.name);

    // send PATCH request to API's route /post/edit
    const url = `${process.env.REACT_APP_API_URL}/admin/post/edit/${linkTitle}`;
    sendRequest(
      {
        url,
        method: "PATCH",
        token: auth.token,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      },
      transformResponse
    );
  };

  return (
    <form className={styles["form_container"]} onSubmit={editNewsPost}>
      {isPreview ? (
        <>
          <PostPreview
            title={postTitle}
            subtitle={postSubtitle}
            mainImage={imagePreview ?? postCurrentImage}
            content={postContent ?? ""}
          />
          <div className={styles["form_btn_container"]}>
            <button
              type="submit"
              className={styles["form_submit_btn"]}
              disabled={isLoading || !formIsValid}
            >
              Αποθήκευση Αλλαγών
            </button>
            <button
              className={styles["form_preview_btn"]}
              disabled={isLoading}
              onClick={() => setIsPreview(false)}
            >
              Επεξεργασία
            </button>
          </div>
          {error && error.trim() !== "" && (
            <p className={styles["form_error"]}>{error}</p>
          )}
        </>
      ) : (
        <>
          <PostHeader
            link={postLink}
            setLink={setPostLink}
            linkError={postLinkError}
            setLinkError={setPostLinkError}
            linkErrorMessage={linkErrorMessage}
            linkIsValid={linkIsValid}
            linkIsNotEditable={true}
            title={postTitle}
            setTitle={setPostTitle}
            titleError={postTitleError}
            setTitleError={setPostTitleError}
            titleErrorMessage={titleErrorMessage}
            titleIsValid={titleIsValid}
            subtitle={postSubtitle}
            setSubtitle={setPostSubtitle}
            subtitleError={postSubtitleError}
            setSubtitleError={setPostSubtitleError}
            subtitleErrorMessage={subtitleErrorMessage}
            subtitleIsValid={subtitleIsValid}
            summary={postSummary}
            setSummary={setPostSummary}
            summaryError={postSummaryError}
            setSummaryError={setPostSummaryError}
            summaryErrorMessage={summaryErrorMessage}
            summaryIsValid={summaryIsValid}
            isLoading={isLoading}
          />
          {postCurrentImage && (
            <div className={styles["form_field"]}>
              <p>
                Τρέχουσα εικόνα (θα παραμείνει η ίδια εάν δεν επιλεχθεί άλλη)
              </p>
              <div className={styles["form_field_image"]}>
                <img src={postCurrentImage} alt="Τρέχουσα Εικόνα" />
              </div>
            </div>
          )}
          <PostImage
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            selectedFileError={selectedFileError}
            setSelectedFileError={setSelectedFileError}
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
            isLoading={isLoading}
          />
          <PostContent
            content={postContent}
            setContent={setPostContent}
            isLoading={isLoading}
          />
          <div className={styles["form_btn_container"]}>
            <button
              className={styles["form_preview_btn"]}
              disabled={isLoading || !formIsValid}
              onClick={() => setIsPreview(true)}
            >
              Προεπισκόπηση
            </button>
          </div>
        </>
      )}
    </form>
  );
};

export default EditPostForm;
