import express from "express";
import { schedule, trains } from "../data.js";
import { ScheduleEntryProps } from "../components/Schedule/Schedule.js";

import cors from "cors";

export const app = express();

const corsOptions = {
  origin: ["http://localhost:1234", "http://127.0.0.1:1234"],
  methods: ["GET"],
};

const getUniqueScheduleDates = (): string[] => {
  const uniqueDates: string[] = [];
  for (let i = 0; i < schedule.length; i++) {
    if (!uniqueDates.includes(schedule[i].date)) {
      uniqueDates.push(schedule[i].date);
    }
  }
  return uniqueDates;
};
app.use(cors(corsOptions));

export const getScheduledTrains = (date: string): ScheduleEntryProps[] => {
  return schedule
    .filter((entry) => entry.date === date)
    .map((entry) => ({
      ...entry,
      ...trains[entry.train],
    }));
};

app.get("/schedule", (req, res) => {
  try {
    // throw new Error("Test 500");
    const date = req.query.date;

    console.log(typeof date);

    if (typeof date !== "string" || !getUniqueScheduleDates().includes(date)) {
      return res.status(400).json({
        error:
          "No trains are available on this date. This could be because the train is sold out, the service is not running, or because tickets are not yet on sale. Please try a different travel date, or check back later",
      });
    }

    console.log(getScheduledTrains(date));

    return res.json(getScheduledTrains(date));
  } catch (err) {
    return res.status(500).json({
      error:
        "The website or API server encountered an unexpected problem and could not complete your request",
    });
  }
});

export const startServerIfMain = (isMain = require.main === module): void => {
  if (!isMain) return;

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
  });
};

startServerIfMain();
