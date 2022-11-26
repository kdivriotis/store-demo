import { FC } from "react";
import classNames from "classnames";

import styles from "./ImageSection.module.css";

const ImageSection: FC = () => {
  return (
    <section
      id="store-image"
      className={classNames(styles["store-image-section"])}
    ></section>
  );
};

export default ImageSection;
