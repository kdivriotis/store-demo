import { FC } from "react";
import classNames from "classnames";
import { Link } from "react-router-dom";
import { FiFacebook, FiTwitter, FiInstagram } from "react-icons/fi";
import { AiFillFacebook, AiFillInstagram } from "react-icons/ai";
import { SiTiktok } from "react-icons/si";

import styles from "./Footer.module.css";

const Footer: FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="footer"
      className={classNames(styles["footer-section"], "section-padding")}
    >
      <div className={classNames(styles["footer-section_links"])}>
        <div className={classNames(styles["footer-section_links_contact"])}>
          <h1 className={classNames(styles["footer-section_headtext"])}>
            Επικοινωνήστε μαζί μας
          </h1>
          <p className="text-alt">
            {process.env.REACT_APP_COMMUNICATION_ADDRESS}
          </p>
          <p className="text-alt">
            {process.env.REACT_APP_COMMUNICATION_PHONE}
          </p>
          <p className="text-alt">
            {process.env.REACT_APP_COMMUNICATION_EMAIL}
          </p>
        </div>
        <div className={classNames(styles["footer-section_links_social"])}>
          <h1 className={classNames(styles["footer-section_headtext"])}>
            Ακολουθήστε μας στα Social Media
          </h1>
          <div
            className={classNames(styles["footer-section_links_social_icons"])}
          >
            <a
              href="https://www.facebook.com/"
              className={classNames(
                styles["footer-section_links_social_icons_link"]
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              <AiFillFacebook />
            </a>
            <a
              href="https://www.instagram.com/"
              className={classNames(
                styles["footer-section_links_social_icons_link"]
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              <AiFillInstagram />
            </a>
            <a
              href="https://www.tiktok.com/"
              className={classNames(
                styles["footer-section_links_social_icons_link"]
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              <SiTiktok />
            </a>
          </div>
        </div>

        <div className={classNames(styles["footer-section_links_work"])}>
          <h1 className={classNames(styles["footer-section_headtext"])}>
            Ωράριο Λειτουργίας
          </h1>
          <p className="text-alt">Δευτέρα-Σάββατο:</p>
          <p className="text-alt">08:00-16:00</p>
          <p className="text-alt">Κυριακή:</p>
          <p className="text-alt">Κλειστά</p>
        </div>
      </div>

      <div className="footer-section_copyright">
        <p className="text-alt">
          Copyright &copy; {currentYear} Konstantinos Divriotis. All Rights
          Reserved.
        </p>
      </div>
      <div className={classNames(styles["footer-section_logo"])}>
        <img src="/images/logo.png" alt="Σήμα (logo) Store Demo" />
      </div>
      <div className="footer-section_copyright">
        <p className="text-alt">
          ΠΡΟΣΟΧΗ: Το παρόν site υπάρχει αποκλειστικά για δοκιμαστικούς λόγους.
          Οι παραγγελίες είναι εικονικές, καθώς και τα προϊόντα που φαίνονται
          στη σελίδα μας. Δεν πραγματοποιούνται πληρωμές και συναλλαγές.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
