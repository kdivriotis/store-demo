import {
  FC,
  useContext,
  useState,
  useEffect,
  ChangeEvent,
  useRef,
} from "react";
import classNames from "classnames";

import { AuthContext } from "../../../context";
import { AuthContextType } from "../../../interfaces/AuthContext";

import { useHttp } from "../../../hooks";
import { useProfile } from "../../../pages/Profile/Profile";

import { ModalDialog, ModalDialogActionStyle } from "../../";

import styles from "./ChangePicture.module.css";

interface ApiResponse {
  message: string;
}

const ChangePicture: FC = () => {
  const {
    profile,
    isLoading: parentIsLoading,
    error: parentError,
    onRefresh,
  } = useProfile();

  const { auth } = useContext(AuthContext) as AuthContextType;
  const { isLoading, error, sendRequest } = useHttp();
  const {
    isLoading: deleteImageIsLoading,
    error: deleteImageError,
    sendRequest: deleteImageSendRequest,
  } = useHttp();
  const {
    isLoading: cancelRequestIsLoading,
    error: cancelRequestError,
    sendRequest: cancelRequestSendRequest,
  } = useHttp();

  const [showDeleteImageDialog, setShowDeleteImageDialog] =
    useState<boolean>(false);
  const [showCancelRequestDialog, setShowCancelRequestDialog] =
    useState<boolean>(false);

  /**
   * Check if given file is an image (jpg, jpeg, png)
   * @param {File| undefined} imageFile The file to be tested
   * @returns True or false, depending on whether given file is an image
   */
  const isImageFile = (imageFile: File | undefined): boolean => {
    if (!imageFile) return false;
    const imageNamePattern = /^.+\.(png|jpeg|jpg)$/;
    const imageTypePattern = /^image\/(png|jpeg|jpg)$/;
    return (
      imageNamePattern.test(imageFile.name.toLocaleLowerCase()) &&
      imageTypePattern.test(imageFile.type)
    );
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const [selectedFileError, setSelectedFileError] = useState<
    string | undefined
  >();
  const [preview, setPreview] = useState<string | undefined>();
  const uploadImageDisabled = !selectedFile || !isImageFile(selectedFile);

  // Upload the image
  const uploadImage = () => {
    // transform API response
    const transformResponse = (response: ApiResponse) => {
      setSelectedFile(undefined);
      setSelectedFileError(undefined);
      onRefresh();
    };

    if (uploadImageDisabled) {
      setSelectedFileError("Επιλέξτε μία εικόνα για να συνεχίσετε");
      return;
    }
    const formData = new FormData();
    formData.append("storeImage", selectedFile, selectedFile.name);

    // send POST request to API's route /partner/upload-image
    const url = `${process.env.REACT_APP_API_URL}/partner/upload-image`;
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

  // Delete current image
  const deleteImage = () => {
    // transform API response
    const transformResponse = (response: ApiResponse) => {
      onRefresh();
    };

    if (!profile?.imageUrl) {
      return;
    }
    // send DELETE request to API's route /partner/delete-image
    const url = `${process.env.REACT_APP_API_URL}/partner/delete-image`;
    deleteImageSendRequest(
      { url, method: "DELETE", token: auth.token },
      transformResponse
    );
  };

  // Cancel image request
  const cancelImageRequest = () => {
    // transform API response
    const transformResponse = (response: ApiResponse) => {
      onRefresh();
    };

    if (!profile?.pendingImageUrl) {
      return;
    }
    // send DELETE request to API's route /partner/cancel-request
    const url = `${process.env.REACT_APP_API_URL}/partner/cancel-request`;
    cancelRequestSendRequest(
      { url, method: "DELETE", token: auth.token },
      transformResponse
    );
  };

  const onShowDeleteImageDialog = () => {
    setShowDeleteImageDialog(true);
    setShowCancelRequestDialog(false);
  };

  const onShowCancelRequestDialog = () => {
    setShowDeleteImageDialog(false);
    setShowCancelRequestDialog(true);
  };

  const onCancelAction = () => {
    setShowDeleteImageDialog(false);
    setShowCancelRequestDialog(false);
  };

  const onConfirmAction = () => {
    if (showDeleteImageDialog) deleteImage();
    else if (showCancelRequestDialog) cancelImageRequest();

    onCancelAction();
  };

  // Use reference to file input to open the dialog from button click
  const openFileSelection = () => {
    fileInputRef.current?.click();
  };

  // Set the image preview whenever the selected file changes
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  /**
   * On file input change, check if the selected file was changed and if it's valid (type & size) update the selectedFile state
   * @param event Input file selection was changed event
   */
  const onSelectFile = (event: ChangeEvent): void => {
    const target = event.target as HTMLInputElement;
    // if no file was selected, return
    if (!target.files || target.files.length === 0) {
      return;
    }

    const newSelectedFile = target.files[0];
    // if selected file was not an image, return
    if (!isImageFile(newSelectedFile)) {
      setSelectedFile(undefined);
      setSelectedFileError("Μη αποδεκτός τύπος αρχείου");
      return;
    }

    // 2 MB ~= 2097152 bytes (2*2^20)
    if (newSelectedFile.size > 2097152) {
      setSelectedFileError("Το μέγεθος του αρχείου ξεπερνάει το μέγιστο");
      return;
    }
    setSelectedFileError(undefined);
    setSelectedFile(target.files[0]);
  };

  return (
    <div className={classNames(styles["info_container"])}>
      {/* Header */}
      <h2 className={classNames(styles["info_title"])}>Εικόνα Καταστήματος</h2>
      {parentError && parentError.trim() !== "" && (
        <p className={classNames(styles["info_error"])}>{parentError}</p>
      )}

      <p className={classNames(styles["info_text"])}>
        {profile?.imageUrl
          ? "Η τρέχουσα εικόνα του καταστήματος φαίνεται στην αριστερή μεριά της οθόνης."
          : profile?.pendingImageUrl
          ? "Η τρέχουσα εικόνα του καταστήματος θα αλλάξει μόλις εγκριθεί η υποβολή σας. Αν η έγκριση καθυστερεί, επικοινωνήστε μαζί μας."
          : "Δεν έχει επιλεχθεί εικόνα για το κατάστημά σας."}
      </p>
      {profile?.imageUrl && (
        <>
          <button
            className={classNames(
              styles["info_action_button"],
              styles["info_danger_button"]
            )}
            onClick={onShowDeleteImageDialog}
            disabled={deleteImageIsLoading}
          >
            Διαγραφή Φωτογραφίας
          </button>
          {deleteImageError && deleteImageError.trim() !== "" && (
            <p className={classNames(styles["info_error"])}>
              {deleteImageError}
            </p>
          )}
        </>
      )}

      {/* Show pending image request */}
      {profile?.pendingImageUrl && (
        <div className={classNames(styles["info_field"])}>
          <div className={classNames(styles["info_field_description"])}>
            <h3 className={classNames(styles["info_subtitle"])}>
              Αναμένεται έγκριση για την αλλαγή της εικόνας του καταστήματος:
            </h3>
            <button
              className={classNames(
                styles["info_action_button"],
                styles["info_danger_button"]
              )}
              onClick={onShowCancelRequestDialog}
              disabled={cancelRequestIsLoading}
            >
              Ακύρωση Αιτήματος
            </button>
            {cancelRequestError && cancelRequestError.trim() !== "" && (
              <p className={classNames(styles["info_error"])}>
                {cancelRequestError}
              </p>
            )}
          </div>
          <div className={classNames(styles["info_field_image"])}>
            <img src={profile.pendingImageUrl} alt="Εικόνα προς έγκριση" />
          </div>
        </div>
      )}

      <div className={classNames(styles["info_field"])}>
        <div className={classNames(styles["info_field_description"])}>
          <h3 className={classNames(styles["info_subtitle"])}>
            Επιλογή Νέας Εικόνας
          </h3>
          <p className={classNames(styles["info_text"])}>
            Προτιμήστε τετράγωνες εικόνες μεγέθους τουλάχιστον 250x250 pixel.
          </p>
          <small className={classNames(styles["info_field_status"])}>
            Αποδεκτοί τύποι αρχείων: .jpg, .jpeg, .png
          </small>
          <small className={classNames(styles["info_field_status"])}>
            Μέγιστο επιτρεπόμενο μέγεθος: 2 MB
          </small>
          <input
            ref={fileInputRef}
            id="image-input"
            className={classNames(styles["info_hidden"])}
            type="file"
            multiple={false}
            onChange={onSelectFile}
            accept=".jpg, .jpeg, .png"
          />
          {selectedFileError && (
            <p className={classNames(styles["info_error"])}>
              {selectedFileError}
            </p>
          )}
          <button
            className={classNames(
              styles["info_action_button"],
              styles["info_primary_button"]
            )}
            disabled={uploadImageDisabled || isLoading || parentIsLoading}
            onClick={uploadImage}
          >
            Αποθήκευση
          </button>
          {error && error.trim() !== "" && (
            <p className={classNames(styles["info_error"])}>{error}</p>
          )}
        </div>
        <div
          className={classNames(styles["info_field_image"])}
          onClick={openFileSelection}
        >
          {selectedFile ? (
            <img
              src={preview}
              alt="Επιλεγμένη εικόνα"
              aria-label="Πατήστε για επιλογή εικόνας"
            />
          ) : (
            <p>Επιλέξτε εικόνα</p>
          )}
        </div>
      </div>
      {(showDeleteImageDialog || showCancelRequestDialog) && (
        <ModalDialog
          title={
            showDeleteImageDialog ? "Διαγραφή Εικόνας" : "Ακύρωση Αιτήματος"
          }
          content={`Είστε σίγουροι ότι θέλετε να ${
            showDeleteImageDialog
              ? "διαγράψετε την τρέχουσα εικόνα"
              : "ακυρώσετε το αίτημα αλλαγής εικόνας"
          } του καταστήματος σας;`}
          actions={[
            {
              text: "Διαγραφή",
              style: ModalDialogActionStyle.Error,
              onClick: onConfirmAction,
            },
            {
              text: "Ακύρωση",
              style: ModalDialogActionStyle.Secondary,
              onClick: onCancelAction,
            },
          ]}
          onClose={onCancelAction}
        />
      )}
    </div>
  );
};

export default ChangePicture;
