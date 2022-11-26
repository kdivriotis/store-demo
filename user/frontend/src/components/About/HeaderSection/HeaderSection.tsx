import { FC } from "react";
import classNames from "classnames";

import styles from "./HeaderSection.module.css";

const SubtitleSection: FC = () => {
  return (
    <header
      className={classNames(styles["about-section_header"], "section-padding")}
    >
      Το κατάστημά μας δεν είναι απλά ένα εστιατόριο με κρέπες – είμαστε μια
      αυθεντική creperie που τοποθετεί τη χρήση ποιοτικών προϊόντων ως ύψιστη
      προτεραιότητα. Είμαστε περήφανοι και χαρούμενοι να σας προσφέρουμε τις πιο
      αυθεντικές και εκλεπτυσμένες γεύσεις στην Αττική!
    </header>
  );
};

export default SubtitleSection;
