import { FC, useEffect, useRef, ChangeEvent } from "react";

import { validateImageFile } from "../../../utils/input";

import styles from "./PostImage.module.css";

interface PostImageProps {
  selectedFile: File | undefined;
  setSelectedFile: React.Dispatch<React.SetStateAction<File | undefined>>;
  selectedFileError: string | undefined;
  setSelectedFileError: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  imagePreview: string | undefined;
  setImagePreview: React.Dispatch<React.SetStateAction<string | undefined>>;
  isLoading: boolean;
}

const PostImage: FC<PostImageProps> = ({
  selectedFile,
  setSelectedFile,
  selectedFileError,
  setSelectedFileError,
  imagePreview,
  setImagePreview,
  isLoading,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use reference to file input to open the dialog from button click
  const openFileSelection = () => {
    fileInputRef.current?.click();
  };

  // Set the image preview whenever the selected file changes
  useEffect(() => {
    if (!selectedFile) {
      setImagePreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setImagePreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile, setImagePreview]);

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
    if (!validateImageFile(newSelectedFile)) {
      setSelectedFile(undefined);
      setSelectedFileError("Μη αποδεκτός τύπος αρχείου");
      return;
    }

    // 4 MB ~= 4194304 bytes (4*2^20)
    if (newSelectedFile.size > 4194304) {
      setSelectedFileError("Το μέγεθος του αρχείου ξεπερνάει το μέγιστο");
      return;
    }
    setSelectedFileError(undefined);
    setSelectedFile(target.files[0]);
  };

  return (
    <div className={styles["form_field"]}>
      <label htmlFor="image-input">Επιλέξτε Εικόνα</label>
      <p className={styles["form_text"]}>
        Προτιμήστε εικόνες με καλή ανάλυση και το κύριο περιεχόμενο στο κέντρο
        της εικόνας.
      </p>
      <small className={styles["form_field_status"]}>
        Αποδεκτοί τύποι αρχείων: .jpg, .jpeg, .png <br /> Μέγιστο επιτρεπόμενο
        μέγεθος: 4 MB
      </small>
      {selectedFileError && (
        <p className={styles["form_field_error"]}>{selectedFileError}</p>
      )}
      <input
        ref={fileInputRef}
        id="image-input"
        className={styles["form_hidden"]}
        type="file"
        multiple={false}
        onChange={onSelectFile}
        accept=".jpg, .jpeg, .png"
        required
        aria-required
      />
      <div className={styles["form_field_image"]} onClick={openFileSelection}>
        {selectedFile ? (
          <img
            src={imagePreview}
            alt="Επιλεγμένη εικόνα"
            aria-label="Πατήστε για επιλογή εικόνας"
          />
        ) : (
          <p>Επιλέξτε εικόνα</p>
        )}
      </div>
    </div>
  );
};

export default PostImage;
