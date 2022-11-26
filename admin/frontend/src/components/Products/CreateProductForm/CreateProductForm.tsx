import { FC, useState, useContext, FormEvent } from "react";
import { useNavigate, NavigateFunction } from "react-router-dom";

import { useHttp } from "../../../hooks";

import { AuthContext } from "../../../context";
import { AuthContextType } from "../../../interfaces/AuthContext";

import { validateText, validateFloat } from "../../../utils/input";

import {
  productNameLength,
  productDescriptionLength,
  productShortDescriptionLength,
} from "../../../constants";

import { ProductInfoForm } from "../index";

import styles from "./CreateProductForm.module.css";

interface ApiResponse {
  message: string;
  id: number;
}

const CreateProductForm: FC = () => {
  const navigate: NavigateFunction = useNavigate();
  const { auth } = useContext(AuthContext) as AuthContextType;
  // useHttp custom hook
  const { isLoading, error, sendRequest } = useHttp();

  const [productName, setProductName] = useState<string>("");
  const [productShortDescription, setProductShortDescription] =
    useState<string>("");
  const [productDescription, setProductDescription] = useState<string>("");
  const [productPrice, setProductPrice] = useState<string>("");
  const [productNameError, setProductNameError] = useState<string>("");
  const [productShortDescriptionError, setProductShortDescriptionError] =
    useState<string>("");
  const [productDescriptionError, setProductDescriptionError] =
    useState<string>("");
  const [productPriceError, setProductPriceError] = useState<string>("");

  const nameErrorMessage = validateText(productName, productNameLength);
  const nameIsValid = nameErrorMessage == null;
  const shortDescriptionErrorMessage = validateText(
    productShortDescription,
    productShortDescriptionLength
  );
  const shortDescriptionIsValid = shortDescriptionErrorMessage == null;
  const descriptionErrorMessage = validateText(
    productDescription,
    productDescriptionLength
  );
  const descriptionIsValid = descriptionErrorMessage == null;
  const priceErrorMessage = validateFloat(productPrice);
  const priceIsValid = priceErrorMessage == null;

  const formIsValid =
    nameIsValid &&
    shortDescriptionIsValid &&
    descriptionIsValid &&
    priceIsValid;

  const createProduct = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!formIsValid) return;

    // transform API response
    const transformResponse = (response: ApiResponse) => {
      navigate("/menu", { replace: true });
    };

    // send POST request to API's route /product/create
    const url = `${process.env.REACT_APP_API_URL}/admin/product/create`;
    sendRequest(
      {
        url,
        method: "POST",
        token: auth.token,
        data: {
          name: productName.trim(),
          shortDescription: productShortDescription.trim(),
          description: productDescription.trim(),
          price: productPrice.trim(),
        },
      },
      transformResponse
    );
  };

  return (
    <form className={styles["form_container"]} onSubmit={createProduct}>
      <ProductInfoForm
        name={productName}
        setName={setProductName}
        nameError={productNameError}
        setNameError={setProductNameError}
        nameErrorMessage={nameErrorMessage}
        nameIsValid={nameIsValid}
        shortDescription={productShortDescription}
        setShortDescription={setProductShortDescription}
        shortDescriptionError={productShortDescriptionError}
        setShortDescriptionError={setProductShortDescriptionError}
        shortDescriptionErrorMessage={shortDescriptionErrorMessage}
        shortDescriptionIsValid={shortDescriptionIsValid}
        description={productDescription}
        setDescription={setProductDescription}
        descriptionError={productDescriptionError}
        setDescriptionError={setProductDescriptionError}
        descriptionErrorMessage={descriptionErrorMessage}
        descriptionIsValid={descriptionIsValid}
        price={productPrice}
        setPrice={setProductPrice}
        priceError={productPriceError}
        setPriceError={setProductPriceError}
        priceErrorMessage={priceErrorMessage}
        priceIsValid={priceIsValid}
        isLoading={isLoading}
      />
      <div className={styles["form_btn_container"]}>
        <button
          type="submit"
          className={styles["form_submit_btn"]}
          disabled={isLoading || !formIsValid}
        >
          Δημιουργία Προϊόντος
        </button>
      </div>
      {error && error.trim() !== "" && (
        <p className={styles["form_error"]}>{error}</p>
      )}
    </form>
  );
};

export default CreateProductForm;
