import { FC, useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";

import { useIntersectionObserver } from "../../../hooks";

import styles from "./OurPiesSection.module.css";

const OurPiesSection: FC = () => {
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
      id="our-pies"
      ref={sectionRef}
      className={classNames(styles["our-pies-section"], "section-padding")}
    >
      <div className={classNames(styles["our-pies-section_spacer"])}></div>
      <div className={classNames(styles["our-pies-section_info"])}>
        <div
          className={classNames(
            "hidden-right",
            "delay-750",
            appearedOnce && "show"
          )}
        >
          <h2 className="header-base">ΑΥΘΕΝΤΙΚΕΣ ΚΡΕΠΕΣ, ΞΕΧΩΡΙΣΤΗ ΓΕΥΣΗ</h2>
          <hr className="primary-divider" />
        </div>
        <p
          className={classNames(
            "text-base",
            "hidden-right",
            "delay-1000",
            appearedOnce && "show"
          )}
        >
          Η ποιότητα είναι η κύρια προτεραιότητά μας. Οι κρέπες μας φτιάχνονται
          πάντα με φρέσκα και αγνά υλικά. Το χειροποίητο φύλλο της κρέπας, το
          ψήσιμο χωρίς λάδι και τα υλικά που χρησιμοποιούμε, κάνουν τις κρέπες
          μας υγιεινές, ενώ η ξεχωριστή τους γεύση είναι το μυστικό της
          επιτυχίας.
        </p>
        <Link
          className={classNames(styles["our-pies-section_info_btn"])}
          to="/"
        >
          ΜΑΘΕΤΕ ΠΕΡΙΣΣΟΤΕΡΑ
        </Link>
      </div>
    </section>
  );
};

export default OurPiesSection;
