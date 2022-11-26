import { FC } from "react";
import classNames from "classnames";

import styles from "./FindUsSection.module.css";

const FindUsSection: FC = () => {
  return (
    <section
      className={classNames(styles["find-us-section"], "section-padding")}
    >
      <div className={classNames(styles["find-us-section_info"])}>
        <div>
          <h2 className={classNames(styles["find-us-section_title"])}>
            Βρείτε μας
          </h2>
          <hr className="primary-divider" />
        </div>
        <div>
          <p className={classNames(styles["find-us-section_subtitle"])}>
            Διεύθυνση
          </p>
          <p className={classNames(styles["find-us-section_text"])}>
            {process.env.REACT_APP_COMMUNICATION_ADDRESS}
          </p>
          <p className={classNames(styles["find-us-section_subtitle"])}>
            Τηλέφωνο Επικοινωνίας
          </p>
          <p className={classNames(styles["find-us-section_text"])}>
            {process.env.REACT_APP_COMMUNICATION_PHONE}
          </p>
          <p className={classNames(styles["find-us-section_subtitle"])}>
            Ωράριο Λειτουργίας
          </p>
          <p className={classNames(styles["find-us-section_text"])}>
            Δευτέρα-Σάββατο: 08:00-16:00
          </p>
          <p className={classNames(styles["find-us-section_text"])}>
            Κυριακή: Κλειστά
          </p>
          <button
            className={classNames(styles["find-us-section_info_btn"])}
            onClick={() =>
              window.open(
                "https://www.google.com/maps/@37.9639987,23.6323673,15z?hl=el-GR",
                "_blank",
                "noopener,noreferrer"
              )
            }
          >
            ΠΡΟΒΟΛΗ ΧΑΡΤΗ
          </button>
        </div>
      </div>

      <div className={classNames(styles["find-us-section_map"])}>
        <div className={classNames(styles["find-us-section_map_wrapper"])}>
          <iframe
            title="Google Maps Pin"
            className={classNames(styles["find-us-section_map_canvas"])}
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d75387.7276177307!2d23.688512644268826!3d37.984024409014154!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14a1bd1f067043f1%3A0x2736354576668ddd!2zzpHOuM6uzr3OsQ!5e0!3m2!1sel!2sgr!4v1669331162408!5m2!1sel!2sgr"
            scrolling="no"
          ></iframe>
          <a href="https://www.whatismyip-address.com/divi-discount/">
            divi discount
          </a>
          <br />
          <a href="https://www.embedgooglemap.net">embedgooglemap.net</a>
        </div>
      </div>
    </section>
  );
};

export default FindUsSection;
