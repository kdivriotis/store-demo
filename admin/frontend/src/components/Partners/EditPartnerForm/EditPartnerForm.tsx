import {
  FC,
  useEffect,
  useState,
  useMemo,
  ChangeEvent,
  FormEvent,
} from "react";

import { PartnerDetails } from "../../../interfaces/Partner";

import {
  validateText,
  validateEmail,
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

import styles from "./EditPartnerForm.module.css";

interface ChangedDetails {
  name: string | undefined;
  surname: string | undefined;
  storeName: string | undefined;
  siteUrl: string | undefined;
  vat: string | undefined;
  doy: string | undefined;
  email: string | undefined;
  phone: string | undefined;
}

interface EditPartnerFormProps {
  partner: PartnerDetails;
  isLoading: boolean;
  error: string | null;
  onSubmit: (newProfile: ChangedDetails) => void;
}

const EditPartnerForm: FC<EditPartnerFormProps> = ({
  partner,
  isLoading,
  error,
  onSubmit,
}) => {
  const sortedDoys = useMemo(
    () => doys.slice().sort((a, b) => a.localeCompare(b)),
    []
  );

  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [storeName, setStoreName] = useState<string>("");
  const [siteUrl, setSiteUrl] = useState<string>("");
  const [vat, setVat] = useState<string>("");
  const [doy, setDoy] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  const [nameError, setNameError] = useState<string>("");
  const [surnameError, setSurnameError] = useState<string>("");
  const [storeNameError, setStoreNameError] = useState<string>("");
  const [siteUrlError, setSiteUrlError] = useState<string>("");
  const [vatError, setVatError] = useState<string>("");
  const [doyError, setDoyError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string>("");

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

  const formIsValid =
    nameIsValid &&
    surnameIsValid &&
    storeNameIsValid &&
    siteUrlIsValid &&
    vatIsValid &&
    doyIsValid &&
    emailIsValid &&
    phoneIsValid;

  // Check which field(s) have changed
  const changedName = name.trim() !== partner.name ? name.trim() : undefined;
  const changedSurname =
    surname.trim() !== partner.surname ? surname.trim() : undefined;
  const changedStoreName =
    storeName.trim() !== partner.storeName ? storeName.trim() : undefined;
  const changedSiteUrl =
    siteUrl && siteUrl.trim() !== partner.siteUrl ? siteUrl.trim() : undefined;
  const changedVat = vat.trim() !== partner.vat ? vat.trim() : undefined;
  const changedDoy = doy.trim() !== partner.doy ? doy.trim() : undefined;
  const changedEmail =
    email.trim() !== partner.email ? email.trim() : undefined;
  const changedPhone =
    phone.trim() !== partner.phone ? phone.trim() : undefined;

  const formIsChanged = !(
    !changedName &&
    !changedSurname &&
    !changedStoreName &&
    !changedSiteUrl &&
    !changedVat &&
    !changedDoy &&
    !changedEmail &&
    !changedPhone
  );

  useEffect(() => {
    setName(partner.name);
    setSurname(partner.surname);
    setStoreName(partner.storeName);
    setSiteUrl(partner.siteUrl);
    setVat(partner.vat);
    setDoy(partner.doy);
    setEmail(partner.email);
    setPhone(partner.phone);
  }, [partner]);

  const nameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (nameError !== "") setNameError("");
    setName(event.target.value);
  };

  const nameBlurHandler = () => {
    if (!nameIsValid && nameErrorMessage) {
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
    if (!surnameIsValid && surnameErrorMessage) {
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
    if (!storeNameIsValid && storeNameErrorMessage) {
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
    if (!vatIsValid && vatErrorMessage) {
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
    if (!doyIsValid && doyErrorMessage) {
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
    if (!emailIsValid && emailErrorMessage) {
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
    if (!phoneIsValid && phoneErrorMessage) {
      setPhoneError(phoneErrorMessage);
    } else {
      setPhoneError("");
    }
  };

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formIsValid || !formIsChanged) return;

    const newProfile = {
      name: changedName,
      surname: changedSurname,
      storeName: changedStoreName,
      siteUrl: changedSiteUrl,
      vat: changedVat,
      doy: changedDoy,
      email: changedEmail,
      phone: changedPhone,
    };
    onSubmit(newProfile);
  };

  return (
    <form className={styles["form_container"]} onSubmit={submitHandler}>
      {/* Name input */}
      <div className={styles["form_field"]}>
        <label htmlFor="name-input">Όνομα</label>
        <div
          className={
            isLoading
              ? styles["form_field_input-disabled"]
              : styles["form_field_input"]
          }
        >
          <input
            id="name-input"
            type="text"
            placeholder="Όνομα Συνεργάτη"
            disabled={isLoading}
            value={name}
            onChange={nameChangeHandler}
            onBlur={nameBlurHandler}
            required
            aria-required
          />
        </div>
        {nameError && nameError.trim() !== "" && (
          <p className={styles["form_field_error"]}>{nameError}</p>
        )}
      </div>

      {/* Surname input */}
      <div className={styles["form_field"]}>
        <label htmlFor="surname-input">Επώνυμο</label>
        <div
          className={
            isLoading
              ? styles["form_field_input-disabled"]
              : styles["form_field_input"]
          }
        >
          <input
            id="surname-input"
            type="text"
            placeholder="Επώνυμο Συνεργάτη"
            disabled={isLoading}
            value={surname}
            onChange={surnameChangeHandler}
            onBlur={surnameBlurHandler}
            required
            aria-required
          />
        </div>
        {surnameError && surnameError.trim() !== "" && (
          <p className={styles["form_field_error"]}>{surnameError}</p>
        )}
      </div>

      {/* Phone input */}
      <div className={styles["form_field"]}>
        <label htmlFor="phone-input">Τηλέφωνο Επικοινωνίας</label>
        <div
          className={
            isLoading
              ? styles["form_field_input-disabled"]
              : styles["form_field_input"]
          }
        >
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
          <p className={styles["form_field_error"]}>{phoneError}</p>
        )}
      </div>

      {/* Email input */}
      <div className={styles["form_field"]}>
        <label htmlFor="email-input">Διεύθυνση email</label>
        <div
          className={
            isLoading
              ? styles["form_field_input-disabled"]
              : styles["form_field_input"]
          }
        >
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
          <p className={styles["form_field_error"]}>{emailError}</p>
        )}
      </div>

      {/* Store name input */}
      <div className={styles["form_field"]}>
        <label htmlFor="store-name-input">Όνομα Καταστήματος</label>
        <div
          className={
            isLoading
              ? styles["form_field_input-disabled"]
              : styles["form_field_input"]
          }
        >
          <input
            id="store-name-input"
            type="text"
            placeholder="Όνομα Καταστήματος Συνεργάτη"
            disabled={isLoading}
            value={storeName}
            onChange={storeNameChangeHandler}
            onBlur={storeNameBlurHandler}
            required
            aria-required
          />
        </div>
        {storeNameError && storeNameError.trim() !== "" && (
          <p className={styles["form_field_error"]}>{storeNameError}</p>
        )}
      </div>

      {/* Store Site URL input */}
      <div className={styles["form_field"]}>
        <label htmlFor="site-url-input">Ιστότοπος ή Σελίδα Καταστήματος</label>
        <div
          className={
            isLoading
              ? styles["form_field_input-disabled"]
              : styles["form_field_input"]
          }
        >
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
          <p className={styles["form_field_error"]}>{siteUrlError}</p>
        )}
      </div>

      {/* VAT input */}
      <div className={styles["form_field"]}>
        <label htmlFor="vat-input">Α.Φ.Μ.</label>
        <div
          className={
            isLoading
              ? styles["form_field_input-disabled"]
              : styles["form_field_input"]
          }
        >
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
          <p className={styles["form_field_error"]}>{vatError}</p>
        )}
      </div>

      {/* DOY input */}
      <div className={styles["form_field"]}>
        <label htmlFor="doy-input">Δ.Ο.Υ.</label>
        <div
          className={
            isLoading
              ? styles["form_field_input-disabled"]
              : styles["form_field_input"]
          }
        >
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
          <p className={styles["form_field_error"]}>{doyError}</p>
        )}
      </div>

      <div className={styles["form_btn_container"]}>
        <button
          className={styles["form_preview_btn"]}
          type="submit"
          disabled={isLoading || !formIsValid || !formIsChanged}
        >
          Αποθήκευση Αλλαγών
        </button>
      </div>
      {error && error.trim() !== "" && (
        <p className={styles["form_error"]}>{error}</p>
      )}
    </form>
  );
};

export default EditPartnerForm;
