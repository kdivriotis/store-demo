import { FC, useState, useContext, FormEvent } from "react";
import { useNavigate, NavigateFunction } from "react-router-dom";

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

import styles from "./CreatePostForm.module.css";

interface ApiResponse {
  message: string;
}

const initialPost = `
# Τίτλος
---
**Εισάγετε το κείμενό σας εδώ**
`;

const CreatePostForm: FC = () => {
  const navigate: NavigateFunction = useNavigate();
  const { auth } = useContext(AuthContext) as AuthContextType;
  // useHttp custom hook
  const { isLoading, error, sendRequest } = useHttp();

  const [isPreview, setIsPreview] = useState<boolean>(false);

  const [postLink, setPostLink] = useState<string>("");
  const [postTitle, setPostTitle] = useState<string>("");
  const [postSubtitle, setPostSubtitle] = useState<string>("");
  const [postSummary, setPostSummary] = useState<string>("");
  const [postLinkError, setPostLinkError] = useState<string>("");
  const [postTitleError, setPostTitleError] = useState<string>("");
  const [postSubtitleError, setPostSubtitleError] = useState<string>("");
  const [postSummaryError, setPostSummaryError] = useState<string>("");

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

  const [postContent, setPostContent] = useState<string | undefined>(
    initialPost
  );
  const postContentIsValid = postContent
    ? postContent.trim().length > 0
    : false;

  const formIsValid =
    linkIsValid &&
    titleIsValid &&
    subtitleIsValid &&
    summaryIsValid &&
    imageIsValid &&
    postContentIsValid;

  const createNewsPost = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!formIsValid) return;

    // transform API response
    const transformResponse = (response: ApiResponse) => {
      setSelectedFile(undefined);
      setSelectedFileError(undefined);
      navigate("/news", { replace: true });
    };

    const formData = new FormData();
    formData.append("link", postLink);
    formData.append("title", postTitle);
    formData.append("subtitle", postSubtitle);
    formData.append("summary", postSummary);
    formData.append("content", postContent ?? "");
    formData.append("postImage", selectedFile, selectedFile.name);

    // send POST request to API's route /post/create
    const url = `${process.env.REACT_APP_API_URL}/admin/post/create`;
    sendRequest(
      {
        url,
        method: "POST",
        token: auth.token,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      },
      transformResponse
    );
  };

  return (
    <form className={styles["form_container"]} onSubmit={createNewsPost}>
      {isPreview ? (
        <>
          <PostPreview
            title={postTitle}
            subtitle={postSubtitle}
            mainImage={imagePreview}
            content={postContent ?? ""}
          />
          <div className={styles["form_btn_container"]}>
            <button
              type="submit"
              className={styles["form_submit_btn"]}
              disabled={isLoading || !formIsValid}
            >
              Δημιουργία
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

export default CreatePostForm;
