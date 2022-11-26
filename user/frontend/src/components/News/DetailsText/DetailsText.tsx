import { FC } from "react";
import MDEditor from "@uiw/react-md-editor";

import styles from "./DetailsText.module.css";

interface DetailsTextProps {
  content: string;
}

const DetailsText: FC<DetailsTextProps> = ({ content }) => {
  if (!content || content.trim() === "") return <></>;
  return (
    <section className="section-padding" data-color-mode="light">
      <MDEditor.Markdown
        source={content}
        linkTarget="_blank"
        className={styles["markdown-container"]}
      />
    </section>
  );
};

export default DetailsText;
