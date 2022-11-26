import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useHttp } from "../../hooks";

import { ForgotPasswordForm, Layout } from "../../components/Auth";

import styles from "./ForgotPassword.module.css";

interface SendOtpApiResponse {
  id: string;
  expiresIn: number;
}

interface VerifyOtpApiResponse {
  message: string;
}

const ForgotPassword: FC = () => {
  // useHttp custom hook
  const { isLoading, error, sendRequest } = useHttp();
  const navigate = useNavigate();

  const [partnerId, setPartnerId] = useState<string>("");
  const [otpExpiresIn, setOtpExpiresIn] = useState<number>(0);
  const [otpSuccess, setOtpSuccess] = useState<boolean>(false);

  const [successMessage, setSuccessMessage] = useState<string>("");

  // Handle send OTP pressed on form
  const sendOtpHandler = (
    email: string,
    vat: string,
    googleRecaptchaToken: string
  ) => {
    // in case of no data or empty data, return
    if (
      !email ||
      !vat ||
      !googleRecaptchaToken ||
      email.trim() === "" ||
      vat.trim() === "" ||
      googleRecaptchaToken.trim() === ""
    )
      return;

    // transform API response
    const transformResponse = (response: SendOtpApiResponse) => {
      setPartnerId(response.id);
      setOtpExpiresIn(response.expiresIn);
      setOtpSuccess(true);
    };

    // send POST request to API's route /auth/send-otp
    const url = `${process.env.REACT_APP_API_URL}/auth/send-otp`;
    sendRequest(
      {
        url,
        method: "POST",
        data: { email, vat, googleRecaptchaToken },
      },
      transformResponse
    );
  };

  // Handle verify OTP submit pressed on form
  const verifyOtpHandler = (
    email: string,
    vat: string,
    otp: string,
    googleRecaptchaToken: string
  ) => {
    // in case of no data or empty data, return
    if (
      !partnerId ||
      !email ||
      !vat ||
      !googleRecaptchaToken ||
      !otp ||
      partnerId.trim() === "" ||
      email.trim() === "" ||
      vat.trim() === "" ||
      !otp ||
      googleRecaptchaToken.trim() === ""
    )
      return;

    // transform API response
    const transformResponse = (response: VerifyOtpApiResponse) => {
      setSuccessMessage(response.message);
      setTimeout(() => navigate("/login", { replace: true }), 5000);
    };

    // send POST request to API's route /auth/verify-otp
    const url = `${process.env.REACT_APP_API_URL}/auth/verify-otp`;
    sendRequest(
      {
        url,
        method: "POST",
        data: {
          id: partnerId,
          email,
          vat,
          otp,
          googleRecaptchaToken,
        },
      },
      transformResponse
    );
  };

  const cancelHandler = () => {
    setPartnerId("");
    setOtpExpiresIn(0);
    setOtpSuccess(false);
  };

  return (
    <Layout>
      {!successMessage || successMessage.trim() === "" ? (
        <ForgotPasswordForm
          isLoading={isLoading}
          error={error}
          onSendOtp={sendOtpHandler}
          showOtpForm={otpSuccess}
          otpExpiresIn={otpExpiresIn}
          onVerifyOtp={verifyOtpHandler}
          onCancel={cancelHandler}
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

export default ForgotPassword;
