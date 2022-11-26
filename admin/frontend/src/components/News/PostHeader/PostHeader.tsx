import { FC, ChangeEvent } from "react";

import { postSummaryLength } from "../../../constants";

import styles from "./PostHeader.module.css";

interface PostContentProps {
  link: string;
  setLink: React.Dispatch<React.SetStateAction<string>>;
  linkError: string;
  setLinkError: React.Dispatch<React.SetStateAction<string>>;
  linkErrorMessage: string | null;
  linkIsValid: boolean;
  linkIsNotEditable?: boolean;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  titleError: string;
  setTitleError: React.Dispatch<React.SetStateAction<string>>;
  titleErrorMessage: string | null;
  titleIsValid: boolean;
  subtitle: string;
  setSubtitle: React.Dispatch<React.SetStateAction<string>>;
  subtitleError: string;
  setSubtitleError: React.Dispatch<React.SetStateAction<string>>;
  subtitleErrorMessage: string | null;
  subtitleIsValid: boolean;
  summary: string;
  setSummary: React.Dispatch<React.SetStateAction<string>>;
  summaryError: string;
  setSummaryError: React.Dispatch<React.SetStateAction<string>>;
  summaryErrorMessage: string | null;
  summaryIsValid: boolean;
  isLoading: boolean;
}

const PostHeader: FC<PostContentProps> = ({
  link,
  setLink,
  linkError,
  setLinkError,
  linkErrorMessage,
  linkIsValid,
  linkIsNotEditable = false,
  title,
  setTitle,
  titleError,
  setTitleError,
  titleErrorMessage,
  titleIsValid,
  subtitle,
  setSubtitle,
  subtitleError,
  setSubtitleError,
  subtitleErrorMessage,
  subtitleIsValid,
  summary,
  setSummary,
  summaryError,
  setSummaryError,
  summaryErrorMessage,
  summaryIsValid,
  isLoading,
}) => {
  const linkChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (linkError !== "") setLinkError("");
    setLink(event.target.value);
  };

  const linkBlurHandler = () => {
    if (!linkIsValid && linkErrorMessage) {
      setLinkError(linkErrorMessage);
    } else {
      setLinkError("");
    }
  };

  const titleChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (titleError !== "") setTitleError("");
    setTitle(event.target.value);
  };

  const titleBlurHandler = () => {
    if (!titleIsValid && titleErrorMessage) {
      setTitleError(titleErrorMessage);
    } else {
      setTitleError("");
    }
  };

  const subtitleChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (subtitleError !== "") setSubtitleError("");
    setSubtitle(event.target.value);
  };

  const subtitleBlurHandler = () => {
    if (!subtitleIsValid && subtitleErrorMessage) {
      setSubtitleError(subtitleErrorMessage);
    } else {
      setSubtitleError("");
    }
  };

  const summaryChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (summaryError !== "") setSummaryError("");
    setSummary(event.target.value);
  };

  const summaryBlurHandler = () => {
    if (!summaryIsValid && summaryErrorMessage) {
      setSummaryError(summaryErrorMessage);
    } else {
      setSummaryError("");
    }
  };

  return (
    <>
      {/* Title input */}
      <div className={styles["form_field"]}>
        <label htmlFor="title-input">Τίτλος</label>
        <div
          className={
            isLoading
              ? styles["form_field_input-disabled"]
              : styles["form_field_input"]
          }
        >
          <input
            id="title-input"
            type="text"
            placeholder="Τίτλος νέου"
            disabled={isLoading}
            value={title}
            onChange={titleChangeHandler}
            onBlur={titleBlurHandler}
            required
            aria-required
          />
        </div>
        {titleError && titleError.trim() !== "" && (
          <p className={styles["form_field_error"]}>{titleError}</p>
        )}
      </div>

      {/* Subtitle input */}
      <div className={styles["form_field"]}>
        <label htmlFor="subtitle-input">Υπότιτλος (προεραιτικός)</label>
        <div
          className={
            isLoading
              ? styles["form_field_input-disabled"]
              : styles["form_field_input"]
          }
        >
          <input
            id="subtitle-input"
            type="text"
            placeholder="Υπότιτλος νέου"
            disabled={isLoading}
            value={subtitle}
            onChange={subtitleChangeHandler}
            onBlur={subtitleBlurHandler}
            required={false}
            aria-required={false}
          />
        </div>
        {subtitleError && subtitleError.trim() !== "" && (
          <p className={styles["form_field_error"]}>{subtitleError}</p>
        )}
      </div>

      {/* Link input */}
      <div className={styles["form_field"]}>
        <label htmlFor="link-input">Σύνδεσμος</label>
        <div
          className={
            isLoading || linkIsNotEditable
              ? styles["form_field_input-disabled"]
              : styles["form_field_input"]
          }
        >
          <input
            id="link-input"
            type="text"
            placeholder="π.χ. news_title_example"
            disabled={isLoading || linkIsNotEditable}
            value={link}
            onChange={linkChangeHandler}
            onBlur={linkBlurHandler}
            required
            aria-required
          />
        </div>
        {linkError && linkError.trim() !== "" && (
          <p className={styles["form_field_error"]}>{linkError}</p>
        )}
      </div>

      {/* Summary input */}
      <div className={styles["form_field"]}>
        <label htmlFor="summary-input">Σύντομη Περιγραφή</label>
        <div
          className={
            isLoading
              ? styles["form_field_input-disabled"]
              : styles["form_field_input"]
          }
        >
          <textarea
            id="summary-input"
            rows={5}
            maxLength={postSummaryLength}
            placeholder={`Συνοπτική περιγραφή του νέου (μέχρι ${postSummaryLength} χαρακτήρες)`}
            disabled={isLoading}
            value={summary}
            onChange={summaryChangeHandler}
            onBlur={summaryBlurHandler}
            required
            aria-required
          />
        </div>
        {summaryError && summaryError.trim() !== "" && (
          <p className={styles["form_field_error"]}>{summaryError}</p>
        )}
      </div>
    </>
  );
};

export default PostHeader;
