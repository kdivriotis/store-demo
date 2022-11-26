import { FC, useState, useEffect, useContext, ChangeEvent } from "react";
import { SiHomeassistantcommunitystore } from "react-icons/si";
import { HiIdentification, HiLocationMarker } from "react-icons/hi";
import { BiLinkAlt } from "react-icons/bi";
import { AiFillEdit } from "react-icons/ai";
import { BsCheckLg, BsXLg } from "react-icons/bs";
import classNames from "classnames";

import { useProfile } from "../../../pages/Profile/Profile";
import { useHttp } from "../../../hooks";

import { AuthContext } from "../../../context";
import { AuthContextType } from "../../../interfaces/AuthContext";
import { validateUrl } from "../../../utils/input";

import styles from "./StoreInfo.module.css";

interface ApiResponse {
  message: string;
}

const StoreInfo: FC = () => {
  const {
    profile,
    isLoading: parentIsLoading,
    error: parentError,
    onRefresh,
  } = useProfile();
  const { auth } = useContext(AuthContext) as AuthContextType;
  const { isLoading, error, sendRequest } = useHttp();

  const [isEditingUrl, setIsEditingUrl] = useState<boolean>(false);
  const [urlInput, setUrlInput] = useState<string>("");
  const [urlInputError, setUrlInputError] = useState<string>("");
  const urlInputErrorMessage = validateUrl(urlInput);
  const siteUrlIsValid = urlInputErrorMessage == null;

  useEffect(() => {
    if (isEditingUrl && profile?.siteUrl) setUrlInput(profile?.siteUrl);
    else if (!isEditingUrl) {
      setUrlInput("");
      setUrlInputError("");
    }
  }, [isEditingUrl, profile?.siteUrl]);

  // Change the store's URL
  const changeUrl = () => {
    // transform API response
    const transformResponse = (response: ApiResponse) => {
      setIsEditingUrl(false);
      onRefresh();
    };

    if (!isEditingUrl || !siteUrlIsValid) {
      return;
    }

    // send POST request to API's route /partner/change-url
    const url = `${process.env.REACT_APP_API_URL}/partner/change-url`;
    sendRequest(
      {
        url,
        method: "PATCH",
        token: auth.token,
        data: {
          storeUrl: urlInput,
        },
      },
      transformResponse
    );
  };

  const siteUrlChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (urlInputError !== "") setUrlInputError("");
    setUrlInput(event.target.value);
  };

  const siteUrlBlurHandler = () => {
    if (!siteUrlIsValid && urlInputErrorMessage) {
      setUrlInputError(urlInputErrorMessage);
    } else {
      setUrlInputError("");
    }
  };

  return (
    <div className={classNames(styles["info_container"])}>
      {/* Header */}
      <h2 className={classNames(styles["info_title"])}>
        Πληροφορίες Καταστήματος
      </h2>
      {parentError && parentError.toString().trim() !== "" && (
        <p className={classNames(styles["info_error"])}>{parentError}</p>
      )}

      {/* Store Name */}
      <div className={classNames(styles["info_field"])}>
        <p className={classNames(styles["info_field_description"])}>
          Όνομα Καταστήματος
        </p>
        <div className={classNames(styles["info_field_value"])}>
          <span className={classNames(styles["info_field_value_icon"])}>
            <SiHomeassistantcommunitystore />
          </span>
          <p className={parentIsLoading ? "pulse" : ""}>
            {profile?.storeName || "-"}
          </p>
        </div>
      </div>

      {/* VAT */}
      <div className={classNames(styles["info_field"])}>
        <p className={classNames(styles["info_field_description"])}>Α.Φ.Μ.</p>
        <div className={classNames(styles["info_field_value"])}>
          <span className={classNames(styles["info_field_value_icon"])}>
            <HiIdentification />
          </span>
          <p className={parentIsLoading ? "pulse" : ""}>
            {profile?.vat || "-"}
          </p>
        </div>
      </div>

      {/* DOY */}
      <div className={classNames(styles["info_field"])}>
        <p className={classNames(styles["info_field_description"])}>Δ.Ο.Υ.</p>
        <div className={classNames(styles["info_field_value"])}>
          <span className={classNames(styles["info_field_value_icon"])}>
            <HiLocationMarker />
          </span>
          <p className={parentIsLoading ? "pulse" : ""}>
            {profile?.doy || "-"}
          </p>
        </div>
      </div>

      {/* URL */}
      <div className={classNames(styles["info_field"])}>
        <p className={classNames(styles["info_field_description"])}>
          Ιστότοπος/Σελίδα
        </p>
        {!isEditingUrl ? (
          <div className={classNames(styles["info_field_value"])}>
            <span className={classNames(styles["info_field_value_icon"])}>
              <BiLinkAlt />
            </span>
            <p className={parentIsLoading ? "pulse" : ""}>
              {profile?.siteUrl || "-"}
            </p>
            <span
              className={classNames(styles["info_field_value_icon_editable"])}
              onClick={() => setIsEditingUrl(true)}
            >
              <AiFillEdit />
            </span>
          </div>
        ) : (
          <div className={classNames(styles["info_field_value"])}>
            <span className={classNames(styles["info_field_value_icon"])}>
              <BiLinkAlt />
            </span>
            <input
              value={urlInput}
              type="text"
              placeholder="https://www.mysite.gr ή Instagram, Facebook..."
              disabled={isLoading}
              onChange={siteUrlChangeHandler}
              onBlur={siteUrlBlurHandler}
              required={true}
              aria-required={true}
            />
            <span
              className={classNames(styles["info_field_value_icon_editable"])}
              onClick={changeUrl}
            >
              <BsCheckLg />
            </span>
            <span
              className={classNames(styles["info_field_value_icon_editable"])}
              onClick={() => setIsEditingUrl(false)}
            >
              <BsXLg />
            </span>
          </div>
        )}
        {urlInputError && urlInputError.trim() !== "" && (
          <p className={classNames(styles["info_field_status"])}>
            {urlInputError}
          </p>
        )}
        {error && error.trim() !== "" && (
          <p className={classNames(styles["info_field_status"])}>{error}</p>
        )}
        {(!error || error.trim() === "") && !profile?.siteUrlVerified && (
          <p className={classNames(styles["info_field_status"])}>
            Αναμονή για έγκριση
          </p>
        )}
      </div>
    </div>
  );
};

export default StoreInfo;
