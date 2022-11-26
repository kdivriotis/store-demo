import { FC } from "react";
import classNames from "classnames";

import styles from "./ImageSection.module.css";

interface ImageSectionProps {
  imageUrl: string;
}

const ImageSection: FC<ImageSectionProps> = ({ imageUrl }) => {
  return (
    <section
      className={classNames(styles["about-section_image"])}
      style={{ backgroundImage: `url(${imageUrl})` }}
      aria-hidden
    ></section>
  );
};

export default ImageSection;
