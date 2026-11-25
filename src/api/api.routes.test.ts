/** @jest-environment node */

import { createServer, get, IncomingHttpHeaders } from "http";
import { AddressInfo } from "net";
import { schedule } from "../data.js";
import { app } from "./api";

const noTrainsResponse = {
  error:
    "No trains are available on this date. This could be because the train is sold out, " +
    "the service is not running, or because tickets are not yet on sale. " +
    "Please try a different travel date, or check back later",
};

describe("GET /schedule", () => {
  const server = createServer(app);

  beforeAll((done) => {
    server.listen(0, "127.0.0.1", done);
  });

  afterAll((done) => {
    server.close(done);
  });

  function requestSchedule(query: string) {
    const { port } = server.address() as AddressInfo;

    return new Promise<{
      status: number | undefined;
      headers: IncomingHttpHeaders;
      body: unknown;
    }>((resolve, reject) => {
      get(`http://127.0.0.1:${port}/schedule${query}`, (response) => {
        let body = "";
        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          body += chunk;
        });
        response.on("error", reject);
        response.on("end", () => {
          try {
            resolve({
              status: response.statusCode,
              headers: response.headers,
              body: JSON.parse(body),
            });
          } catch (error) {
            reject(error);
          }
        });
      }).on("error", reject);
    });
  }

  it("returns 200 and the scheduled trains as JSON for a valid date", async () => {
    const response = await requestSchedule("?date=2022-06-21");

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/application\/json/);
    expect(response.body).toEqual([
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

  it("returns 400 with an error message when no trains are scheduled", async () => {
    const response = await requestSchedule("?date=2026-11-23");

    expect(response.status).toBe(400);
    expect(response.body).toEqual(noTrainsResponse);
  });

  it.each([
    ["missing", ""],
    ["empty", "?date="],
    ["malformed", "?date=21-06-2022"],
    ["impossible", "?date=2026-02-30"],
    ["repeated", "?date=2022-06-20&date=2022-06-21"],
    ["object-valued", "?date[value]=2022-06-21"],
  ])("returns 400 when the date parameter is %s", async (_description, query) => {
    const response = await requestSchedule(query);

    expect(response.status).toBe(400);
    expect(response.body).toEqual(noTrainsResponse);
  });

  it("returns 500 with a generic message when the schedule lookup fails", async () => {
    const filter = jest
      .spyOn<Pick<typeof schedule, "filter">, "filter">(schedule, "filter")
      .mockImplementation(() => {
        throw new Error("Schedule lookup failed");
      });

    try {
      const response = await requestSchedule("?date=2022-06-21");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        error:
          "The website or API server encountered an unexpected problem and could not complete your request",
      });
    } finally {
      filter.mockRestore();
    }
  });
});
