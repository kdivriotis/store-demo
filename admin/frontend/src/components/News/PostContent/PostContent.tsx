import React, { FC } from "react";
import MDEditor, {
  commands,
  ICommand,
  TextState,
  TextAreaTextApi,
} from "@uiw/react-md-editor";

import styles from "./PostContent.module.css";

const styling: ICommand = {
  name: "styling",
  keyCommand: "styling",
  buttonProps: { "aria-label": "Insert styles" },
  icon: (
    <svg width="12" height="12" viewBox="0 0 520 520">
      <path
        fill="black"
        d="M256.282 339.488zM64 32l34.946 403.219L255.767 480l157.259-44.85L448 32H64zm290.676 334.898l-98.607 28.125-98.458-28.248L150.864 289h48.253l3.433 39.562 53.586 15.163.132.273h.034l53.467-14.852L315.381 265H203l-4-50h120.646l4.396-51H140l-4-49h240.58l-21.904 251.898z"
      />
    </svg>
  ),
  execute: (state: TextState, api: TextAreaTextApi) => {
    let modifyText = `${state.selectedText}\n<!--rehype:style=text-align: center; background-color: var(--color-primary); color: var(--color-secondary); -->`;
    if (!state.selectedText) {
      modifyText = `\n<!--rehype:style=text-align: center; background-color: var(--color-primary); color: var(--color-secondary); -->`;
    }
    api.replaceSelection(modifyText);
  },
};

interface PostContentProps {
  content: string | undefined;
  setContent: React.Dispatch<React.SetStateAction<string | undefined>>;
  isLoading: boolean;
}

const PostContent: FC<PostContentProps> = ({
  content,
  setContent,
  isLoading,
}) => {
  return (
    <div className={styles["editor-container"]} data-color-mode="light">
      <label htmlFor="content-input">Κείμενο</label>
      <MDEditor
        id="content-input"
        height={500}
        value={content}
        onChange={setContent}
        commands={[
          commands.bold,
          commands.italic,
          commands.strikethrough,
          commands.hr,
          commands.group(
            [
              commands.title1,
              commands.title2,
              commands.title3,
              commands.title4,
              commands.title5,
              commands.title6,
            ],
            {
              name: "title",
              groupName: "title",
              buttonProps: { "aria-label": "Insert title" },
            }
          ),
          styling,
          commands.divider,
          commands.link,
          commands.quote,
          commands.divider,
          commands.unorderedListCommand,
          commands.orderedListCommand,
          commands.checkedListCommand,
        ]}
      />
    </div>
  );
};

export default PostContent;
