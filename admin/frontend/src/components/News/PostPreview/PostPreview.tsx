import { FC } from "react";
import MDEditor from "@uiw/react-md-editor";
import classNames from "classnames";

import { ImageSlider } from "../../index";

import styles from "./PostPreview.module.css";

interface PostPreviewProps {
  title: string;
  subtitle: string;
  content: string;
  mainImage: string | undefined | null;
}

const PostPreview: FC<PostPreviewProps> = ({
  title,
  subtitle,
  content,
  mainImage,
}) => {
  return (
    <>
      <section className={classNames(styles["post-header"], "section-padding")}>
        <h1>{title}</h1>
        {subtitle && subtitle.trim() !== "" && <h3>{subtitle}</h3>}
      </section>
      {mainImage && (
        <div
          className={classNames(styles["post-image"])}
          aria-label={`Εικόνες για το άρθρο ${title}`}
        >
          <ImageSlider images={[{ url: mainImage, title: title }]} />
        </div>
      )}
      <section className="section-padding" data-color-mode="light">
        <MDEditor.Markdown
          source={content}
          linkTarget="_blank"
          className={styles["post-content"]}
        />
      </section>
    </>
  );
};

export default PostPreview;
