import { FC, Fragment } from "react";
import classNames from "classnames";

import styles from "./TextSection.module.css";

interface TextSectionProps {
  alignRight?: boolean;
  title?: string;
  paragraphs?: string[];
  note?: string;
}

const TextSection: FC<TextSectionProps> = ({
  alignRight = false,
  title,
  paragraphs,
  note,
}) => {
  return (
    <section
      className={classNames(
        { [styles["text-section_left"]]: !alignRight },
        { [styles["text-section_right"]]: alignRight },
        "section-padding"
      )}
      aria-label={title}
    >
      {title && (
        <h1 className={classNames(styles["text-section_title"])}>{title}</h1>
      )}
      <br />
      {paragraphs?.map((paragraph, idx) => (
        <Fragment key={`${title}-p-${idx}`}>
          <p className={classNames(styles["text-section_paragraph"])}>
            {paragraph}
          </p>
          <br />
        </Fragment>
      ))}
      {note && (
        <p className={classNames(styles["text-section_note"])}>{note}</p>
      )}
    </section>
  );
};

export default TextSection;
