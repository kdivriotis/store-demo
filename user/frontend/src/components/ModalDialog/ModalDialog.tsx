import { FC } from "react";
import { createPortal } from "react-dom";

import styles from "./ModalDialog.module.css";

export enum ActionStyle {
  Primary = 0,
  Secondary = 1,
  Error = 2,
}

interface ActionButton {
  text: string;
  style: ActionStyle;
  onClick: () => void;
}

interface ModalDialogProps {
  title: string;
  content: string;
  actions?: ActionButton[];
  onClose: () => void;
}

const ModalOverlay: FC<ModalDialogProps> = ({
  title,
  content,
  actions,
  onClose,
}) => {
  return (
    <div className={styles["overlay"]} onClick={onClose}>
      <div
        className={styles["dialog"]}
        onClick={(e) => {
          if (e.stopPropagation) e.stopPropagation();
        }}
      >
        {title && title.trim() !== "" && (
          <header className={styles["dialog-header"]}>
            <h3>{title}</h3>
          </header>
        )}
        {content && content.trim() !== "" && (
          <div className={styles["dialog-content"]}>
            <p>{content}</p>
          </div>
        )}
        {actions && actions.length > 0 && (
          <div className={styles["dialog-actions"]}>
            {actions.map((action, index) => (
              <button
                key={`action-${index}`}
                className={
                  action.style === ActionStyle.Primary
                    ? styles["dialog-actions_primary"]
                    : action.style === ActionStyle.Error
                    ? styles["dialog-actions_error"]
                    : styles["dialog-actions_secondary"]
                }
                onClick={action.onClick}
              >
                {action.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ModalDialog: FC<ModalDialogProps> = ({
  title,
  content,
  actions,
  onClose,
}) => {
  return (
    <>
      {createPortal(
        <ModalOverlay
          title={title}
          content={content}
          actions={actions}
          onClose={onClose}
        />,
        document.getElementById("modal-dialog") as HTMLElement
      )}
    </>
  );
};

export default ModalDialog;
