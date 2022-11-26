import { ChangeEvent, FC } from "react";
import classNames from "classnames";

import styles from "./FormSelection.module.css";

interface Option {
  value: number;
  description: string;
}

interface FormSelectionProps {
  label: string;
  uniqueKey: string;
  options: Option[];
  isDisabled: boolean;
  selectedValue: number;
  setSelectedValue: (v: number) => void;
}

const FormSelection: FC<FormSelectionProps> = ({
  label,
  uniqueKey,
  options,
  isDisabled,
  selectedValue,
  setSelectedValue,
}) => {
  const changeHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    const sel = parseInt(e.target.value);
    if (isNaN(sel)) return;

    setSelectedValue(sel);
  };

  return (
    <div className={classNames(styles["form-selection"])}>
      <label htmlFor="select-date-by-input">{label}</label>
      <select
        id={`select-${uniqueKey}-input`}
        value={selectedValue}
        onChange={changeHandler}
        disabled={isDisabled}
      >
        {options.map((opt, index) => (
          <option value={opt.value} key={`sel-${uniqueKey}-${index}`}>
            {opt.description}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FormSelection;
