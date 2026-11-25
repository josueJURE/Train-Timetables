import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Schedule, ScheduleEntryProps } from "./components/Schedule/Schedule";
import { DatePicker } from "./components/DatePicker/DatePicker";

const apiUrl = "http://localhost:3000";
const currentDay = new Date().toISOString().slice(0, 10);

export const App = () => {
  const [date, setDate] = useState(() => currentDay);
  const [entries, setEntries] = useState<ScheduleEntryProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasLoadError, setHasLoadError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    let active = true;
    setEntries([]);
    setHasLoadError(false);
    setLoading(Boolean(date));

    if (date) {
      (async () => {
        try {
          const response = await fetch(`${apiUrl}/schedule?date=${date}`);
          const data = await response.json();
          if (!response.ok) {
            setHasLoadError(true);
            setErrorMsg(data.error);
            return;
          }
          if (active) setEntries(data);
        } catch {
          if (active) setHasLoadError(true);
        } finally {
          if (active) setLoading(false);
        }
      })();
    }
    return () => {
      active = false;
    };
  }, [date]);

  return (
    <>
      <main>
        <DatePicker value={date} onSelect={setDate} />

        {loading && <p role="status">Loading trains…</p>}
        {hasLoadError && <p role="alert">{errorMsg}</p>}
        {date && !loading && !hasLoadError && <Schedule entries={entries} />}
      </main>
    </>
  );
};

const container = document.querySelector("#app");
if (container) ReactDOM.render(<App />, container);

