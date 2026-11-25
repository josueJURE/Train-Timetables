import React from "react";

type DatePickerProps = {
  value: string;
  onSelect: (date: string) => void;
};

export const DatePicker = ({ value, onSelect }: DatePickerProps) =>  {
  return (
    <input
      type="date"
      aria-label="Travel date"
      value={value}
      onChange={(event) => onSelect(event.currentTarget.value)}
    />
  );
}