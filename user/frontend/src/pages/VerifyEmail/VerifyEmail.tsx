import { FC, useEffect, useState } from "react";
import { BsCheckLg, BsXLg } from "react-icons/bs";

import { useParams, useNavigate, Link } from "react-router-dom";
import classNames from "classnames";

import { useHttp } from "../../hooks";

import { Layout } from "../../components/Auth";
import { LoadingSpinnerSecondary } from "../../components";

import styles from "./VerifyEmail.module.css";

interface ApiResponse {
  message: string;
}

const VerifyEmail: FC = () => {
  // useHttp custom hook
  const { isLoading, error, sendRequest } = useHttp();
  const navigate = useNavigate();

  const params = useParams();
  const { vat, hash } = params;

  const [message, setMessage] = useState<string>(
    "Γίνεται επιβεβαίωση του λογαριασμού σας..."
  );
  const [icon, setIcon] = useState<JSX.Element>(
    <div className={styles["spinner"]}>
      <LoadingSpinnerSecondary />
    </div>
  );

  if (!isLoading && error && message !== error) {
    setMessage(error);
    setIcon(
      <BsXLg className={classNames(styles["verify-email_status_icon"])} />
    );
  }

  useEffect(() => {
    let unmounted = false;
    if (!vat || !hash) navigate("/", { replace: true });
    let redirectTimer: ReturnType<typeof setTimeout> | null = null;

    // transform API response
    const transformResponse = (response: ApiResponse) => {
      setMessage(response.message);
      setIcon(
        <BsCheckLg className={classNames(styles["verify-email_status_icon"])} />
      );
      redirectTimer = setTimeout(
        () => navigate("/login", { replace: true }),
        5000
      );
    };

    if (!unmounted) {
      (window as any).grecaptcha.ready(() => {
        (window as any).grecaptcha
          .execute(process.env.REACT_APP_RECAPTCHA_KEY, {
            action: "verify_email",
          })
          .then((token: string) => {
            // send POST request to API's route /auth/verify
            const url = `${process.env.REACT_APP_API_URL}/auth/verify`;
            sendRequest(
              {
                url,
                method: "POST",
                data: { vat, hash, googleRecaptchaToken: token },
              },
              transformResponse
            );
          })
          .catch((error: any) => {
            return;
          });
      });
    }
    // clean-up function
    return () => {
      unmounted = true;
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [sendRequest, navigate]);

  return (
    <Layout>
      <div className={classNames(styles["verify-email"])}>
        {icon}
        <p>{message}</p>
      </div>
    </Layout>
  );
};

export default VerifyEmail;
