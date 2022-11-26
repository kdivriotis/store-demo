import { FC, useContext, useState } from "react";

import { AuthContextType } from "../../interfaces/AuthContext";
import { AuthContext } from "../../context";

import { useHttp } from "../../hooks";

import LoginForm from "../../components/Login/LoginForm";

interface LoginApiResponse {
  id: string;
  expiresIn: number;
}

interface VerifyOtpApiResponse {
  token: string;
  expiresIn: number;
}

const Login: FC = () => {
  // Authentication context
  const { login } = useContext(AuthContext) as AuthContextType;

  // useHttp custom hook
  const { isLoading, error, sendRequest } = useHttp();

  const [adminId, setAdminId] = useState<string>("");
  const [otpExpiresIn, setOtpExpiresIn] = useState<number>(0);
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);

  // Handle login submit pressed on form
  const loginHandler = (
    username: string,
    email: string,
    password: string,
    googleRecaptchaToken: string
  ) => {
    // in case of no data or empty data, return
    if (
      !username ||
      !email ||
      !password ||
      !googleRecaptchaToken ||
      username.trim() === "" ||
      email.trim() === "" ||
      password.trim() === "" ||
      googleRecaptchaToken.trim() === ""
    )
      return;

    // transform API response
    const transformResponse = (response: LoginApiResponse) => {
      setAdminId(response.id);
      setOtpExpiresIn(response.expiresIn);
      setLoginSuccess(true);
    };

    // send POST request to API's route /admin/login
    const url = `${process.env.REACT_APP_API_URL}/admin/auth/login`;
    sendRequest(
      {
        url,
        method: "POST",
        data: { username, email, password, googleRecaptchaToken },
      },
      transformResponse
    );
  };

  // Handle verify OTP submit pressed on form
  const verifyOtpHandler = (
    username: string,
    email: string,
    password: string,
    otp: string,
    googleRecaptchaToken: string
  ) => {
    // in case of no data or empty data, return
    if (
      !adminId ||
      !username ||
      !email ||
      !password ||
      !googleRecaptchaToken ||
      !otp ||
      adminId.trim() === "" ||
      username.trim() === "" ||
      email.trim() === "" ||
      password.trim() === "" ||
      !otp ||
      googleRecaptchaToken.trim() === ""
    )
      return;

    // transform API response
    const transformResponse = (response: VerifyOtpApiResponse) => {
      login(response.token, response.expiresIn);
    };

    // send POST request to API's route /admin/verify-otp
    const url = `${process.env.REACT_APP_API_URL}/admin/auth/verify-otp`;
    sendRequest(
      {
        url,
        method: "POST",
        data: {
          id: adminId,
          username,
          email,
          password,
          otp,
          googleRecaptchaToken,
        },
      },
      transformResponse
    );
  };

  const cancelHandler = () => {
    setAdminId("");
    setOtpExpiresIn(0);
    setLoginSuccess(false);
  };

  return (
    <LoginForm
      isLoading={isLoading}
      error={error}
      onLogin={loginHandler}
      showOtpForm={loginSuccess}
      otpExpiresIn={otpExpiresIn}
      onVerifyOtp={verifyOtpHandler}
      onCancel={cancelHandler}
    />
  );
};

export default Login;
