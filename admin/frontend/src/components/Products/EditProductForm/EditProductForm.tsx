import {
  FC,
  useState,
  useContext,
  useEffect,
  useCallback,
  FormEvent,
} from "react";
import { useParams, useNavigate, NavigateFunction } from "react-router-dom";

import { useHttp } from "../../../hooks";

import { AuthContext } from "../../../context";
import { AuthContextType } from "../../../interfaces/AuthContext";

import { numberToString } from "../../../utils";
import { validateText, validateFloat } from "../../../utils/input";

import {
  productNameLength,
  productDescriptionLength,
  productShortDescriptionLength,
} from "../../../constants";

import {
  ProductInfoForm,
  ProductImagesForm,
  ProductImagesDisplay,
} from "../index";

import { ProductDetails } from "../../../interfaces/Product";

import styles from "./EditProductForm.module.css";

interface ApiResponse {
  message: string;
}

const EditProductForm: FC = () => {
  const navigate: NavigateFunction = useNavigate();
  const { auth } = useContext(AuthContext) as AuthContextType;
  const params = useParams();
  const { productId } = params;

  // useHttp custom hook
  const { isLoading, error, sendRequest } = useHttp();

  if (!productId || productId.trim() === "")
    navigate("/menu", { replace: true });

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
  const [productImages, setProductImages] = useState<
    string[] | null | undefined
  >(null);

  // Get product's details from API and set state
  const getProductDetails = useCallback(() => {
    // transform API response
    const transformResponse = (response: ProductDetails) => {
      setProductName(response.name);
      setProductShortDescription(response.shortDescription);
      setProductDescription(response.description);
      setProductPrice(numberToString(response.price, 2));
      setProductImages(response.images);
    };

    // send GET request to API's route /product/details/:id
    const url = `${process.env.REACT_APP_API_URL}/admin/product/details/${productId}`;
    sendRequest({ url, method: "GET", token: auth.token }, transformResponse);
  }, [
    productId,
    setProductName,
    setProductShortDescription,
    setProductDescription,
    setProductPrice,
    sendRequest,
    auth.token,
  ]);

  useEffect(() => {
    getProductDetails();
  }, [getProductDetails]);

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

  const editProduct = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!formIsValid) return;

    // transform API response
    const transformResponse = (response: ApiResponse) => {
      navigate("/menu", { replace: true });
    };

    // send PATCH request to API's route /admin/product/edit/:id
    const url = `${process.env.REACT_APP_API_URL}/admin/product/edit/${productId}`;
    sendRequest(
      {
        url,
        method: "PATCH",
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
    <>
      <form className={styles["form_container"]} onSubmit={editProduct}>
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
            Αποθήκευση Αλλαγών
          </button>
        </div>
        {error && error.trim() !== "" && (
          <p className={styles["form_error"]}>{error}</p>
        )}
      </form>
      <ProductImagesDisplay
        images={productImages}
        onRefresh={getProductDetails}
      />
      <ProductImagesForm
        id={productId}
        existingImages={productImages ? productImages.length : 0}
        onRefresh={getProductDetails}
      />
    </>
  );
};

export default EditProductForm;
