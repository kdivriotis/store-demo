import { ChangeEvent, FC } from "react";
import classNames from "classnames";

import { DateSelectionBy } from "../../../../interfaces/Statistics";

import styles from "./DateSelectionByForm.module.css";

interface DateSelectionByFormProps {
  selected: DateSelectionBy;
  setSelected: (s: DateSelectionBy) => void;
}

const DateSelectionByForm: FC<DateSelectionByFormProps> = ({
  selected,
  setSelected,
}) => {
  const selectHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    const selection = parseInt(e.target.value) as DateSelectionBy;
    console.log(e.target.value);
    if (
      selection !== DateSelectionBy.Day &&
      selection !== DateSelectionBy.Month &&
      selection !== DateSelectionBy.Year
    )
      setSelected(DateSelectionBy.Month);
    else setSelected(selection);
  };

  return (
    <div className={classNames(styles["selection-form"])}>
      <label htmlFor="select-date-by-input">Προβολή στατιστικών ανά</label>
      <select
        id="select-date-by-input"
        value={selected}
        onChange={selectHandler}
      >
        <option value={DateSelectionBy.Year}>Έτος</option>
        <option value={DateSelectionBy.Month}>Μήνα</option>
        <option value={DateSelectionBy.Day}>Ημέρα</option>
      </select>
    </div>
  );
};

export default DateSelectionByForm;
