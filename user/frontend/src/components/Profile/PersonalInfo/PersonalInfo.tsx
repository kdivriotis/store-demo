import { FC } from "react";
import { FaUser, FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import classNames from "classnames";

import { useProfile } from "../../../pages/Profile/Profile";

import styles from "./PersonalInfo.module.css";

const PersonalInfo: FC = () => {
  const { profile, isLoading, error } = useProfile();

  return (
    <div className={classNames(styles["info_container"])}>
      {/* Header */}
      <h2 className={classNames(styles["info_title"])}>
        Προσωπικές Πληροφορίες
      </h2>
      {error && error.toString().trim() !== "" && (
        <p className={classNames(styles["info_error"])}>{error}</p>
      )}

      {/* Full Name */}
      <div className={classNames(styles["info_field"])}>
        <p className={classNames(styles["info_field_description"])}>
          Ονοματεπώνυμο
        </p>
        <div className={classNames(styles["info_field_value"])}>
          <span className={classNames(styles["info_field_value_icon"])}>
            <FaUser />
          </span>
          <p className={isLoading ? "pulse" : ""}>
            {profile?.name || "-"} {profile?.surname}
          </p>
        </div>
      </div>

      {/* Phone */}
      <div className={classNames(styles["info_field"])}>
        <p className={classNames(styles["info_field_description"])}>
          Τηλέφωνο Επικοινωνίας
        </p>
        <div className={classNames(styles["info_field_value"])}>
          <span className={classNames(styles["info_field_value_icon"])}>
            <FaPhoneAlt />
          </span>
          <p className={isLoading ? "pulse" : ""}>{profile?.phone || "-"}</p>
        </div>
      </div>

      {/* Email */}
      <div className={classNames(styles["info_field"])}>
        <p className={classNames(styles["info_field_description"])}>
          Διεύθυνση Ηλεκτρονικού Ταχυδρομείου
        </p>
        <div className={classNames(styles["info_field_value"])}>
          <span className={classNames(styles["info_field_value_icon"])}>
            <MdEmail />
          </span>
          <p className={isLoading ? "pulse" : ""}>{profile?.email || "-"}</p>
        </div>
        <p className={classNames(styles["info_field_status"])}>
          {profile?.emailVerified ? "Επιβεβαιωμένη" : "Μη Επιβεβαιωμένη"}
        </p>
      </div>
    </div>
  );
};

export default PersonalInfo;
