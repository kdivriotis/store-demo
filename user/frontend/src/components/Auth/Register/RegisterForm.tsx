import {
  FC,
  useState,
  useMemo,
  useEffect,
  ChangeEvent,
  FormEvent,
} from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

import {
  validateEmail,
  validatePassword,
  validateText,
  validateDigitText,
  validateUrl,
} from "../../../utils/input";
import {
  doys,
  partnerNameLength,
  partnerStoreNameLength,
  partnerVatLength,
  partnerDoyLength,
  partnerEmailLength,
  partnerPhoneLength,
  partnerSiteUrlLength,
} from "../../../constants";

import styles from "./RegisterForm.module.css";

interface RegisterFormProps {
  isLoading: boolean;
  error: string | null;
  onSubmit: (
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
  ) => void;
}

const RegisterForm: FC<RegisterFormProps> = ({
  isLoading,
  error,
  onSubmit,
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

  const sortedDoys = useMemo(
    () => doys.slice().sort((a, b) => a.localeCompare(b)),
    [doys]
  );

  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [storeName, setStoreName] = useState<string>("");
  const [siteUrl, setSiteUrl] = useState<string>("");
  const [vat, setVat] = useState<string>("");
  const [doy, setDoy] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordDisplay, setPasswordDisplay] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [confirmPasswordDisplay, setConfirmPasswordDisplay] =
    useState<boolean>(false);

  const [nameError, setNameError] = useState<string>("");
  const [surnameError, setSurnameError] = useState<string>("");
  const [storeNameError, setStoreNameError] = useState<string>("");
  const [siteUrlError, setSiteUrlError] = useState<string>("");
  const [vatError, setVatError] = useState<string>("");
  const [doyError, setDoyError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");

  const nameErrorMessage = validateText(name, partnerNameLength);
  const nameIsValid = nameErrorMessage == null;
  const surnameErrorMessage = validateText(surname, partnerNameLength);
  const surnameIsValid = surnameErrorMessage == null;
  const storeNameErrorMessage = validateText(storeName, partnerStoreNameLength);
  const storeNameIsValid = storeNameErrorMessage == null;
  let siteUrlErrorMessage: string | null = null,
    siteUrlIsValid = true;
  if (siteUrl && siteUrl.trim() !== "") {
    siteUrlErrorMessage =
      validateText(siteUrl, partnerSiteUrlLength) || validateUrl(siteUrl);
    siteUrlIsValid = siteUrlErrorMessage == null;
  }
  const vatErrorMessage = validateDigitText(vat, partnerVatLength);
  const vatIsValid = vatErrorMessage == null;
  const doyErrorMessage = validateText(doy, partnerDoyLength);
  const doyIsValid = doyErrorMessage == null;
  const emailErrorMessage = validateEmail(email, partnerEmailLength);
  const emailIsValid = emailErrorMessage == null;
  const phoneErrorMessage = validateDigitText(phone, partnerPhoneLength);
  const phoneIsValid = phoneErrorMessage == null;
  const passwordErrorMessage = validatePassword(password);
  const passwordIsValid = passwordErrorMessage == null;
  const confirmPasswordErrorMessage =
    password === confirmPassword
      ? null
      : "Ο κωδικός πρέπει να είναι ίδιος με τον κωδικό πρόσβασης που πληκτρολογήσατε";
  const confirmPasswordIsValid = confirmPasswordErrorMessage == null;

  const formIsValid =
    nameIsValid &&
    surnameIsValid &&
    storeNameIsValid &&
    siteUrlIsValid &&
    vatIsValid &&
    doyIsValid &&
    emailIsValid &&
    phoneIsValid &&
    passwordIsValid &&
    confirmPasswordIsValid;

  const submitHandler = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!formIsValid) return;
    (window as any).grecaptcha.ready(() => {
      (window as any).grecaptcha
        .execute(process.env.REACT_APP_RECAPTCHA_KEY, {
          action: "register",
        })
        .then((token: string) => {
          onSubmit(
            name.trim(),
            surname.trim(),
            storeName.trim(),
            vat.trim(),
            doy.trim(),
            email.trim(),
            phone.trim(),
            password.trim(),
            siteUrl && siteUrl.trim() !== "" ? siteUrl.trim() : null,
            token
          );
        })
        .catch((error: any) => {
          return;
        });
    });
  };

  const nameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (nameError !== "") setNameError("");
    setName(event.target.value);
  };

  const nameBlurHandler = () => {
    if (!nameIsValid) {
      setNameError(nameErrorMessage);
    } else {
      setNameError("");
    }
  };

  const surnameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (surnameError !== "") setSurnameError("");
    setSurname(event.target.value);
  };

  const surnameBlurHandler = () => {
    if (!surnameIsValid) {
      setSurnameError(surnameErrorMessage);
    } else {
      setSurnameError("");
    }
  };

  const storeNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (storeNameError !== "") setStoreNameError("");
    setStoreName(event.target.value);
  };

  const storeNameBlurHandler = () => {
    if (!storeNameIsValid) {
      setStoreNameError(storeNameErrorMessage);
    } else {
      setStoreNameError("");
    }
  };

  const siteUrlChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (siteUrlError !== "") setSiteUrlError("");
    setSiteUrl(event.target.value);
  };

  const siteUrlBlurHandler = () => {
    if (!siteUrlIsValid && siteUrlErrorMessage) {
      setSiteUrlError(siteUrlErrorMessage);
    } else {
      setSiteUrlError("");
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

  const doyChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (doyError !== "") setDoyError("");
    setDoy(event.target.value);
  };

  const doyBlurHandler = () => {
    if (!doyIsValid) {
      setDoyError(doyErrorMessage);
    } else {
      setDoyError("");
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

  const phoneChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (phoneError !== "") setPhoneError("");
    setPhone(event.target.value);
  };

  const phoneBlurHandler = () => {
    if (!phoneIsValid) {
      setPhoneError(phoneErrorMessage);
    } else {
      setPhoneError("");
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

  const confirmPasswordChangeHandler = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    if (confirmPasswordError !== "") setConfirmPasswordError("");
    setConfirmPassword(event.target.value);
  };

  const confirmPasswordBlurHandler = () => {
    if (!confirmPasswordIsValid) {
      setConfirmPasswordError(confirmPasswordErrorMessage);
    } else {
      setConfirmPasswordError("");
    }
  };

  return (
    <div className={classNames(styles["form-container"])}>
      <form onSubmit={submitHandler} className={classNames(styles["form"])}>
        {/* Form Header */}
        <h2 className={classNames(styles["form_title"])}>
          Δημιουργία Λογαριασμού
        </h2>
        {error && error.toString().trim() && (
          <p className={classNames(styles["form_error"])}>{error}</p>
        )}

        {/* Personal info */}
        <h3 className={classNames(styles["form_subtitle"])}>
          Προσωπικά Στοιχεία
        </h3>

        <div className={classNames(styles["form_two_fields"])}>
          {/* Name input */}
          <div className={classNames(styles["form_field"])}>
            <label htmlFor="name-input">Όνομα *</label>
            <div className={classNames(styles["form_field_input"])}>
              <input
                id="name-input"
                type="text"
                placeholder="Όνομα"
                disabled={isLoading}
                value={name}
                onChange={nameChangeHandler}
                onBlur={nameBlurHandler}
                required
                aria-required
              />
            </div>
            {nameError && nameError.trim() !== "" && (
              <p className={classNames(styles["form_field_error"])}>
                {nameError}
              </p>
            )}
          </div>
          {/* Surname input */}
          <div className={classNames(styles["form_field"])}>
            <label htmlFor="surname-input">Επώνυμο *</label>
            <div className={classNames(styles["form_field_input"])}>
              <input
                id="surname-input"
                type="text"
                placeholder="Επώνυμο"
                disabled={isLoading}
                value={surname}
                onChange={surnameChangeHandler}
                onBlur={surnameBlurHandler}
                required
                aria-required
              />
            </div>
            {surnameError && surnameError.trim() !== "" && (
              <p className={classNames(styles["form_field_error"])}>
                {surnameError}
              </p>
            )}
          </div>
        </div>

        {/* Phone input */}
        <div className={classNames(styles["form_field"])}>
          <label htmlFor="phone-input">Τηλέφωνο Επικοινωνίας *</label>
          <div className={classNames(styles["form_field_input"])}>
            <input
              id="phone-input"
              type="number"
              placeholder="Σταθερό ή κινητό τηλέφωνο (10 ψηφία)"
              disabled={isLoading}
              value={phone}
              onChange={phoneChangeHandler}
              onBlur={phoneBlurHandler}
              required
              aria-required
            />
          </div>
          {phoneError && phoneError.trim() !== "" && (
            <p className={classNames(styles["form_field_error"])}>
              {phoneError}
            </p>
          )}
        </div>

        {/* Email input */}
        <div className={classNames(styles["form_field"])}>
          <label htmlFor="email-input">Διεύθυνση email *</label>
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

        {/* Store Info */}
        <h3 className={classNames(styles["form_subtitle"])}>
          Στοιχεία Καταστήματος
        </h3>

        {/* Store Name input */}
        <div className={classNames(styles["form_field"])}>
          <label htmlFor="store-name-input">Όνομα Καταστήματος *</label>
          <div className={classNames(styles["form_field_input"])}>
            <input
              id="store-name-input"
              type="text"
              placeholder="π.χ. Κατάστημα"
              disabled={isLoading}
              value={storeName}
              onChange={storeNameChangeHandler}
              onBlur={storeNameBlurHandler}
              required
              aria-required
            />
          </div>
          {storeNameError && storeNameError.trim() !== "" && (
            <p className={classNames(styles["form_field_error"])}>
              {storeNameError}
            </p>
          )}
        </div>

        {/* Store Site URL input */}
        <div className={classNames(styles["form_field"])}>
          <label htmlFor="site-url-input">
            Ιστότοπος ή Σελίδα Καταστήματος
          </label>
          <div className={classNames(styles["form_field_input"])}>
            <input
              id="site-url-input"
              type="text"
              placeholder="https://www.mysite.gr ή Instagram, Facebook..."
              disabled={isLoading}
              value={siteUrl}
              onChange={siteUrlChangeHandler}
              onBlur={siteUrlBlurHandler}
              required={false}
              aria-required={false}
            />
          </div>
          {siteUrlError && siteUrlError.trim() !== "" && (
            <p className={classNames(styles["form_field_error"])}>
              {siteUrlError}
            </p>
          )}
        </div>

        <div className={classNames(styles["form_two_fields"])}>
          {/* VAT input */}
          <div className={classNames(styles["form_field"])}>
            <label htmlFor="vat-input">Α.Φ.Μ. *</label>
            <div className={classNames(styles["form_field_input"])}>
              <input
                id="vat-input"
                type="number"
                placeholder="Αριθμός Φορολογικού Μητρώου (9 ψηφία)"
                disabled={isLoading}
                value={vat}
                onChange={vatChangeHandler}
                onBlur={vatBlurHandler}
                required
                aria-required
              />
            </div>
            {vatError && vatError.trim() !== "" && (
              <p className={classNames(styles["form_field_error"])}>
                {vatError}
              </p>
            )}
          </div>
          {/* DOY input */}
          <div className={classNames(styles["form_field"])}>
            <label htmlFor="doy-input">Δ.Ο.Υ. *</label>
            <div className={classNames(styles["form_field_input"])}>
              <input
                id="doy-input"
                type="text"
                list="doys"
                placeholder="Δημόσια Οικονομική Υπηρεσία"
                disabled={isLoading}
                value={doy}
                onChange={doyChangeHandler}
                onBlur={doyBlurHandler}
                required
                aria-required
              />

              <datalist id="doys">
                {sortedDoys.map((doyName, idx) => (
                  <option key={`doy-${idx}`}>{doyName}</option>
                ))}
              </datalist>
            </div>
            {doyError && doyError.trim() !== "" && (
              <p className={classNames(styles["form_field_error"])}>
                {doyError}
              </p>
            )}
          </div>
        </div>

        {/* Password */}
        <h3 className={classNames(styles["form_subtitle"])}>
          Κωδικός Πρόσβασης
        </h3>

        <div className={classNames(styles["form_two_fields"])}>
          {/* Password input */}
          <div className={classNames(styles["form_field"])}>
            <label htmlFor="password-input">Εισαγωγή *</label>
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

          {/* Confirm Password input */}
          <div className={classNames(styles["form_field"])}>
            <label htmlFor="confirm-password-input">Επιβεβαίωση *</label>
            <div className={classNames(styles["form_field_input_password"])}>
              <input
                id="confirm-password-input"
                type={confirmPasswordDisplay ? "text" : "password"}
                placeholder="Εισάγετε ξανά τον κωδικό πρόσβασης"
                disabled={isLoading}
                value={confirmPassword}
                onChange={confirmPasswordChangeHandler}
                onBlur={confirmPasswordBlurHandler}
                required
                aria-required
              />
              <span
                className={classNames(styles["form_field_input_password_icon"])}
                onClick={() => setConfirmPasswordDisplay((prev) => !prev)}
              >
                {confirmPasswordDisplay ? (
                  <AiFillEyeInvisible />
                ) : (
                  <AiFillEye />
                )}
              </span>
            </div>
            {confirmPasswordError && confirmPasswordError.trim() !== "" && (
              <p className={classNames(styles["form_field_error"])}>
                {confirmPasswordError}
              </p>
            )}
          </div>
        </div>
        <button
          type="submit"
          className={classNames(styles["form_submit_btn"])}
          disabled={!formIsValid || isLoading}
        >
          ΕΓΓΡΑΦΗ
        </button>
        <small className={classNames(styles["form_recaptcha_container"])}>
          This site is protected by reCAPTCHA and the Google{" "}
          <a href="https://policies.google.com/privacy">Privacy Policy</a> and{" "}
          <a href="https://policies.google.com/terms">Terms of Service</a>{" "}
          apply.
        </small>
        <Link to="/login" className={classNames(styles["form_redirect_links"])}>
          Έχετε λογαριασμό; Πατήστε εδώ για να συνδεθείτε
        </Link>
      </form>
    </div>
  );
};

export default RegisterForm;
