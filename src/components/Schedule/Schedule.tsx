import React from "react";
import { formatDateFunction } from "../../utils/utils";

export type ScheduleEntryProps = {
  train: number;
  date: string;
  origin: string;
  destination: string;
};

export const Schedule: React.FC<{ entries: ScheduleEntryProps[] }> = (
  props
) => {
  return (
    <table>
      <caption>Scheduled trains</caption>
      <thead>
        <tr>
          <th scope="col">Orgin</th>
          <th scope="col">Destination</th>
          <th scope="col">Date</th>
          <th scope="col">Train number</th>
        </tr>
      </thead>
      <tbody>
        {props.entries.map((entry) => (
          <tr key={`${entry.date}-${entry.train}`}>
            <td>{entry.origin}</td>
            <td>{entry.destination}</td>
            <td>{formatDateFunction(entry.date)}</td>
            <td>{entry.train}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
