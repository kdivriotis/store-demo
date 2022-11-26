import { FC, useContext } from "react";

import { AuthContextType } from "../../interfaces/AuthContext";
import { AuthContext } from "../../context";

import { useHttp } from "../../hooks";

import { LoginForm, Layout } from "../../components/Auth";

interface ApiResponse {
  token: string;
  expiresIn: number;
  email: string;
  name: string;
  storeName: string;
  emailVerified: boolean;
  isVerified: boolean;
}

const Login: FC = () => {
  //  Authentication context
  const { login } = useContext(AuthContext) as AuthContextType;

  // useHttp custom hook
  const { isLoading, error, sendRequest } = useHttp();

  // Handle login submit pressed on form
  const loginHandler = (
    email: string,
    password: string,
    googleRecaptchaToken: string
  ) => {
    // in case of no data or empty data, return
    if (
      !email ||
      !password ||
      !googleRecaptchaToken ||
      email.trim() === "" ||
      password.trim() === "" ||
      googleRecaptchaToken.trim() === ""
    )
      return;

    // transform API response
    const transformResponse = (response: ApiResponse) => {
      login(
        response.token,
        response.expiresIn,
        response.email,
        response.name,
        response.storeName,
        response.emailVerified,
        response.isVerified
      );
    };

    // send POST request to API's route /auth/login
    const url = `${process.env.REACT_APP_API_URL}/auth/login`;
    sendRequest(
      { url, method: "POST", data: { email, password, googleRecaptchaToken } },
      transformResponse
    );
  };
  return (
    <Layout>
      <LoginForm isLoading={isLoading} error={error} onSubmit={loginHandler} />
    </Layout>
  );
};

export default Login;
