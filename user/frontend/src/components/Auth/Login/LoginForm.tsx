import { FC, useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

import { validateEmail, validatePassword } from "../../../utils/input";
import { partnerEmailLength } from "../../../constants";

import styles from "./LoginForm.module.css";

interface LoginFormProps {
  isLoading: boolean;
  error: string | null;
  onSubmit: (
    email: string,
    password: string,
    googleRecaptchaToken: string
  ) => void;
}

const LoginForm: FC<LoginFormProps> = ({ isLoading, error, onSubmit }) => {
  useEffect(() => {
    const interval = setInterval(() => {
      (window as any).grecaptcha.ready(() => {
        try {
          (window as any).grecaptcha.reset();
        } catch (error) {
          return;
        }
      });
    }, 110000);
    return () => clearInterval(interval);
  }, []);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordDisplay, setPasswordDisplay] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  const emailErrorMessage = validateEmail(email, partnerEmailLength);
  const emailIsValid = emailErrorMessage == null;
  const passwordErrorMessage = validatePassword(password);
  const passwordIsValid = passwordErrorMessage == null;

  const submitHandler = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!emailIsValid || !passwordIsValid) return;
    (window as any).grecaptcha.ready(() => {
      (window as any).grecaptcha
        .execute(process.env.REACT_APP_RECAPTCHA_KEY, {
          action: "register",
        })
        .then((token: string) => {
          onSubmit(email, password, token);
        })
        .catch((error: any) => {
          return;
        });
    });
  };

  const emailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (emailError !== "") setEmailError("");
    setEmail(event.target.value);
  };

  const emailBlurHandler = () => {
    if (!emailIsValid) {
      setEmailError(emailErrorMessage);
    } else {
      setEmailError("");
    }
  };

  const passwordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (passwordError !== "") setPasswordError("");
    setPassword(event.target.value);
  };

  const passwordBlurHandler = () => {
    if (!passwordIsValid) {
      setPasswordError(passwordErrorMessage);
    } else {
      setPasswordError("");
    }
  };

  return (
    <div className={classNames(styles["form-container"])}>
      <form onSubmit={submitHandler} className={classNames(styles["form"])}>
        {/* Form Header */}
        <h2 className={classNames(styles["form_title"])}>
          Συνδεθείτε στο λογαριασμό σας
        </h2>
        {error && error.toString().trim() && (
          <p className={classNames(styles["form_error"])}>{error}</p>
        )}

        {/* Email input */}
        <div className={classNames(styles["form_field"])}>
          <label htmlFor="email-input">Διεύθυνση E-mail</label>
          <div className={classNames(styles["form_field_input"])}>
            <input
              id="email-input"
              type="email"
              placeholder="π.χ. example@email.com"
              disabled={isLoading}
              value={email}
              onChange={emailChangeHandler}
              onBlur={emailBlurHandler}
              required
              aria-required
            />
          </div>
          {emailError && emailError.trim() !== "" && (
            <p className={classNames(styles["form_field_error"])}>
              {emailError}
            </p>
          )}
        </div>

        {/* Password input */}
        <div className={classNames(styles["form_field"])}>
          <label htmlFor="password-input">Κωδικός Πρόσβασης</label>
          <div className={classNames(styles["form_field_input_password"])}>
            <input
              id="password-input"
              type={passwordDisplay ? "text" : "password"}
              placeholder="π.χ. ********"
              disabled={isLoading}
              value={password}
              onChange={passwordChangeHandler}
              onBlur={passwordBlurHandler}
              required
              aria-required
            />
            <span
              className={classNames(styles["form_field_input_password_icon"])}
              onClick={() => setPasswordDisplay((prev) => !prev)}
            >
              {passwordDisplay ? <AiFillEyeInvisible /> : <AiFillEye />}
            </span>
          </div>
          {passwordError && passwordError.trim() !== "" && (
            <p className={classNames(styles["form_field_error"])}>
              {passwordError}
            </p>
          )}
        </div>

        <button
          type="submit"
          className={classNames(styles["form_submit_btn"])}
          disabled={!emailIsValid || !passwordIsValid || isLoading}
        >
          ΣΥΝΔΕΣΗ
        </button>
        <small className={classNames(styles["form_recaptcha_container"])}>
          This site is protected by reCAPTCHA and the Google{" "}
          <a href="https://policies.google.com/privacy">Privacy Policy</a> and{" "}
          <a href="https://policies.google.com/terms">Terms of Service</a>{" "}
          apply.
        </small>
        <Link
          to="/forgot-password"
          className={classNames(styles["form_redirect_links"])}
        >
          Ξεχάσατε τον κωδικό πρόσβασης; Πατήστε εδώ για επαναφορά
        </Link>
        <Link
          to="/register"
          className={classNames(styles["form_redirect_links"])}
        >
          Δεν έχετε λογαριασμό; Πατήστε εδώ για εγγραφή
        </Link>
      </form>
    </div>
  );
};

export default LoginForm;
