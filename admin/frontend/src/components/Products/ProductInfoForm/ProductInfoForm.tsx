import { FC, ChangeEvent } from "react";

import {
  productShortDescriptionLength,
  productDescriptionLength,
} from "../../../constants";

import { numberToString } from "../../../utils";

import styles from "./ProductInfoForm.module.css";

interface ProductInfoFormProps {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  nameError: string;
  setNameError: React.Dispatch<React.SetStateAction<string>>;
  nameErrorMessage: string | null;
  nameIsValid: boolean;
  shortDescription: string;
  setShortDescription: React.Dispatch<React.SetStateAction<string>>;
  shortDescriptionError: string;
  setShortDescriptionError: React.Dispatch<React.SetStateAction<string>>;
  shortDescriptionErrorMessage: string | null;
  shortDescriptionIsValid: boolean;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  descriptionError: string;
  setDescriptionError: React.Dispatch<React.SetStateAction<string>>;
  descriptionErrorMessage: string | null;
  descriptionIsValid: boolean;
  price: string;
  setPrice: React.Dispatch<React.SetStateAction<string>>;
  priceError: string;
  setPriceError: React.Dispatch<React.SetStateAction<string>>;
  priceErrorMessage: string | null;
  priceIsValid: boolean;
  isLoading: boolean;
}

const ProductInfoForm: FC<ProductInfoFormProps> = ({
  name,
  setName,
  nameError,
  setNameError,
  nameErrorMessage,
  nameIsValid,
  shortDescription,
  setShortDescription,
  shortDescriptionError,
  setShortDescriptionError,
  shortDescriptionErrorMessage,
  shortDescriptionIsValid,
  description,
  setDescription,
  descriptionError,
  setDescriptionError,
  descriptionErrorMessage,
  descriptionIsValid,
  price,
  setPrice,
  priceError,
  setPriceError,
  priceErrorMessage,
  priceIsValid,
  isLoading,
}) => {
  const nameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (nameError !== "") setNameError("");
    setName(event.target.value);
  };

  const nameBlurHandler = () => {
    if (!nameIsValid && nameErrorMessage) {
      setNameError(nameErrorMessage);
    } else {
      setNameError("");
    }
  };

  const shortDescriptionChangeHandler = (
    event: ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (shortDescriptionError !== "") setShortDescriptionError("");
    setShortDescription(event.target.value);
  };

  const shortDescriptionBlurHandler = () => {
    if (!shortDescriptionIsValid && shortDescriptionErrorMessage) {
      setShortDescriptionError(shortDescriptionErrorMessage);
    } else {
      setShortDescriptionError("");
    }
  };

  const descriptionChangeHandler = (
    event: ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (descriptionError !== "") setDescriptionError("");
    setDescription(event.target.value);
  };

  const descriptionBlurHandler = () => {
    if (!descriptionIsValid && descriptionErrorMessage) {
      setDescriptionError(descriptionErrorMessage);
    } else {
      setDescriptionError("");
    }
  };

  const priceChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (priceError !== "") setPriceError("");
    setPrice(event.target.value);
  };

  const priceBlurHandler = () => {
    setPrice((enteredPrice) => numberToString(enteredPrice, 2));
    if (!priceIsValid && priceErrorMessage) {
      setPriceError(priceErrorMessage);
    } else {
      setPriceError("");
    }
  };

  return (
    <>
      {/* Name input */}
      <div className={styles["form_field"]}>
        <label htmlFor="name-input">Όνομα Προϊόντος</label>
        <div
          className={
            isLoading
              ? styles["form_field_input-disabled"]
              : styles["form_field_input"]
          }
        >
          <input
            id="name-input"
            type="text"
            placeholder="π.χ. Προϊόν 1"
            disabled={isLoading}
            value={name}
            onChange={nameChangeHandler}
            onBlur={nameBlurHandler}
            required
            aria-required
          />
        </div>
        {nameError && nameError.trim() !== "" && (
          <p className={styles["form_field_error"]}>{nameError}</p>
        )}
      </div>

      {/* Short Description input */}
      <div className={styles["form_field"]}>
        <label htmlFor="short-description-input">Σύντομη Περιγραφή</label>
        <div
          className={
            isLoading
              ? styles["form_field_input-disabled"]
              : styles["form_field_input"]
          }
        >
          <textarea
            id="short-description-input"
            rows={2}
            maxLength={productShortDescriptionLength}
            placeholder={`Συνοπτική περιγραφή του προϊόντος (μέχρι ${productShortDescriptionLength} χαρακτήρες)`}
            disabled={isLoading}
            value={shortDescription}
            onChange={shortDescriptionChangeHandler}
            onBlur={shortDescriptionBlurHandler}
            required
            aria-required
          />
        </div>
        {shortDescriptionError && shortDescriptionError.trim() !== "" && (
          <p className={styles["form_field_error"]}>{shortDescriptionError}</p>
        )}
      </div>

      {/* Description input */}
      <div className={styles["form_field"]}>
        <label htmlFor="description-input">Εκτενής Περιγραφή</label>
        <div
          className={
            isLoading
              ? styles["form_field_input-disabled"]
              : styles["form_field_input"]
          }
        >
          <textarea
            id="description-input"
            rows={5}
            maxLength={productDescriptionLength}
            placeholder={`Εκτενής περιγραφή του προϊόντος (μέχρι ${productDescriptionLength} χαρακτήρες)`}
            disabled={isLoading}
            value={description}
            onChange={descriptionChangeHandler}
            onBlur={descriptionBlurHandler}
            required
            aria-required
          />
        </div>
        {descriptionError && descriptionError.trim() !== "" && (
          <p className={styles["form_field_error"]}>{descriptionError}</p>
        )}
      </div>

      {/* Price input */}
      <div className={styles["form_field"]}>
        <label htmlFor="price-input">Τιμή</label>
        <div
          className={
            isLoading
              ? styles["form_field_input-disabled"]
              : styles["form_field_input"]
          }
        >
          <input
            id="price-input"
            type="number"
            min={0.05}
            max={20.0}
            step={0.01}
            placeholder="π.χ. 1.80"
            disabled={isLoading}
            value={price}
            onChange={priceChangeHandler}
            onBlur={priceBlurHandler}
            required
            aria-required
          />
        </div>
        {priceError && priceError.trim() !== "" && (
          <p className={styles["form_field_error"]}>{priceError}</p>
        )}
      </div>
    </>
  );
};

export default ProductInfoForm;
