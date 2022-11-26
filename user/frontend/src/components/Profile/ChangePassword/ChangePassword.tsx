import { FC, useContext, useState, ChangeEvent, FormEvent } from "react";
import { RiLockPasswordFill } from "react-icons/ri";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import classNames from "classnames";

import { useHttp } from "../../../hooks";

import { AuthContext } from "../../../context";
import { AuthContextType } from "../../../interfaces/AuthContext";
import { validatePassword } from "../../../utils/input";

import styles from "./ChangePassword.module.css";

interface ApiResponse {
  message: string;
}

const ChangePassword: FC = () => {
  const { auth } = useContext(AuthContext) as AuthContextType;
  const { isLoading, error, sendRequest } = useHttp();
  const [message, setMessage] = useState<string>("");

  const [oldPassword, setOldPassword] = useState<string>("");
  const [oldPasswordDisplay, setOldPasswordDisplay] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [passwordDisplay, setPasswordDisplay] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [confirmPasswordDisplay, setConfirmPasswordDisplay] =
    useState<boolean>(false);

  const [oldPasswordError, setOldPasswordError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");

  const oldPasswordErrorMessage = validatePassword(oldPassword);
  const oldPasswordIsValid = oldPasswordErrorMessage == null;
  let passwordErrorMessage = validatePassword(password);
  if (!passwordErrorMessage) {
    passwordErrorMessage =
      password === oldPassword
        ? "Ο νέος κωδικός πρέπει να είναι διαφορετικός από τον παλιό"
        : null;
  }
  const passwordIsValid = passwordErrorMessage == null;
  const confirmPasswordErrorMessage =
    password === confirmPassword
      ? null
      : "Ο κωδικός πρέπει να είναι ίδιος με τον κωδικό πρόσβασης που πληκτρολογήσατε";
  const confirmPasswordIsValid = confirmPasswordErrorMessage == null;

  const formIsValid =
    oldPasswordIsValid && passwordIsValid && confirmPasswordIsValid;

  const submitHandler = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!formIsValid) return;

    // transform API response
    const transformResponse = (response: ApiResponse) => {
      setMessage(response.message);
      // reset all state
      setOldPassword("");
      setPassword("");
      setConfirmPassword("");
      setOldPasswordError("");
      setPasswordError("");
      setConfirmPasswordError("");
    };

    // send PATCH request to API's route /partner/change-password
    const url = `${process.env.REACT_APP_API_URL}/partner/change-password`;
    sendRequest(
      {
        url,
        method: "PATCH",
        token: auth.token,
        data: { oldPassword, password },
      },
      transformResponse
    );
  };

  const oldPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (oldPasswordError !== "") setOldPasswordError("");
    setOldPassword(event.target.value);
  };

  const oldPasswordBlurHandler = () => {
    if (!oldPasswordIsValid) {
      setOldPasswordError(oldPasswordErrorMessage);
    } else {
      setOldPasswordError("");
    }
  };

  const passwordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (passwordError !== "") setPasswordError("");
    setPassword(event.target.value);
  };

  const passwordBlurHandler = () => {
    if (!passwordIsValid && passwordErrorMessage) {
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
    <form
      onSubmit={submitHandler}
      className={classNames(styles["form_container"])}
    >
      {/* Header */}
      <h2 className={classNames(styles["form_title"])}>
        Αλλαγή Κωδικού Πρόσβασης
      </h2>
      {error && error.toString().trim() !== "" && (
        <p className={classNames(styles["form_error"])}>{error}</p>
      )}
      {!error && message && message.trim() !== "" && (
        <p className={classNames(styles["form_message"])}>{message}</p>
      )}

      {/* Old Password */}
      <div className={classNames(styles["form_field"])}>
        <label
          htmlFor="old-password-input"
          className={classNames(styles["form_field_description"])}
        >
          Τρέχων Κωδικός Πρόσβασης
        </label>
        <div className={classNames(styles["form_field_value"])}>
          <span className={classNames(styles["form_field_value_icon"])}>
            <RiLockPasswordFill />
          </span>
          <div className={classNames(styles["form_field_value_input"])}>
            <input
              id="old-password-input"
              type={oldPasswordDisplay ? "text" : "password"}
              placeholder="Εισαγωγή τρέχοντα κωδικού"
              disabled={isLoading}
              value={oldPassword}
              onChange={oldPasswordChangeHandler}
              onBlur={oldPasswordBlurHandler}
              required
              aria-required
            />
            <span
              className={classNames(styles["form_field_value_input_icon"])}
              onClick={() => setOldPasswordDisplay((prev) => !prev)}
            >
              {oldPasswordDisplay ? <AiFillEyeInvisible /> : <AiFillEye />}
            </span>
          </div>
        </div>
        {oldPasswordError && oldPasswordError.trim() !== "" && (
          <p className={classNames(styles["form_field_error"])}>
            {oldPasswordError}
          </p>
        )}
      </div>

      {/* New Password */}
      <div className={classNames(styles["form_field"])}>
        <label
          htmlFor="password-input"
          className={classNames(styles["form_field_description"])}
        >
          Νέος Κωδικός Πρόσβασης
        </label>
        <div className={classNames(styles["form_field_value"])}>
          <span className={classNames(styles["form_field_value_icon"])}>
            <RiLockPasswordFill />
          </span>
          <div className={classNames(styles["form_field_value_input"])}>
            <input
              id="password-input"
              type={passwordDisplay ? "text" : "password"}
              placeholder="Εισαγωγή νέου κωδικού"
              disabled={isLoading}
              value={password}
              onChange={passwordChangeHandler}
              onBlur={passwordBlurHandler}
              required
              aria-required
            />
            <span
              className={classNames(styles["form_field_value_input_icon"])}
              onClick={() => setPasswordDisplay((prev) => !prev)}
            >
              {passwordDisplay ? <AiFillEyeInvisible /> : <AiFillEye />}
            </span>
          </div>
        </div>
        {passwordError && passwordError.trim() !== "" && (
          <p className={classNames(styles["form_field_error"])}>
            {passwordError}
          </p>
        )}
      </div>

      {/* Confirm New Password */}
      <div className={classNames(styles["form_field"])}>
        <label
          htmlFor="confirm-password-input"
          className={classNames(styles["form_field_description"])}
        >
          Επιβεβαίωση Κωδικού
        </label>
        <div className={classNames(styles["form_field_value"])}>
          <span className={classNames(styles["form_field_value_icon"])}>
            <RiLockPasswordFill />
          </span>
          <div className={classNames(styles["form_field_value_input"])}>
            <input
              id="confirm-password-input"
              type={confirmPasswordDisplay ? "text" : "password"}
              placeholder="Επιβεβαίωση κωδικού"
              disabled={isLoading}
              value={confirmPassword}
              onChange={confirmPasswordChangeHandler}
              onBlur={confirmPasswordBlurHandler}
              required
              aria-required
            />
            <span
              className={classNames(styles["form_field_value_input_icon"])}
              onClick={() => setConfirmPasswordDisplay((prev) => !prev)}
            >
              {confirmPasswordDisplay ? <AiFillEyeInvisible /> : <AiFillEye />}
            </span>
          </div>
        </div>
        {confirmPasswordError && confirmPasswordError.trim() !== "" && (
          <p className={classNames(styles["form_field_error"])}>
            {confirmPasswordError}
          </p>
        )}
      </div>

      <button
        type="submit"
        className={classNames(styles["form_submit_btn"])}
        disabled={!formIsValid || isLoading}
      >
        ΑΛΛΑΓΗ ΚΩΔΙΚΟΥ
      </button>
    </form>
  );
};

export default ChangePassword;
