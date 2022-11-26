import { FC, useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";

import { useIntersectionObserver } from "../../../hooks";

import styles from "./WelcomeSection.module.css";

const WelcomeSection: FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const isVisible = useIntersectionObserver(sectionRef, {
    root: null,
    rootMargin: "0px",
    threshold: 0.5,
  });

  const [appearedOnce, setAppearedOnce] = useState<boolean>(false);
  useEffect(() => {
    if (isVisible && !appearedOnce) setAppearedOnce(true);
  }, [isVisible]);

  return (
    <section
      id="welcome"
      ref={sectionRef}
      className={classNames(styles["welcome-section"], "section-padding")}
    >
      <div className={classNames(styles["welcome-section_info"])}>
        <div
          className={classNames(
            "hidden-left",
            "delay-750",
            appearedOnce && "show"
          )}
        >
          <h2 className="header-base">ΚΑΛΩΣ ΗΡΘΑΤΕ ΣΤO STORE DEMO</h2>
          <hr className="primary-divider" />
        </div>
        <p
          className={classNames(
            "text-base",
            "hidden-left",
            "delay-1000",
            appearedOnce && "show"
          )}
        >
          Η αγάπη μας για τις κρέπες χωράει σε κάθε ώρα της ημέρας, είτε αλμυρές
          για ένα νόστιμο γεύμα ή πρωινό, είτε γλυκές για το επιδόρπιο. Από
          μυστικά που περνούν από γενιά σε γενιά, φτιάχνουμε με πολλή αγάπη και
          μεράκι τις νοστιμότερες κρέπες στην Αττική.
        </p>
        <Link
          className={classNames(styles["welcome-section_info_btn"])}
          to="/about"
        >
          ΜΑΘΕΤΕ ΠΕΡΙΣΣΟΤΕΡΑ ΓΙΑ ΕΜΑΣ
        </Link>
      </div>
      <div className={classNames(styles["welcome-section_video"])}>
        <div className={classNames(styles["welcome-section_video_wrapper"])}>
          <iframe
            width="853"
            height="480"
            src="https://www.youtube.com/embed/k0c4zbEcz0s"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
