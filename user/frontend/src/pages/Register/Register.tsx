import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useHttp } from "../../hooks";

import { RegisterForm, Layout } from "../../components/Auth";

import styles from "./Register.module.css";

interface ApiResponse {
  message: string;
}

const Register: FC = () => {
  // useHttp custom hook
  const { isLoading, error, sendRequest } = useHttp();
  const navigate = useNavigate();

  const [successMessage, setSuccessMessage] = useState<string>("");

  // Handle register submit pressed on form
  const registerHandler = (
    name: string,
    surname: string,
    storeName: string,
    vat: string,
    doy: string,
    email: string,
    phone: string,
    password: string,
    siteUrl: string | undefined | null,
    googleRecaptchaToken: string
  ) => {
    // in case of no data or empty data, return
    if (
      !name ||
      name === "" ||
      !surname ||
      surname === "" ||
      !storeName ||
      storeName === "" ||
      !vat ||
      vat === "" ||
      !doy ||
      doy === "" ||
      !email ||
      email === "" ||
      !phone ||
      phone === "" ||
      !password ||
      password === "" ||
      (siteUrl && siteUrl === "") ||
      !googleRecaptchaToken ||
      googleRecaptchaToken === ""
    )
      return;

    // transform API response
    const transformResponse = (response: ApiResponse) => {
      setSuccessMessage(response.message);
      setTimeout(() => navigate("/login", { replace: true }), 5000);
    };

    // send POST request to API's route /auth/login
    const url = `${process.env.REACT_APP_API_URL}/auth/register`;
    sendRequest(
      {
        url,
        method: "POST",
        data: {
          name,
          surname,
          storeName,
          vat,
          doy,
          email,
          phone,
          password,
          siteUrl,
          googleRecaptchaToken,
        },
      },
      transformResponse
    );
  };
  return (
    <Layout>
      {!successMessage || successMessage.trim() === "" ? (
        <RegisterForm
          isLoading={isLoading}
          error={error}
          onSubmit={registerHandler}
        />
      ) : (
        <div className={styles["register_message"]}>
          <p>{successMessage}</p>
          <p>
            Θα ανακατευθυνθείτε αυτόματα στη σελίδα σύνδεσης σε μερικά
            δευτερόλεπτα...
          </p>
        </div>
      )}
    </Layout>
  );
};

export default Register;
