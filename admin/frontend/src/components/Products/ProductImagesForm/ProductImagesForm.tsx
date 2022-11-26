import {
  FC,
  useContext,
  useEffect,
  useRef,
  useState,
  useMemo,
  ChangeEvent,
  FormEvent,
} from "react";

import { ImCross } from "react-icons/im";
import { FaPlus } from "react-icons/fa";

import { validateImageFile } from "../../../utils/input";

import { useHttp } from "../../../hooks";

import { AuthContext } from "../../../context";
import { AuthContextType } from "../../../interfaces/AuthContext";

import styles from "./ProductImagesForm.module.css";

const maxImages = 5;

interface ProductImagesFormProps {
  id: string | undefined;
  existingImages: number;
  onRefresh: () => void;
}

interface ApiResponse {
  message: string;
}

const ProductImagesForm: FC<ProductImagesFormProps> = ({
  id,
  existingImages,
  onRefresh,
}) => {
  const { auth } = useContext(AuthContext) as AuthContextType;
  // useHttp custom hook
  const { isLoading, error, sendRequest } = useHttp();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File[] | undefined>(
    undefined
  );
  const [selectedFileError, setSelectedFileError] = useState<
    string | undefined
  >();
  const [imagePreview, setImagePreview] = useState<string[] | undefined>(
    undefined
  );
  const allowedImages: number = selectedFile
    ? maxImages - existingImages - selectedFile.length
    : maxImages > existingImages
    ? maxImages - existingImages
    : 0;

  const imagesAreValid = useMemo(() => {
    if (!selectedFile) return false;
    for (let f of selectedFile) {
      if (!validateImageFile(f)) return false;
    }
    return true;
  }, [selectedFile]);

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

    const allPreviews = selectedFile.map((f) => {
      const objectUrl = URL.createObjectURL(f);
      return objectUrl;
    });

    setImagePreview(allPreviews);

    // free memory whenever this component is unmounted
    return () =>
      allPreviews.forEach((preview) =>
        preview ? URL.revokeObjectURL(preview) : ""
      );
  }, [selectedFile, setImagePreview]);

  /**
   * On file input change, check if the selected file was changed and if it's valid (type & size) update the selectedFile state
   * @param {ChangeEvent} event Input file selection was changed event
   */
  const onSelectFile = (event: ChangeEvent): void => {
    const target = event.target as HTMLInputElement;
    // if no file was selected, return
    if (!target || !target.files || target.files.length === 0) {
      return;
    }

    const newSelectedFiles = target.files;
    try {
      let files: File[] = [];
      const numberOfImages =
        newSelectedFiles.length > allowedImages
          ? allowedImages
          : newSelectedFiles.length;
      for (let i = 0; i < numberOfImages; i++) {
        const f = newSelectedFiles[i];
        // if selected file was not an image, return
        if (!validateImageFile(f))
          throw new Error(`Μη αποδεκτός τύπος αρχείου (${f.type})`);

        // 2 MB ~= 2097152 bytes (2*2^20)
        if (f.size > 2097152)
          throw new Error("Το μέγεθος του αρχείου ξεπερνάει το μέγιστο");

        files.push(f);
      }
      setSelectedFileError(undefined);
      setSelectedFile((prev) => (!prev ? files : [...prev, ...files]));
    } catch (e: any) {
      setSelectedFile(undefined);
      setSelectedFileError(e.message);
    }
  };

  /**
   * Delete a selected image from selected images array
   * @param {number} index The index of the image to be deleted
   */
  const deleteSelectedFile = (index: number) => {
    if (!selectedFile || index < 0 || index >= selectedFile.length) {
      return;
    }

    setSelectedFile((prev) => {
      if (!prev || prev.length === 1) return undefined;
      const temp = [...prev];
      temp.splice(index, 1);
      return temp;
    });
  };

  const uploadImages = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!imagesAreValid || !selectedFile || selectedFile.length === 0) return;

    // transform API response
    const transformResponse = (response: ApiResponse) => {
      setSelectedFile(undefined);
      setSelectedFileError(undefined);
      onRefresh();
    };

    const formData = new FormData();
    for (let f of selectedFile) {
      formData.append("productImages", f);
    }

    // send POST request to API's route /admin/product/upload-image/:id
    const url = `${process.env.REACT_APP_API_URL}/admin/product/upload-image/${id}`;
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
    <form className={styles["form_field"]} onSubmit={uploadImages}>
      {maxImages > existingImages ? (
        <label htmlFor="image-input">
          Επιλέξτε Εικόνες (μέχρι {allowedImages})
          {existingImages > 0 && (
            <>
              <br />
              Σβήστε κάποιες απ'τις υπάρχουσες ή τις επιλεγμένες εικόνες για να
              προσθέσετε περισσότερες
            </>
          )}
        </label>
      ) : (
        <h2>
          Σβήστε κάποιες απ'τις υπάρχουσες εικόνες για να μπορέσετε να
          προσθέσετε νέες.
        </h2>
      )}
      {maxImages > existingImages && (
        <>
          <p className={styles["form_text"]}>
            Προτιμήστε εικόνες με καλή ανάλυση και το κύριο περιεχόμενο στο
            κέντρο της εικόνας.
          </p>
          <small className={styles["form_field_status"]}>
            Αποδεκτοί τύποι αρχείων: .jpg, .jpeg, .png <br /> Μέγιστο
            επιτρεπόμενο μέγεθος: 2 MB
          </small>
        </>
      )}
      {selectedFileError && (
        <p className={styles["form_field_error"]}>{selectedFileError}</p>
      )}
      <div className={styles["form_images"]}>
        {allowedImages > 0 && (
          <input
            ref={fileInputRef}
            id="image-input"
            className={styles["form_hidden"]}
            type="file"
            multiple
            onChange={onSelectFile}
            accept=".jpg, .jpeg, .png"
            required
            aria-required
          />
        )}
        {imagePreview &&
          imagePreview.map((image, idx) => (
            <div
              key={`new-image-${idx}`}
              className={styles["form_field_image"]}
              onClick={() => deleteSelectedFile(idx)}
            >
              <img src={image} alt="Επιλεγμένη εικόνα" />
              <ImCross className={styles["form_field_image-icon"]} />
            </div>
          ))}
        {allowedImages > 0 && (
          <div
            className={styles["form_field_image"]}
            onClick={openFileSelection}
          >
            <FaPlus />
            <p>Επιλέξτε εικόνα</p>
          </div>
        )}
        {maxImages > existingImages && (
          <div className={styles["form_btn_container"]}>
            <button
              type="submit"
              className={styles["form_submit_btn"]}
              disabled={isLoading || !imagesAreValid}
            >
              Αποθήκευση Εικόνων
            </button>
          </div>
        )}
        {error && error.trim() !== "" && (
          <p className={styles["form_error"]}>{error}</p>
        )}
      </div>
    </form>
  );
};

export default ProductImagesForm;
