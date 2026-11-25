import { createServer } from "http";
import { app, getScheduledTrains, startServerIfMain } from "./api";

describe("getScheduledTrains", () => {
  it("returns every train requested on 2022-06-20 with its route", () => {
    expect(getScheduledTrains("2022-06-20")).toEqual([
      {
        train: 9062,
        date: "2022-06-20",
        origin: "London",
        destination: "Brussels",
      },
      {
        train: 9063,
        date: "2022-06-20",
        origin: "London",
        destination: "Paris",
      },
      {
        train: 9064,
        date: "2022-06-20",
        origin: "Paris",
        destination: "London",
      },
    ]);
  });

  it("returns every train requested on 2022-06-21 with its route", () => {
    expect(getScheduledTrains("2022-06-21")).toEqual([
      {
        train: 9063,
        date: "2022-06-21",
        origin: "London",
        destination: "Paris",
      },
      {
        train: 9064,
        date: "2022-06-21",
        origin: "Paris",
        destination: "London",
      },
    ]);
  });

  it("excludes trains scheduled only on other dates", () => {
    expect(
      getScheduledTrains("2022-06-21").map((entry) => entry.train)
    ).toEqual([9063, 9064]);
  });

  it("returns an empty array when no trains are scheduled", () => {
    expect(getScheduledTrains("2022-06-22")).toEqual([]);
  });
});

describe("API startup", () => {
  const originalPort = process.env.PORT;

  afterEach(() => {
    if (originalPort === undefined) {
      delete process.env.PORT;
    } else {
      process.env.PORT = originalPort;
    }
    jest.restoreAllMocks();
  });

  it("does not start a listener when the API is imported", () => {
    const listen = jest.spyOn(app, "listen").mockReturnValue(createServer());

    startServerIfMain();

    expect(listen).not.toHaveBeenCalled();
  });

  it.each([
    ["the default port", undefined, 3000],
    ["the configured port", "4567", "4567"],
  ])("listens on %s when run directly", (_description, configuredPort, expectedPort) => {
    if (configuredPort === undefined) {
      delete process.env.PORT;
    } else {
      process.env.PORT = configuredPort;
    }
    const listen = jest.spyOn(app, "listen").mockImplementation((_port, onListening) => {
      onListening?.();
      return createServer();
    });
    const log = jest.spyOn(console, "log").mockImplementation(() => {});

    startServerIfMain(true);

    expect(listen).toHaveBeenCalledTimes(1);
    expect(listen).toHaveBeenCalledWith(expectedPort, expect.any(Function));
    expect(log).toHaveBeenCalledWith(`API listening on http://localhost:${expectedPort}`);
  });
});
