import { FC, useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";

import { useIntersectionObserver } from "../../../hooks";

import styles from "./MenuSection.module.css";

const MenuSection: FC = () => {
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
      id="menu"
      ref={sectionRef}
      className={classNames(styles["menu-section"], "section-padding")}
    >
      <div className={classNames(styles["menu-section_info"])}>
        <div
          className={classNames(
            "hidden-left",
            "delay-750",
            appearedOnce && "show"
          )}
        >
          <h2 className="header-base">ΚΑΤΑΛΟΓΟΣ</h2>
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
          Με πάνω από 50 κρέπες, προσφέρουμε μια μεγάλη ποικιλία επιλογών που θα
          συνοδεύσουν τη μέρα σας. Γλυκές και αλμυρές κρέπες, με ποικιλία
          πραλινών, τυριών, αλλαντικών και συνοδευτικών, προϊόντα ειδικά για
          χορτοφάγους και οτιδήποτε άλλο ταιριάζει με το δικό σας γούστο!
        </p>
        <Link
          className={classNames(styles["menu-section_info_btn"])}
          to="/menu"
        >
          ΠΡΟΒΟΛΗ ΚΑΤΑΛΟΓΟΥ
        </Link>
      </div>
    </section>
  );
};

export default MenuSection;
