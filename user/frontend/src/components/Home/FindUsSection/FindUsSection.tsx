import { FC, useRef, useState, useEffect } from "react";
import classNames from "classnames";
import { Link } from "react-router-dom";

import { useIntersectionObserver } from "../../../hooks";

import styles from "./FindUsSection.module.css";

const FindUsSection: FC = () => {
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
      id="find-us"
      ref={sectionRef}
      className={classNames(styles["find-us-section"], "section-padding")}
    >
      <h2
        className={classNames(
          "header-base",
          "hidden-bottom",
          "delay-500",
          appearedOnce && "show"
        )}
      >
        ΠΟΥ ΘΑ ΒΡΕΙΤΕ ΤΙΣ ΚΡΕΠΕΣ ΜΑΣ
      </h2>
      <p
        className={classNames(
          "text-base",
          "hidden-bottom",
          "delay-750",
          appearedOnce && "show"
        )}
      >
        Σας περιμένουμε στο κατάστημά μας στην Αθήνα, για να σας φιλοξενήσουμε
        στο χώρο μας και να μοιραστούμε μαζί σας τις γεύσεις μας. Μπορείτε να
        βρείτε την τοποθεσία και το ωράριο λειτουργίας μας στο κάτω μέρος της
        σελίδας!
        <br />
        Μπορείτε επίσης να βρείτε τις αυθεντικές μας γεύσεις σε όλα τα
        συνεργαζόμενα καταστήματα, τα οποία προμηθεύουμε με τις συνταγές μας και
        με την απαραίτητη κατάρτιση, ώστε να απολαμβάνετε τις αγαπημένες σας
        γεύσεις όπου και αν βρίσκεστε.
      </p>
      <div className={classNames(styles["find-us-section_actions"])}>
        <Link
          className={classNames(styles["find-us-section_btn"], "btn-primary")}
          to="register"
        >
          ΓΙΝΕ ΣΥΝΕΡΓΑΤΗΣ
        </Link>
        <a
          className={classNames(styles["find-us-section_btn"], "btn-secondary")}
          href="#partners"
        >
          ΠΡΟΒΟΛΗ ΣΥΝΕΡΓΑΤΩΝ
        </a>
      </div>
    </section>
  );
};

export default FindUsSection;
