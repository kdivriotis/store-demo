import {
  FC,
  useState,
  useEffect,
  createRef,
  ChangeEvent,
  FormEvent,
  RefObject,
} from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

import {
  validateText,
  validateEmail,
  validatePassword,
  validateDigitText,
} from "../../utils/input";
import {
  adminUsernameLength,
  adminEmailLength,
  adminOtpLength,
} from "../../constants";

import styles from "./LoginForm.module.css";

interface LoginFormProps {
  isLoading: boolean;
  error: string | null;
  onLogin: (
    username: string,
    email: string,
    password: string,
    googleRecaptchaToken: string
  ) => void;
  showOtpForm: boolean;
  otpExpiresIn: number;
  onVerifyOtp: (
    username: string,
    email: string,
    password: string,
    otp: string,
    googleRecaptchaToken: string
  ) => void;
  onCancel: () => void;
}

const LoginForm: FC<LoginFormProps> = ({
  isLoading,
  error,
  onLogin,
  showOtpForm,
  otpExpiresIn,
  onVerifyOtp,
  onCancel,
}) => {
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

  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordDisplay, setPasswordDisplay] = useState<boolean>(false);
  const [otp, setOtp] = useState<string[]>(new Array(adminOtpLength).fill(""));
  const [otpRefs] = useState<RefObject<HTMLInputElement>[]>(() =>
    Array.from({ length: adminOtpLength }, () => createRef())
  );
  const [usernameError, setUsernameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [otpError, setOtpError] = useState<string>("");

  const usernameErrorMessage = validateText(username, adminUsernameLength);
  const usernameIsValid = usernameErrorMessage == null;
  const emailErrorMessage = validateEmail(email, adminEmailLength);
  const emailIsValid = emailErrorMessage == null;
  const passwordErrorMessage = validatePassword(password);
  const passwordIsValid = passwordErrorMessage == null;
  const otpErrorMessage = validateDigitText(otp.join(""), adminOtpLength);
  const otpIsValid = otpErrorMessage == null;

  const formIsValid =
    usernameIsValid &&
    emailIsValid &&
    passwordIsValid &&
    (!showOtpForm || otpIsValid);

  const submitHandler = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!formIsValid) return;
    (window as any).grecaptcha.ready(() => {
      (window as any).grecaptcha
        .execute(process.env.REACT_APP_RECAPTCHA_KEY, {
          action: "loginAdmin",
        })
        .then((token: string) => {
          if (!showOtpForm) onLogin(username, email, password, token);
          else onVerifyOtp(username, email, password, otp.join(""), token);
        })
        .catch((error: any) => {
          return;
        });
    });
  };

  const usernameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (usernameError !== "") setUsernameError("");
    setUsername(event.target.value);
  };

  const usernameBlurHandler = () => {
    if (!usernameIsValid) {
      setUsernameError(usernameErrorMessage);
    } else {
      setUsernameError("");
    }
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

  const otpChangeHandler = (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (otpError !== "") setOtpError("");
    const newChar: string = event.target.value?.substring(
      event.target.value.length - 1,
      event.target.value.length
    );
    setOtp((prev) => {
      const newOtp = [...prev];
      if (index >= 0 && index < newOtp.length) newOtp[index] = newChar;
      return newOtp;
    });
    if (index < adminOtpLength - 1 && newChar.trim() !== "") {
      if (otpRefs?.[index + 1]?.current) {
        otpRefs?.[index + 1]?.current?.focus();
      }
    }
  };

  const otpBlurHandler = () => {
    if (!otpIsValid) {
      setOtpError(otpErrorMessage);
    } else {
      setOtpError("");
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

        {/* Username input */}
        <div className={classNames(styles["form_field"])}>
          <label htmlFor="username-input">Όνομα Χρήστη</label>
          <div className={classNames(styles["form_field_input"])}>
            <input
              id="username-input"
              type="text"
              placeholder="π.χ. me"
              disabled={isLoading || showOtpForm}
              value={username}
              onChange={usernameChangeHandler}
              onBlur={usernameBlurHandler}
              required
              aria-required
            />
          </div>
          {usernameError && usernameError.trim() !== "" && (
            <p className={classNames(styles["form_field_error"])}>
              {usernameError}
            </p>
          )}
        </div>

        {/* Email input */}
        <div className={classNames(styles["form_field"])}>
          <label htmlFor="email-input">Διεύθυνση E-mail</label>
          <div className={classNames(styles["form_field_input"])}>
            <input
              id="email-input"
              type="email"
              placeholder="π.χ. example@email.com"
              disabled={isLoading || showOtpForm}
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
              disabled={isLoading || showOtpForm}
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

        {/* OTP input */}
        {showOtpForm && (
          <div className={classNames(styles["form_field"])}>
            <label htmlFor="otp-input-1">
              Εισάγετε τον κωδικό μίας χρήσης που λάβατε στη διεύθυνση e-mail
              σας (ο κωδικός λήγει σε {otpExpiresIn} λεπτά)
            </label>
            <div className={classNames(styles["form_field_input_otp"])}>
              {otp.map((field, index) => (
                <input
                  key={`otp-${index}`}
                  ref={otpRefs[index]}
                  id={`otp-input-${index}`}
                  type="number"
                  maxLength={1}
                  min={0}
                  max={9}
                  value={field}
                  disabled={isLoading}
                  onChange={(e) => otpChangeHandler(e, index)}
                  onBlur={otpBlurHandler}
                  required
                  aria-required
                />
              ))}
            </div>
            {otpError && otpError.trim() !== "" && (
              <p className={classNames(styles["form_field_error"])}>
                {otpError}
              </p>
            )}
          </div>
        )}

        <button
          type="submit"
          className={classNames(styles["form_submit_btn"])}
          disabled={!formIsValid || isLoading}
        >
          {showOtpForm ? "ΕΠΙΒΕΒΑΙΩΣΗ" : "ΣΥΝΔΕΣΗ"}
        </button>
        {showOtpForm && (
          <button
            type="button"
            className={classNames(styles["form_cancel_btn"])}
            disabled={isLoading}
            onClick={onCancel}
          >
            {"ΑΚΥΡΩΣΗ"}
          </button>
        )}
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
      </form>
    </div>
  );
};

export default LoginForm;
