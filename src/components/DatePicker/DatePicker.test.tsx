import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { DatePicker } from "./DatePicker";

describe("DatePicker", () => {
  it("displays the supplied date and updates when the value prop changes", () => {
    const onSelect = jest.fn();
    const { rerender } = render(
      <DatePicker value="2022-06-21" onSelect={onSelect} />
    );
    const input = screen.getByLabelText("Travel date") as HTMLInputElement;

    expect(input.type).toBe("date");
    expect(input.value).toBe("2022-06-21");

    rerender(<DatePicker value="2022-06-22" onSelect={onSelect} />);

    expect(input.value).toBe("2022-06-22");
  });

  it("calls onSelect with the selected date", () => {
    const onSelect = jest.fn();
    render(<DatePicker value="2022-06-21" onSelect={onSelect} />);

    fireEvent.change(screen.getByLabelText("Travel date"), {
      target: { value: "2022-06-22" },
    });

    expect(onSelect).toHaveBeenCalledWith("2022-06-22");
  });

  it("calls onSelect with an empty string when the date is cleared", () => {
    const onSelect = jest.fn();
    render(<DatePicker value="2022-06-21" onSelect={onSelect} />);

    fireEvent.change(screen.getByLabelText("Travel date"), {
      target: { value: "" },
    });

    expect(onSelect).toHaveBeenCalledWith("");
  });
});
