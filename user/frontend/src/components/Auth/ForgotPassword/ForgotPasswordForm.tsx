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

import { validateEmail, validateDigitText } from "../../../utils/input";

import {
  partnerEmailLength,
  partnerVatLength,
  partnerOtpLength,
} from "../../../constants";

import styles from "./ForgotPasswordForm.module.css";

interface ForgotPasswordFormProps {
  isLoading: boolean;
  error: string | null;
  onSendOtp: (email: string, vat: string, googleRecaptchaToken: string) => void;
  showOtpForm: boolean;
  otpExpiresIn: number;
  onVerifyOtp: (
    email: string,
    vat: string,
    otp: string,
    googleRecaptchaToken: string
  ) => void;
  onCancel: () => void;
}

const ForgotPasswordForm: FC<ForgotPasswordFormProps> = ({
  isLoading,
  error,
  onSendOtp,
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

  const [vat, setVat] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string[]>(
    new Array(partnerOtpLength).fill("")
  );
  const [otpRefs] = useState<RefObject<HTMLInputElement>[]>(() =>
    Array.from({ length: partnerOtpLength }, () => createRef())
  );
  const [emailError, setEmailError] = useState<string>("");
  const [vatError, setVatError] = useState<string>("");
  const [otpError, setOtpError] = useState<string>("");

  const emailErrorMessage = validateEmail(email, partnerEmailLength);
  const emailIsValid = emailErrorMessage == null;
  const vatErrorMessage = validateDigitText(vat, partnerVatLength);
  const vatIsValid = vatErrorMessage == null;
  const otpErrorMessage = validateDigitText(otp.join(""), partnerOtpLength);
  const otpIsValid = otpErrorMessage == null;

  const formIsValid =
    emailIsValid && vatIsValid && (!showOtpForm || otpIsValid);

  const submitHandler = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!formIsValid) return;
    (window as any).grecaptcha.ready(() => {
      (window as any).grecaptcha
        .execute(process.env.REACT_APP_RECAPTCHA_KEY, {
          action: "forgotPassword",
        })
        .then((token: string) => {
          if (!showOtpForm) onSendOtp(email, vat, token);
          else onVerifyOtp(email, vat, otp.join(""), token);
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

  const vatChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (vatError !== "") setVatError("");
    setVat(event.target.value);
  };

  const vatBlurHandler = () => {
    if (!vatIsValid) {
      setVatError(vatErrorMessage);
    } else {
      setVatError("");
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
    if (index < partnerOtpLength - 1 && newChar.trim() !== "") {
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

        {/* VAT input */}
        <div className={classNames(styles["form_field"])}>
          <label htmlFor="vat-input">Α.Φ.Μ.</label>
          <div className={classNames(styles["form_field_input"])}>
            <input
              id="vat-input"
              type="number"
              placeholder="Αριθμός Φορολογικού Μητρώου (9 ψηφία)"
              disabled={isLoading || showOtpForm}
              value={vat}
              onChange={vatChangeHandler}
              onBlur={vatBlurHandler}
              required
              aria-required
            />
          </div>
          {vatError && vatError.trim() !== "" && (
            <p className={classNames(styles["form_field_error"])}>{vatError}</p>
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
          {showOtpForm ? "ΕΠΙΒΕΒΑΙΩΣΗ" : "ΑΠΟΣΤΟΛΗ ΚΩΔΙΚΟΥ"}
        </button>
        {showOtpForm && (
          <button
            type="button"
            className={classNames(styles["form_cancel_btn"])}
            disabled={isLoading}
            onClick={onCancel}
          >
            ΑΚΥΡΩΣΗ
          </button>
        )}
        <small className={classNames(styles["form_recaptcha_container"])}>
          This site is protected by reCAPTCHA and the Google{" "}
          <a href="https://policies.google.com/privacy">Privacy Policy</a> and{" "}
          <a href="https://policies.google.com/terms">Terms of Service</a>{" "}
          apply.
        </small>
        <Link to="/login" className={classNames(styles["form_redirect_links"])}>
          Πατήστε εδώ για να συνδεθείτε στο λογαριασμό σας
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

export default ForgotPasswordForm;
