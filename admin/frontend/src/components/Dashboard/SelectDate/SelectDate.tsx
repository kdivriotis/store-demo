import { FC } from "react";
import classNames from "classnames";

import { DateSelectionBy } from "../../../interfaces/Statistics";
import DateSelectionByForm from "./DateSelectionBy/DateSelectionByForm";
import FormSelection from "./FormSelection/FormSelection";

import styles from "./SelectDate.module.css";

interface SelectDateProps {
  isDisabled: boolean;
  selectionBy: DateSelectionBy;
  setSelectionBy: (s: DateSelectionBy) => void;
  selectedYear: number;
  setSelectedYear: (y: number) => void;
  selectedMonth: number;
  setSelectedMonth: (m: number) => void;
  selectedDay: number;
  setSelectedDay: (d: number) => void;
  availableYears: number[];
  monthNames: string[];
  availableDays: { value: number; description: string }[];
}

const SelectDate: FC<SelectDateProps> = ({
  isDisabled,
  selectionBy,
  setSelectionBy,
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  selectedDay,
  setSelectedDay,
  availableYears,
  monthNames,
  availableDays,
}) => {
  return (
    <div className={classNames(styles["select-date"])}>
      <DateSelectionByForm
        selected={selectionBy}
        setSelected={setSelectionBy}
      />
      <div className={classNames(styles["select-date_inputs"])}>
        {selectionBy >= DateSelectionBy.Day && (
          <FormSelection
            label="Ημέρα"
            uniqueKey="d"
            options={availableDays}
            isDisabled={isDisabled}
            selectedValue={selectedDay}
            setSelectedValue={setSelectedDay}
          />
        )}
        {selectionBy >= DateSelectionBy.Month && (
          <FormSelection
            label="Μήνας"
            uniqueKey="m"
            options={monthNames.map((month, index) => {
              return { value: index + 1, description: month };
            })}
            isDisabled={isDisabled}
            selectedValue={selectedMonth}
            setSelectedValue={setSelectedMonth}
          />
        )}
        <FormSelection
          label="Έτος"
          uniqueKey="y"
          options={availableYears.map((year) => {
            return { value: year, description: `${year}` };
          })}
          isDisabled={isDisabled}
          selectedValue={selectedYear}
          setSelectedValue={setSelectedYear}
        />
      </div>
    </div>
  );
};

export default SelectDate;
